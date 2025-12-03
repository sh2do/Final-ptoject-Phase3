from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Table, Float, DateTime
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from app.database import Base
import datetime

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Studio(Base):
    __tablename__ = 'studios'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String)
    founded_year = Column(Integer)

class Anime(Base):
    __tablename__ = 'anime'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    japanese_title = Column(String, index=True)
    status = Column(String)
    type = Column(String)
    synopsis = Column(String)
    episodes_total = Column(Integer)
    release_date = Column(Date)
    end_date = Column(Date)
    studio_id = Column(Integer, ForeignKey('studios.id'))
    cover_url = Column(String)
    studio = relationship("Studio")

class Episode(Base):
    __tablename__ = 'episodes'
    id = Column(Integer, primary_key=True, index=True)
    anime_id = Column(Integer, ForeignKey('anime.id'))
    episode_number = Column(Integer)
    title = Column(String)
    duration_minutes = Column(Integer)
    air_date = Column(Date)
    anime = relationship("Anime")

class UserAnimeProgress(Base):
    __tablename__ = 'user_anime_progress'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    anime_id = Column(Integer, ForeignKey('anime.id'))
    episodes_watched = Column(Integer)
    status = Column(String)
    score = Column(Integer)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    user = relationship("User")
    anime = relationship("Anime")

class Genre(Base):
    __tablename__ = 'genres'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

anime_genres = Table('anime_genres', Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.id')),
    Column('genre_id', Integer, ForeignKey('genres.id'))
)

class Character(Base):
    __tablename__ = 'characters'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    image_url = Column(String)

anime_characters = Table('anime_characters', Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.id')),
    Column('character_id', Integer, ForeignKey('characters.id')),
    Column('role', String)
)

class VoiceActor(Base):
    __tablename__ = 'voice_actors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    nationality = Column(String)
    birthdate = Column(Date)

character_voice_actors = Table('character_voice_actors', Base.metadata,
    Column('character_id', Integer, ForeignKey('characters.id')),
    Column('voice_actor_id', Integer, ForeignKey('voice_actors.id')),
    Column('language', String)
)

class UserFavorite(Base):
    __tablename__ = 'user_favorites'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    anime_id = Column(Integer, ForeignKey('anime.id'))
    character_id = Column(Integer, ForeignKey('characters.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User")
    anime = relationship("Anime")
    character = relationship("Character")
