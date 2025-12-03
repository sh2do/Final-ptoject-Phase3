from app.database import SessionLocal, engine
from app.models import models
from app.auth import auth
from datetime import date

def init_db():
    db = SessionLocal()

    # Create all tables
    models.Base.metadata.create_all(bind=engine)

    # Add genres
    genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Sci-Fi", "Slice of Life", "Romance"]
    for genre_name in genres:
        if not db.query(models.Genre).filter(models.Genre.name == genre_name).first():
            db_genre = models.Genre(name=genre_name)
            db.add(db_genre)
    db.commit()

    # Add a user
    if not db.query(models.User).filter(models.User.username == "testuser").first():
        user = models.User(
            username="testuser",
            email="test@example.com",
            hashed_password=auth.get_password_hash("password")
        )
        db.add(user)
        db.commit()

    # Add a studio
    if not db.query(models.Studio).filter(models.Studio.name == "Studio Ghibli").first():
        studio = models.Studio(
            name="Studio Ghibli",
            country="Japan",
            founded_year=1985
        )
        db.add(studio)
        db.commit()

    # Add an anime
    if not db.query(models.Anime).filter(models.Anime.title == "Spirited Away").first():
        anime = models.Anime(
            title="Spirited Away",
            japanese_title="Sen to Chihiro no Kamikakushi",
            status="Finished Airing",
            type="Movie",
            synopsis="During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
            episodes_total=1,
            release_date=date(2001, 7, 20),
            studio_id=db.query(models.Studio).filter(models.Studio.name == "Studio Ghibli").first().id,
            cover_url="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/39wmItIW2asRToTpfA7K3i9V1h.jpg"
        )
        # Add genres to anime
        fantasy_genre = db.query(models.Genre).filter(models.Genre.name == "Fantasy").first()
        adventure_genre = db.query(models.Genre).filter(models.Genre.name == "Adventure").first()
        if fantasy_genre:
            anime.genres.append(fantasy_genre)
        if adventure_genre:
            anime.genres.append(adventure_genre)

        db.add(anime)
        db.commit()


    print("Database initialized.")
    db.close()

if __name__ == "__main__":
    init_db()
