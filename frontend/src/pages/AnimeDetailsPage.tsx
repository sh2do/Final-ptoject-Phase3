import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import EpisodeList from '../components/EpisodeList';
import { useAuth } from '../context/AuthContext';

interface Anime {
  id: number;
  title: string;
  japanese_title?: string;
  status?: string;
  type?: string;
  synopsis?: string;
  episodes_total?: number;
  release_date?: string;
  end_date?: string;
  cover_url?: string;
  studio?: { id: number; name: string };
  genres?: { id: number; name: string }[];
}

interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  title: string | null;
  duration_minutes: number | null;
  air_date: string | null;
}

interface UserAnimeProgress {
  id: number;
  user_id: number;
  anime_id: number;
  episodes_watched: number;
  status: string;
  score: number | null;
}

const AnimeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id || '0');
  const { user, isAuthenticated } = useAuth();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [progress, setProgress] = useState<UserAnimeProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentEpisodesWatched, setCurrentEpisodesWatched] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<string>('Plan to Watch');
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  useEffect(() => {
    fetchAnimeDetails();
    fetchAnimeEpisodes();
    if (isAuthenticated && user) {
      fetchUserProgress(user.id);
    }
  }, [animeId, isAuthenticated, user?.id]);

  const fetchAnimeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Anime>(`/anime/${animeId}`);
      setAnime(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch anime details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimeEpisodes = async () => {
    try {
      const response = await api.get<Episode[]>(`/episodes/anime/${animeId}`);
      setEpisodes(response.data);
    } catch (err: any) {
      console.error('Failed to fetch episodes:', err);
    }
  };

  const fetchUserProgress = async (userId: number) => {
    try {
      const response = await api.get<UserAnimeProgress>(`/anime/${animeId}/progress/${userId}`);
      setProgress(response.data);
      setCurrentEpisodesWatched(response.data.episodes_watched);
      setCurrentStatus(response.data.status);
      setCurrentScore(response.data.score);
    } catch (err: any) {
      // If no progress found, initialize it (API handles default creation)
      console.log('No user progress found, might create default:', err.response?.data?.detail);
    }
  };

  const handleProgressUpdate = async () => {
    if (!isAuthenticated || !user) {
      alert('Please log in to update your progress.');
      return;
    }
    try {
      const response = await api.post<UserAnimeProgress>(`/anime/${animeId}/progress`, {
        user_id: user.id,
        anime_id: animeId,
        episodes_watched: currentEpisodesWatched,
        status: currentStatus,
        score: currentScore,
      });
      setProgress(response.data);
      alert('Progress updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update progress');
    }
  };


  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!anime) return <p className="text-white text-center">Anime not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={anime.cover_url || 'https://via.placeholder.com/300x450.png?text=No+Image'}
            alt={anime.title}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-white mb-2">{anime.title}</h1>
          {anime.japanese_title && <h2 className="text-2xl text-gray-400 mb-4">{anime.japanese_title}</h2>}
          
          <p className="text-gray-300 mb-2"><strong>Status:</strong> {anime.status}</p>
          <p className="text-gray-300 mb-2"><strong>Type:</strong> {anime.type}</p>
          <p className="text-gray-300 mb-2"><strong>Episodes:</strong> {anime.episodes_total || 'N/A'}</p>
          <p className="text-gray-300 mb-2"><strong>Release Date:</strong> {anime.release_date}</p>
          <p className="text-gray-300 mb-2"><strong>Studio:</strong> {anime.studio ? anime.studio.name : 'N/A'}</p>
          <p className="text-gray-300 mb-4">
            <strong>Genres:</strong> {anime.genres?.map(g => g.name).join(', ') || 'N/A'}
          </p>

          <p className="text-gray-300 mb-4 leading-relaxed">{anime.synopsis}</p>

          {isAuthenticated && user && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">Your Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-1">Episodes Watched:</label>
                  <input
                    type="number"
                    min="0"
                    max={anime.episodes_total || 9999}
                    value={currentEpisodesWatched}
                    onChange={(e) => setCurrentEpisodesWatched(parseInt(e.target.value))}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-1">Status:</label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  >
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-1">Score (1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={currentScore || ''}
                    onChange={(e) => setCurrentScore(parseInt(e.target.value) || null)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  />
                </div>
              </div>
              <button
                onClick={handleProgressUpdate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Update Progress
              </button>
            </div>
          )}

        </div>
      </div>
      <EpisodeList episodes={episodes} />
    </div>
  );
};

export default AnimeDetailsPage;
