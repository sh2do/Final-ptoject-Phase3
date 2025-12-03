from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime

# User
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Studio
class StudioBase(BaseModel):
    name: str
    country: Optional[str] = None
    founded_year: Optional[int] = None

class StudioCreate(StudioBase):
    pass

class Studio(StudioBase):
    id: int

    class Config:
        orm_mode = True

# Genre
class GenreBase(BaseModel):
    name: str

class GenreCreate(GenreBase):
    pass

class Genre(GenreBase):
    id: int

    class Config:
        orm_mode = True

# Anime
class AnimeBase(BaseModel):
    title: str
    japanese_title: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    synopsis: Optional[str] = None
    episodes_total: Optional[int] = None
    release_date: Optional[date] = None
    end_date: Optional[date] = None
    studio_id: Optional[int] = None
    cover_url: Optional[str] = None

class AnimeCreate(AnimeBase):
    genres: List[int] = []

class Anime(AnimeBase):
    id: int
    studio: Optional[Studio] = None
    genres: List[Genre] = []

    class Config:
        orm_mode = True

# Episode
class EpisodeBase(BaseModel):
    episode_number: int
    title: str
    duration_minutes: Optional[int] = None
    air_date: Optional[date] = None

class EpisodeCreate(EpisodeBase):
    anime_id: int

class Episode(EpisodeBase):
    id: int
    anime_id: int

    class Config:
        orm_mode = True

# UserAnimeProgress
class UserAnimeProgressBase(BaseModel):
    episodes_watched: int
    status: str
    score: Optional[int] = None

class UserAnimeProgressCreate(UserAnimeProgressBase):
    user_id: int
    anime_id: int

class UserAnimeProgress(UserAnimeProgressBase):
    id: int
    last_updated: datetime
    user: User
    anime: Anime

    class Config:
        orm_mode = True

# Character
class CharacterBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    id: int

    class Config:
        orm_mode = True

# VoiceActor
class VoiceActorBase(BaseModel):
    name: str
    nationality: Optional[str] = None
    birthdate: Optional[date] = None

class VoiceActorCreate(VoiceActorBase):
    pass

class VoiceActor(VoiceActorBase):
    id: int

    class Config:
        orm_mode = True

# UserFavorite
class UserFavoriteBase(BaseModel):
    user_id: int
    anime_id: Optional[int] = None
    character_id: Optional[int] = None

class UserFavoriteCreate(UserFavoriteBase):
    pass

class UserFavorite(UserFavoriteBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
        
# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
