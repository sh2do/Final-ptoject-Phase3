from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.models import models
from app.auth import auth

router = APIRouter()

@router.post("/episodes/", response_model=schemas.Episode)
def create_episode(episode: schemas.EpisodeCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_episode = models.Episode(**episode.dict())
    db.add(db_episode)
    db.commit()
    db.refresh(db_episode)
    return db_episode

@router.get("/episodes/", response_model=List[schemas.Episode])
def read_episodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    episodes = db.query(models.Episode).offset(skip).limit(limit).all()
    return episodes

@router.get("/anime/{anime_id}/episodes/", response_model=List[schemas.Episode])
def read_anime_episodes(anime_id: int, db: Session = Depends(get_db)):
    episodes = db.query(models.Episode).filter(models.Episode.anime_id == anime_id).all()
    return episodes

@router.get("/episodes/{episode_id}", response_model=schemas.Episode)
def read_episode(episode_id: int, db: Session = Depends(get_db)):
    db_episode = db.query(models.Episode).filter(models.Episode.id == episode_id).first()
    if db_episode is None:
        raise HTTPException(status_code=404, detail="Episode not found")
    return db_episode
