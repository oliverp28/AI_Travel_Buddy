from fastapi import APIRouter, Request
from openai import OpenAI
from dotenv import load_dotenv
import os

# .env laden & OpenAI initialisieren
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

# Aktivitätsvorschläge generieren
def generate_activities(anreise, abreise, ziel, kategorien):
    kategorien_text = ", ".join(kategorien)

    system_message = (
        "Du bist ein Reiseplanungsassistent. "
        "Basierend auf dem Reiseziel, dem Reisezeitraum und den Interessen der Nutzerin/des Nutzers "
        "erstellst du Vorschläge für genau eine Aktivität pro Kategorie. "
        "Bitte liefere die Antwort im folgenden strukturierten Format:\n\n"

        "Kategorie: [Name der Kategorie]\n"
        "Aktivität:\n"
        "→ Name: [Name der Aktivität]\n"
        "→ Anbieter: [Name des Anbieters oder Veranstalters]\n"
        "→ Dauer: [z. B. 2 Stunden oder Halbtagesausflug]\n"
        "→ Kurzbeschreibung: [Eine knackige Beschreibung mit maximal 18 Wörtern]\n"
        "→ Langbeschreibung: [Detaillierte Beschreibung mit 50 bis 80 Wörtern]\n"
        "→ Preis pro Person: [z. B. 25 Euro]\n\n"

        "Verwende für jede Kategorie genau dieses Format und schreibe keine zusätzlichen Texte davor oder danach."
    )

    user_prompt = (
        f"Ich reise vom {anreise} bis zum {abreise} nach {ziel}. "
        f"Meine Interessen sind: {kategorien_text}. "
        f"Bitte gib für jede Kategorie genau eine passende Aktivität in dem oben genannten Format zurück."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ]
    )

    return response.choices[0].message.content

# API-Endpunkt für Reiseplanung
@router.post("/api/activities")
async def plan_trip(request: Request):
    data = await request.json()

    anreise = data.get("anreise")
    abreise = data.get("abreise")
    ziel = data.get("ziel")
    kategorien = data.get("kategorien", [])

    if not (anreise and abreise and ziel and kategorien):
        return {"error": "Fehlende Eingabedaten."}

    antwort = generate_activities(anreise, abreise, ziel, kategorien)

    return {"activities": antwort}

# API-Endpunkt für Chatbot
# Reiseinspirations-Chatbot: eigenständiger Endpoint
@router.post("/api/travelchat")
async def travel_chat(request: Request):
    body = await request.json()
    message = body.get("message")

    if not message:
        return {"reply": "Bitte gib eine Nachricht ein."}

    try:
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Du bist ein inspirierender Reise-Chatbot, der bei Urlaubsplanung hilft. "
                        "Gib Empfehlungen zu Reisezielen, Aktivitäten oder Tipps – gerne mit Emojis. "
                        "Antworten bitte freundlich, kurzweilig und hilfreich formulieren. Markdown ist erlaubt."
                    )
                },
                {"role": "user", "content": message}
            ]
        )

        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Fehler beim Abrufen der Antwort: {str(e)}"}
