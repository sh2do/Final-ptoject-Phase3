import React, { useState, useEffect } from 'react';
import api from '../api';
import AnimeCard from '../components/AnimeCard';
import CharacterCard from '../components/CharacterCard';
import Loader from '../components/Loader';

interface Anime {
  id: number;
  title: string;
  cover_url?: string;
  status?: string;
  episodes_total?: number;
}

interface Character {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResultsAnime, setSearchResultsAnime] = useState<Anime[]>([]);
  const [searchResultsCharacters, setSearchResultsCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResultsAnime([]);
      setSearchResultsCharacters([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch anime results
      const animeResponse = await api.get<Anime[]>(`/anime?search=${searchTerm}`);
      setSearchResultsAnime(animeResponse.data);

      // Fetch character results (assuming a search endpoint for characters)
      // This endpoint needs to be implemented in the backend: /characters?search=<term>
      const characterResponse = await api.get<Character[]>(`/characters?search=${searchTerm}`);
      setSearchResultsCharacters(characterResponse.data);

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Search</h1>

      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for anime or characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 rounded-l-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-lg transition duration-300"
        >
          Search
        </button>
      </form>

      {loading && <Loader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 mt-10">Anime Results</h2>
          {searchResultsAnime.length === 0 ? (
            <p className="text-center text-gray-400">No anime found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResultsAnime.map((anime) => (
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
          )}

          <h2 className="text-3xl font-bold text-white mb-6 mt-10">Character Results</h2>
          {searchResultsCharacters.length === 0 ? (
            <p className="text-center text-gray-400">No characters found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResultsCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  id={character.id}
                  name={character.name}
                  image_url={character.image_url}
                  description={character.description}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
