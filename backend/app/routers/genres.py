from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.models import models
from app.auth import auth

router = APIRouter()

@router.post("/genres/", response_model=schemas.Genre)
def create_genre(genre: schemas.GenreCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_genre = models.Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@router.get("/genres/", response_model=List[schemas.Genre])
def read_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    genres = db.query(models.Genre).offset(skip).limit(limit).all()
    return genres

@router.get("/genres/{genre_id}", response_model=schemas.Genre)
def read_genre(genre_id: int, db: Session = Depends(get_db)):
    db_genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
    if db_genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    return db_genre
