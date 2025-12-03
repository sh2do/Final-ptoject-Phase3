import React from 'react';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  id: number;
  title: string;
  cover_url?: string;
  status?: string;
  episodes_total?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ id, title, cover_url, status, episodes_total }) => {
  return (
    <Link to={`/anime/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <img
          src={cover_url || 'https://via.placeholder.com/150x200.png?text=No+Image'}
          alt={title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white truncate">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">Status: {status || 'N/A'}</p>
          <p className="text-gray-400 text-sm">Episodes: {episodes_total || 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
