import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';

interface Character {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  anime?: { id: number; title: string }[]; // Assuming anime associated with character
  voice_actors?: { id: number; name: string; language: string }[]; // Assuming voice actors associated
}

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const characterId = parseInt(id || '0');

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacterDetails();
  }, [characterId]);

  const fetchCharacterDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Character>(`/characters/${characterId}`);
      setCharacter(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch character details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!character) return <p className="text-white text-center">Character not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={character.image_url || 'https://via.placeholder.com/300x450.png?text=No+Image'}
            alt={character.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          
          {character.description && (
            <p className="text-gray-300 mb-4 leading-relaxed">{character.description}</p>
          )}

          {/* You can add sections for anime appearances and voice actors here if the backend supports it */}
          {/* Example for Anime Appearances (requires fetching associated anime from backend)
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white mb-2">Appears in Anime:</h3>
            <ul className="list-disc list-inside text-gray-300">
              {character.anime?.map(a => (
                <li key={a.id}>
                  <Link to={`/anime/${a.id}`} className="text-blue-400 hover:underline">{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          */}

          {/* Example for Voice Actors (requires fetching associated voice actors from backend)
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white mb-2">Voice Actors:</h3>
            <ul className="list-disc list-inside text-gray-300">
              {character.voice_actors?.map(va => (
                <li key={va.id}>
                  {va.name} ({va.language})
                </li>
              ))}
            </ul>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
