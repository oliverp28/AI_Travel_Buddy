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
        "Basierend auf dem Reiseziel, dem Reisezeitraum und den Kategorien gibst du Vorschläge für Aktivitäten. "
        "Für jede Kategorie soll genau eine Aktivität vorgeschlagen werden im folgenden Format:\n\n"
        "Kategorie: [Name]\n"
        "Aktivität:\n"
        "→ Name: [Aktivitätsname]\n"
        "→ Kurzbeschreibung: [Text]\n"
        "→ Preis pro Person: [Betrag in Euro]"
    )

    user_prompt = (
        f"Ich reise vom {anreise} bis zum {abreise} nach {ziel}. "
        f"Meine Interessen sind: {kategorien_text}. "
        f"Bitte gib für jede Kategorie genau eine Aktivität wie im genannten Format aus."
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
