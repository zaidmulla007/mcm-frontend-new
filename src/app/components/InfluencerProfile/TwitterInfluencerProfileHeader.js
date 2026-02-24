"use client";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import Swal from "sweetalert2";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function TwitterInfluencerProfileHeader({ channelData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();

  // Check if current channel is favorite
  const isFavorite = channelData?.results?.channel_id
    ? checkIsFavorite(channelData.results.channel_id, "TWITTER")
    : false;

  const handleFavoriteClick = async () => {
    if (isLoading || !channelData?.results?.channel_id) return;

    setIsLoading(true);
    const newFavoriteState = !isFavorite;

    try {
      const response = await toggleFavorite(
        channelData.results.channel_id,
        "TWITTER",
        "INFLUENCER"
      );

      if (response.success) {
        Swal.fire({
          title: newFavoriteState ? 'Added to favourites' : 'Removed from favourite list',
          icon: newFavoriteState ? 'success' : 'info',
          background: '#ffffff',
          color: '#111827',
          confirmButtonColor: '#2563eb',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          customClass: {
            popup: 'colored-toast'
          }
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update favorite status. Please try again.',
        icon: 'error',
        background: '#ffffff',
        color: '#111827',
        confirmButtonColor: '#2563eb',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        customClass: {
          popup: 'colored-toast'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get first letter of channel name for avatar
  const getInitial = (name) => {
    if (!name) return "X";
    return name.charAt(0).toUpperCase();
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 border-b border-gray-200 mb-3 py-5">
      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
            {getInitial(channelData?.results?.channel_id)}
          </div>

          {/* Details and Heart Icon for Desktop */}
          <div className="flex-1 flex flex-col md:flex-row gap-8">
            {/* Channel Details */}
            <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
              {/* Title Section with Heart Icon (Mobile Only) */}
              <div className="flex flex-col items-center md:items-start w-full">
                <div className="flex items-center justify-center md:justify-start gap-2 w-full">
                  <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2">
                    {channelData.results?.channel_id || "Unknown Channel"}
                  </h1>
                  {/* Heart Icon Button - Mobile View Only */}
                  <button
                    onClick={handleFavoriteClick}
                    disabled={isLoading}
                    className={`md:hidden focus:outline-none transition-all duration-300 hover:scale-110 flex-shrink-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    ) : isFavorite ? (
                      <FaHeart className="text-red-500" size={24} />
                    ) : (
                      <FaRegHeart className="text-gray-400" size={24} />
                    )}
                  </button>
                </div>
              </div>

              <a
                href={`https://x.com/${channelData.results?.channel_id}`}
                className="text-gray-800 font-semibold hover:underline text-base mb-2 flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="w-4 h-4 text-gray-800 flex-shrink-0" />
                @{channelData.results?.channel_id || "Unknown"} - X (Twitter)
              </a>

              {/* Followers */}
              <div className="flex flex-col sm:flex-row gap-4 text-sm font-semibold text-black-900">
                <div className="flex items-center gap-2">
                  <span>Followers:</span>
                  <span className="text-black-900">
                    {(channelData.results?.followers_count || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Last System Updated */}
              <div className="flex flex-col sm:flex-row gap-4 text-sm font-semibold text-black-900">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-black-900 flex items-center gap-2">
                    <span>Last System Updated:</span>
                    <span className="text-black-900">
                      {channelData.results?.last_updated
                        ? new Date(channelData.results.last_updated).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          timeZone: "UTC",
                        })
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heart Icon for Desktop View */}
            <div className="hidden md:flex flex-col items-center md:items-end relative">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleFavoriteClick}
                  disabled={isLoading}
                  className={`focus:outline-none transition-all duration-300 hover:scale-110 flex-shrink-0 p-3 rounded-full bg-gray-50 border border-gray-300 hover:bg-gray-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isLoading ? (
                    <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  ) : isFavorite ? (
                    <FaHeart className="text-red-500" size={32} />
                  ) : (
                    <FaRegHeart className="text-gray-400" size={32} />
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  {isLoading ? "Processing..." : isFavorite ? "Added to Favorites" : "Add to Favorites"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
