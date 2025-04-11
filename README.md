# AI Travel Buddy

**AI Travel Buddy** ist eine Anwendung, die mithilfe von KI personalisierte Reiseempfehlungen und -pläne bereitstellt. Sie kombiniert ein React-Frontend mit einem FastAPI-Backend und nutzt OpenAI's GPT-4 für die Generierung von Inhalten.

## Projektstruktur

```
AI_Travel_Buddy/
├── backend/
│   ├── main.py
│   ├── __init__.py
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── requirements.txt
├── Makefile
└── README.md
```

- **backend/**: Enthält das FastAPI-Backend, das die API-Endpunkte bereitstellt und die Kommunikation mit OpenAI verwaltet.
- **frontend/**: Beinhaltet das React-Frontend, das die Benutzeroberfläche der Anwendung darstellt.
- **Makefile**: Automatisiert die Einrichtung und den Start von Frontend und Backend.
- **README.md**: Diese Datei – enthält Informationen zum Projekt und zur Einrichtung.

## Voraussetzungen

Stellen Sie sicher, dass die folgenden Softwarekomponenten auf Ihrem System installiert sind:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 14+](https://nodejs.org/)
- [npm 6+](https://www.npmjs.com/get-npm)
- [make](https://www.gnu.org/software/make/)  
  _(Für Windows: nutze z. B. Git Bash, WSL oder installiere Make für Windows)_

> **Hinweis:**  
> Für die Nutzung der OpenAI-Funktionalitäten muss im Verzeichnis `backend/` eine `.env`-Datei erstellt werden, die den OpenAI API Key enthält:

```env
OPENAI_API_KEY=YOUR_KEY
```

## Einrichtung und Start mit `make`

Das Projekt nutzt ein `Makefile`, um die Einrichtung und den Startprozess zu vereinfachen.

### Backend starten:

```bash
make backend
```

Dieser Befehl führt folgende Schritte aus:

- Erstellt eine virtuelle Python-Umgebung
- Installiert alle Abhängigkeiten aus `requirements.txt`
- Startet den FastAPI-Server mit Uvicorn unter `http://localhost:8000`

### Frontend starten:

```bash
make frontend
```

Dieser Befehl:

- Wechselt in das `frontend/`-Verzeichnis
- Installiert die Node.js-Abhängigkeiten
- Startet den React-Entwicklungsserver unter `http://localhost:3000`

### Beide gemeinsam starten:

```bash
make all
```

Führt sowohl `make backend` als auch `make frontend` aus (nacheinander).

## Hinweise

- Stelle sicher, dass deine `.env`-Datei im `backend/`-Verzeichnis korrekt gesetzt ist.
- Bei der ersten Ausführung kann es ein paar Minuten dauern, bis alles installiert ist.
- Für produktive Deployments sollten weitere Sicherheits- und Performanceoptimierungen vorgenommen werden.

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
