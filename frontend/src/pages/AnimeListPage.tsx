import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import Loader from '../components/Loader';

interface Anime {
  id: number;
  title: string;
  cover_url?: string;
  status?: string;
  episodes_total?: number;
}

interface Genre {
  id: number;
  name: string;
}

const AnimeListPage: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchAnime();
    fetchGenres();
  }, [selectedGenre, selectedStatus, searchTerm]);

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/anime?';
      if (selectedGenre) url += `genre_name=${selectedGenre}&`;
      if (selectedStatus) url += `status=${selectedStatus}&`;
      if (searchTerm) url += `search=${searchTerm}&`;
      
      const response = await api.get<Anime[]>(url);
      setAnimeList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch anime');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get<Genre[]>('/genres');
      setGenres(response.data);
    } catch (err: any) {
      console.error('Failed to fetch genres:', err);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Anime List</h1>

      {/* Filters and Search */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.name}>{genre.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Airing">Airing</option>
          <option value="Finished Airing">Finished Airing</option>
          <option value="Not yet aired">Not yet aired</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            cover_url={anime.cover_url}
            status={anime.status}
            episodes_total={anime.episodes_total}
          />
        ))}
      </div>
      {animeList.length === 0 && !loading && <p className="text-center text-gray-400 mt-8">No anime found matching your criteria.</p>}
    </div>
  );
};

export default AnimeListPage;
