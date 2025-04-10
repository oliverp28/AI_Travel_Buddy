#!/bin/bash

# Setup für AI Travel Buddy Projekt

# Schritt 1: Backend vorbereiten
echo "Erstelle virtuelle Umgebung..."
python3 -m venv venv

echo "Aktiviere virtuelle Umgebung..."
source venv/bin/activate

echo "Installiere Python-Abhaengigkeiten..."
pip install -r requirements.txt

echo "Starte main.py ..."
python3 backend/main.py

echo "Starte FastAPI-Server mit Uvicorn..."
uvicorn backend.main:app --reload

# Schritt 2: Frontend vorbereiten
echo "Wechsle in frontend/..."
cd frontend || { echo "Ordner 'frontend' nicht gefunden."; exit 1; }

echo "Installiere npm-Abhängigkeiten..."
npm install

echo "Starte React Development Server (läuft auf Port 3000)..."
npm start
