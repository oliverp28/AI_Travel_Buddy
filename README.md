# AI Travel Buddy

**AI Travel Buddy** ist eine KI-gestützte Anwendung zur Erstellung personalisierter Reiseempfehlungen und -pläne. Sie kombiniert ein React-Frontend mit einem FastAPI-Backend und nutzt GPT-4 von OpenAI für intelligente Routenvorschläge.

---

## Projektstruktur

```
AI_Travel_Buddy/
├── backend/               # FastAPI-Backend (Python)
│   ├── main.py
│   ├── __init__.py
│   └── ...
├── frontend/              # React-Frontend (JavaScript)
│   ├── src/
│   ├── public/
│   └── ...
├── requirements.txt       # Python-Abhängigkeiten
├── Makefile               # Build-/Start-Skript für Frontend & Backend
└── README.md              # Diese Datei
```

---

## Voraussetzungen

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 14+](https://nodejs.org/)
- [npm 6+](https://www.npmjs.com/)
- [GNU Make](https://www.gnu.org/software/make/) (unter Windows: Git Bash, WSL oder Make für Windows)

> **.env-Datei nicht vergessen:**  
> Erstelle im `backend/`-Verzeichnis eine `.env` mit deinem OpenAI API Key:
> 
> ```env
> OPENAI_API_KEY=dein-openai-api-key
> ```

---

## Schnellstart mit `make`

Im Projektverzeichnis kannst du alles mit `make` steuern:

### Backend starten:
```bash
make backend
```
- Erstellt virtuelle Umgebung
- Installiert Python-Abhängigkeiten
- Startet FastAPI-Server auf [http://localhost:8000](http://localhost:8000)

### Frontend starten:
```bash
make frontend
```
- Installiert npm-Abhängigkeiten
- Startet React-Dev-Server auf [http://localhost:3000](http://localhost:3000)

### Beide zusammen starten:
```bash
make all
```

---

## Manuelle Einrichtung (optional)

Falls du `make` nicht nutzen möchtest:

### Backend:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

---

## Hinweise

- Stelle sicher, dass deine `.env`-Datei korrekt eingerichtet ist.
- Für produktive Umgebungen solltest du `.env`-Variablen schützen und ggf. Deployment-Optimierungen vornehmen.
- Backend-API: [http://localhost:8000/docs](http://localhost:8000/docs) bietet interaktive Swagger-Dokumentation.

---

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
