import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMapPin, FiStar, FiPhone } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(`${API_URL}/users/${id}`);
      setUser(userRes.data.user);

      const listingsRes = await axios.get(`${API_URL}/users/${id}/listings`);
      setListings(listingsRes.data.listings);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Info */}
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <div className="flex items-start gap-6">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <FiUser size={64} />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-400" />
                <span className="font-bold">{user.rating.toFixed(1)}</span>
                <span className="text-gray-600">({user.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="space-y-2 text-gray-600">
              {user.city && (
                <div className="flex items-center gap-2">
                  <FiMapPin />
                  <span>{user.city}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2">
                  <FiPhone />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-4 text-gray-700">{user.bio}</p>
            )}

            <div className="mt-4 text-sm text-gray-600">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Active Listings */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Active Listings ({listings.length})</h2>
        
        {listings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-600">
            No active listings
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <a
                key={listing._id}
                href={`/listings/${listing._id}`}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                  <p className="text-blue-600 font-bold text-xl">${listing.price}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
