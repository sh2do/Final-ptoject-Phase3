import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import api from '../api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  // Add other user-specific data as needed
}

const UserProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile(user.id);
    } else {
      setLoading(false);
      setError("User not authenticated.");
    }
  }, [isAuthenticated, user]);

  const fetchUserProfile = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<UserProfile>(`/users/${userId}`);
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!profile) return <p className="text-white text-center">No profile data available.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">User Profile</h1>
        <div className="space-y-4">
          <p className="text-lg text-gray-300"><strong>Username:</strong> {profile.username}</p>
          <p className="text-lg text-gray-300"><strong>Email:</strong> {profile.email}</p>
          <p className="text-lg text-gray-300"><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          {/* Add more profile details here */}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
