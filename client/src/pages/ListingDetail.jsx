import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUser, FiStar } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ListingDetail = ({ user, token }) => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await axios.get(`${API_URL}/listings/${id}`);
      setListing(res.data.listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!listing) {
    return <div className="text-center py-12">Listing not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Images */}
        <div className="md:col-span-2">
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
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

          {/* Details */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
            <p className="text-3xl text-blue-600 font-bold mb-4">${listing.price}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FiMapPin />
                <span>{listing.location.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Category:</span>
                <span>{listing.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Condition:</span>
                <span>{listing.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Seller Info & Actions */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Seller Information</h3>
            <Link
              to={`/profile/${listing.seller._id}`}
              className="flex items-center gap-4 mb-6 hover:text-blue-600"
            >
              {listing.seller.profileImage ? (
                <img
                  src={listing.seller.profileImage}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <FiUser />
                </div>
              )}
              <div>
                <p className="font-bold">{listing.seller.name}</p>
                <p className="text-sm text-gray-600">{listing.seller.city}</p>
              </div>
            </Link>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiStar className="text-yellow-400" />
                <span className="font-bold">{listing.seller.rating.toFixed(1)}</span>
                <span className="text-gray-600">
                  ({listing.seller.totalReviews} reviews)
                </span>
              </div>
            </div>

            {user && user.id !== listing.seller._id ? (
              <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-3">
                Send Message
              </button>
            ) : null}

            {user && user.id === listing.seller._id ? (
              <>
                <Link
                  to={`/edit-listing/${listing._id}`}
                  className="block text-center bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 mb-3"
                >
                  Edit Listing
                </Link>
                <button className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">
                  Delete Listing
                </button>
              </>
            ) : null}

            {!user ? (
              <Link
                to="/login"
                className="block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              >
                Login to Contact Seller
              </Link>
            ) : null}
          </div>

          {/* Views Count */}
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-gray-600">Views: {listing.views}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
