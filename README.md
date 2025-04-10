# AI Travel Buddy

**AI Travel Buddy** ist eine Anwendung, die mithilfe von KI personalisierte Reiseempfehlungen und -pläne bereitstellt. Sie kombiniert ein React-Frontend mit einem FastAPI-Backend und nutzt OpenAI's GPT-4 für die Generierung von Inhalten.

## Projektstruktur

```
AI_Travel_Buddy/
├── backend/
│   ├── backend.py
│   ├── main.py
│   ├── __init__.py
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── setup.sh
└── README.md
```

- **backend/**: Enthält das FastAPI-Backend, das die API-Endpunkte bereitstellt und die Kommunikation mit OpenAI's API verwaltet.
- **frontend/**: Beinhaltet das React-Frontend, das die Benutzeroberfläche der Anwendung darstellt.
- **setup.sh**: Ein Bash-Skript zur Installation und zum Starten der erforderlichen Abhängigkeiten.
- **README.md**: Diese Datei, die Informationen über das Projekt und Anweisungen zur Einrichtung enthält.

## Voraussetzungen

Stellen Sie sicher, dass die folgenden Softwarekomponenten auf Ihrem System installiert sind:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 14+](https://nodejs.org/)
- [npm 6+](https://www.npmjs.com/get-npm)

## Einrichtung und Start

Das Projekt enthält ein Bash-Skript `setup.sh`, das die Installation der Abhängigkeiten und den Start der Entwicklungsserver für Backend und Frontend automatisiert.

### Nutzung von `setup.sh`

1. Navigieren Sie im Terminal in das Hauptverzeichnis des Projekts:

   ```bash
   cd /pfad/zum/AI_Travel_Buddy
   ```

2. Machen Sie das Skript ausführbar (falls nicht bereits geschehen):

   ```bash
   chmod +x setup.sh
   ```

3. Führen Sie das Skript aus:

   ```bash
   ./setup.sh
   ```

Das Skript führt die folgenden Schritte aus:

- Erstellt und aktiviert eine Python-virtuelle Umgebung im `backend/`-Verzeichnis.
- Installiert die Python-Abhängigkeiten aus der `requirements.txt`.
- Startet den FastAPI-Server mit Uvicorn.
- Wechselt in das `frontend/`-Verzeichnis.
- Installiert die Node.js-Abhängigkeiten mit `npm install`.
- Startet den React-Entwicklungsserver mit `npm start`.

### Manuelle Einrichtung

Falls Sie die Schritte manuell durchführen möchten:

**Backend:**

1. Navigieren Sie in das `backend/`-Verzeichnis:

   ```bash
   cd backend
   ```

2. Erstellen und aktivieren Sie eine virtuelle Umgebung:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Für Unix-basierte Systeme
   # oder
   venv\Scripts\activate     # Für Windows
   ```

3. Installieren Sie die Python-Abhängigkeiten:

   ```bash
   pip install -r requirements.txt
   ```

4. Starten Sie den FastAPI-Server:

   ```bash
   uvicorn main:app --reload
   ```

**Frontend:**

1. Öffnen Sie ein neues Terminal und navigieren Sie in das `frontend/`-Verzeichnis:

   ```bash
   cd frontend
   ```

2. Installieren Sie die Node.js-Abhängigkeiten:

   ```bash
   npm install
   ```

3. Starten Sie den React-Entwicklungsserver:

   ```bash
   npm start
   ```

Der React-Entwicklungsserver läuft standardmäßig auf `http://localhost:3000/`.

## Hinweise

- Stellen Sie sicher, dass die Umgebungsvariablen, insbesondere für die OpenAI-API, korrekt gesetzt sind.
- Für Produktionsumgebungen sollten zusätzliche Sicherheits- und Leistungsanpassungen vorgenommen werden.

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).