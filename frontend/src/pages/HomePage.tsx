import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <h1 className="text-5xl font-extrabold text-white mb-6">
        Welcome to AnimeTracker!
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl">
        Your ultimate companion for tracking, discovering, and managing your anime collection.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/anime"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Explore Anime
        </Link>
        {!isAuthenticated && (
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Join Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
