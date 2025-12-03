import React from 'react';

interface Episode {
  id: number;
  anime_id: number;
  episode_number: number;
  title: string | null;
  duration_minutes: number | null;
  air_date: string | null; // Assuming ISO string for date
}

interface EpisodeListProps {
  episodes: Episode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  if (!episodes || episodes.length === 0) {
    return <p className="text-gray-400">No episodes available yet.</p>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4 shadow-md">
      <h3 className="text-xl font-bold mb-4 text-white">Episodes</h3>
      <ul>
        {episodes.map((episode) => (
          <li key={episode.id} className="border-b border-gray-700 py-2 last:border-b-0">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">
                Ep. {episode.episode_number}: {episode.title || 'Untitled'}
              </span>
              <span className="text-gray-400 text-sm">
                {episode.duration_minutes ? `${episode.duration_minutes} min` : ''}
                {episode.air_date && ` - ${new Date(episode.air_date).toLocaleDateString()}`}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeList;
