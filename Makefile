.PHONY: backend frontend setup-backend install-backend start-backend setup-frontend start-frontend all

# Backend-Setup und Start
backend: setup-backend install-backend start-backend

setup-backend:
	@echo "Erstelle virtuelle Umgebung..."
	python3 -m venv venv

install-backend:
	@echo "Installiere Python-Abhaengigkeiten..."
	venv/bin/pip install -r requirements.txt

start-backend:
	@echo "Starte FastAPI-Server mit Uvicorn..."
	venv/bin/uvicorn backend.main:app --reload

# Frontend-Setup und Start
frontend: setup-frontend start-frontend

setup-frontend:
	@echo "Wechsle in frontend/..."
	cd frontend && npm install

start-frontend:
	@echo "Starte React Development Server (läuft auf Port 3000)..."
	cd frontend && npm start
