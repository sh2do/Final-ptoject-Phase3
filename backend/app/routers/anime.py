from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas import schemas
from app.models import models
from app.auth import auth

router = APIRouter()

@router.post("/anime/", response_model=schemas.Anime)
def create_anime(anime: schemas.AnimeCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_anime = models.Anime(**anime.dict(exclude={"genres"}))
    for genre_id in anime.genres:
        genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
        if genre:
            db_anime.genres.append(genre)
    db.add(db_anime)
    db.commit()
    db.refresh(db_anime)
    return db_anime

@router.get("/anime/", response_model=List[schemas.Anime])
def read_anime_list(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    genre: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Anime)
    if search:
        query = query.filter(models.Anime.title.contains(search))
    if genre:
        query = query.join(models.anime_genres).join(models.Genre).filter(models.Genre.name == genre)
    if status:
        query = query.filter(models.Anime.status == status)
    
    anime_list = query.offset(skip).limit(limit).all()
    return anime_list

@router.get("/anime/{anime_id}", response_model=schemas.Anime)
def read_anime(anime_id: int, db: Session = Depends(get_db)):
    db_anime = db.query(models.Anime).filter(models.Anime.id == anime_id).first()
    if db_anime is None:
        raise HTTPException(status_code=404, detail="Anime not found")
    return db_anime

@router.put("/anime/{anime_id}", response_model=schemas.Anime)
def update_anime(anime_id: int, anime: schemas.AnimeCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_anime = db.query(models.Anime).filter(models.Anime.id == anime_id).first()
    if db_anime is None:
        raise HTTPException(status_code=404, detail="Anime not found")
    
    for key, value in anime.dict(exclude_unset=True, exclude={"genres"}).items():
        setattr(db_anime, key, value)
        
    db_anime.genres.clear()
    for genre_id in anime.genres:
        genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
        if genre:
            db_anime.genres.append(genre)

    db.commit()
    db.refresh(db_anime)
    return db_anime

@router.delete("/anime/{anime_id}", response_model=schemas.Anime)
def delete_anime(anime_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_anime = db.query(models.Anime).filter(models.Anime.id == anime_id).first()
    if db_anime is None:
        raise HTTPException(status_code=404, detail="Anime not found")
    db.delete(db_anime)
    db.commit()
    return db_anime
