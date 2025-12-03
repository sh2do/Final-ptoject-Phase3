from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.models import models
from app.auth import auth

router = APIRouter()

@router.post("/studios/", response_model=schemas.Studio)
def create_studio(studio: schemas.StudioCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_studio = models.Studio(**studio.dict())
    db.add(db_studio)
    db.commit()
    db.refresh(db_studio)
    return db_studio

@router.get("/studios/", response_model=List[schemas.Studio])
def read_studios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    studios = db.query(models.Studio).offset(skip).limit(limit).all()
    return studios

@router.get("/studios/{studio_id}", response_model=schemas.Studio)
def read_studio(studio_id: int, db: Session = Depends(get_db)):
    db_studio = db.query(models.Studio).filter(models.Studio.id == studio_id).first()
    if db_studio is None:
        raise HTTPException(status_code=404, detail="Studio not found")
    return db_studio
