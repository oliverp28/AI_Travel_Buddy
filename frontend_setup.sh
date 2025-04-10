#!/bin/bash

# Setup für AI Travel Buddy Projekt

# Schritt 1: Frontend vorbereiten
echo "Wechsle in frontend/..."
cd frontend || { echo "Ordner 'frontend' nicht gefunden."; exit 1; }

echo "Installiere npm-Abhängigkeiten..."
npm install

echo "Starte React Development Server (läuft auf Port 3000)..."
npm start