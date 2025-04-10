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
