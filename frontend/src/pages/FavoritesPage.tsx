import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import CharacterCard from '../components/CharacterCard';

interface FavoriteItem {
    id: number;
    user_id: number;
    anime_id: number | null;
    character_id: number | null;
    created_at: string;
    // Assuming backend will populate these directly in the future or via separate fetches
    anime?: {
        id: number;
        title: string;
        cover_url?: string;
        status?: string;
        episodes_total?: number;
    };
    character?: {
        id: number;
        name: string;
        image_url?: string;
    };
}

const FavoritesPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchFavorites(user.id);
        } else {
            setLoading(false);
            setError("User not authenticated.");
        }
    }, [isAuthenticated, user]);

    const fetchFavorites = async (userId: number) => {
        setLoading(true);
        setError(null);
        try {
            // This endpoint needs to be implemented in the backend:
            // e.g., /users/{user_id}/favorites
            const response = await api.get<FavoriteItem[]>(`/users/${userId}/favorites`);
            setFavorites(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Favorites</h1>
            
            {favorites.length === 0 && (
                <p className="text-center text-gray-400 mt-8">You haven't added any favorites yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((item) => (
                    item.anime ? (
                        <AnimeCard
                            key={`anime-${item.anime.id}`}
                            id={item.anime.id}
                            title={item.anime.title}
                            cover_url={item.anime.cover_url}
                            status={item.anime.status}
                            episodes_total={item.anime.episodes_total}
                        />
                    ) : item.character ? (
                        <CharacterCard
                            key={`char-${item.character.id}`}
                            id={item.character.id}
                            name={item.character.name}
                            image_url={item.character.image_url}
                        />
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
