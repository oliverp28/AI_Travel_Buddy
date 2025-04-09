from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In Produktion: domains einschränken!
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
