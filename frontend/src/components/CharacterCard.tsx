import React from 'react';
import { Link } from 'react-router-dom';

interface CharacterCardProps {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ id, name, image_url, description }) => {
  return (
    <Link to={`/characters/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        <img
          src={image_url || 'https://via.placeholder.com/150x200.png?text=No+Image'}
          alt={name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white truncate">{name}</h3>
          {description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>}
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard;
