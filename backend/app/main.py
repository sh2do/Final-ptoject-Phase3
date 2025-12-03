from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import models
from app.routers import anime, users, auth, episodes, characters, studios, genres

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(anime.router, prefix="/api", tags=["anime"])
app.include_router(episodes.router, prefix="/api", tags=["episodes"])
app.include_router(characters.router, prefix="/api", tags=["characters"])
app.include_router(studios.router, prefix="/api", tags=["studios"])
app.include_router(genres.router, prefix="/api", tags=["genres"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Anime Collection Tracker API"}
