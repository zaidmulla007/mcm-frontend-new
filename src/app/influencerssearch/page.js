"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaInfoCircle } from "react-icons/fa";
import { getYearOptions, getDynamicTimeframeOptions } from "../../../utils/dateFilterUtils";

// Helper function to format numbers
const formatNumber = (num) => {
  if (!num || num === 0) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1000000) {
    return Math.round(num / 1000000) + 'M';
  } else if (absNum >= 1000) {
    return Math.round(num / 1000) + 'K';
  }

  return num.toString();
};

// Helper function to format ROI percentage
const formatROI = (value) => {
  if (value === undefined || value === null || value === 0 || isNaN(value) || !isFinite(value)) return '0%';
  const absVal = Math.abs(value);
  let formatted;
  if (absVal >= 1e12) {
    formatted = Math.round(value / 1e12) + 'T';
  } else if (absVal >= 1e9) {
    formatted = Math.round(value / 1e9) + 'B';
  } else if (absVal >= 1e6) {
    formatted = Math.round(value / 1e6) + 'M';
  } else if (absVal >= 1) {
    formatted = Math.round(value);
  } else {
    formatted = value.toFixed(2);
  }
  return `${formatted}%`;
};

export default function InfluencerSearchPage() {
  const router = useRouter();
  const failedImagesRef = useRef(new Set());
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [youtubeInfluencers, setYoutubeInfluencers] = useState([]);
  const [telegramInfluencers, setTelegramInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter states
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("180_days");
  const [selectedYear, setSelectedYear] = useState(() => {
    const d = new Date();
    // If we are in Q1 (Jan=0, Feb=1, Mar=2), default to previous year
    // Else (Apr onwards), default to current year
    if (d.getMonth() < 3) {
      return (d.getFullYear() - 1).toString();
    }
    return d.getFullYear().toString();
  });

  // Client-side filters
  const [roiFilter, setRoiFilter] = useState("all");
  const [winRateFilter, setWinRateFilter] = useState("all");
  const [totalCallsFilter, setTotalCallsFilter] = useState("all");

  // State to track expanded summaries
  const [expandedSummaries, setExpandedSummaries] = useState({});

  // State for selected influencer (inline detail view)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Track which platforms have been fetched already
  const [ytFetched, setYtFetched] = useState(false);
  const [tgFetched, setTgFetched] = useState(false);

  // Fetch platform data on demand — only once per platform, then use cached data
  useEffect(() => {
    const fixedParams = "timeframe=180_days&year=all&rating=all";

    if (selectedPlatform === "youtube" && !ytFetched) {
      setLoading(true);
      setError(null);
      fetch(`/api/youtube-data?${fixedParams}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.results)) {
            setYoutubeInfluencers(data.results);
          }
          setYtFetched(true);
        })
        .catch(() => setError("Failed to fetch data"))
        .finally(() => { setLoading(false); setInitialLoad(false); });
    } else if (selectedPlatform === "telegram" && !tgFetched) {
      setLoading(true);
      setError(null);
      fetch(`/api/telegram-data?${fixedParams}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.results)) {
            setTelegramInfluencers(data.results);
          }
          setTgFetched(true);
        })
        .catch(() => setError("Failed to fetch data"))
        .finally(() => { setLoading(false); setInitialLoad(false); });
    }
  }, [selectedPlatform, ytFetched, tgFetched]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
      if (showSearchResults && !event.target.closest('.search-dropdown-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showSearchResults]);

  // Reset rating to default "all" when platform changes
  useEffect(() => {
    setSelectedRating("all");
  }, [selectedPlatform]);

  // Reset current page when platform, filters, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlatform, selectedRating, selectedTimeframe, selectedYear, roiFilter, winRateFilter, totalCallsFilter, searchQuery]);

  // Search functionality — build dropdown list on every keystroke
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const currentInfluencers = selectedPlatform === "youtube" ? youtubeInfluencers : telegramInfluencers;
      const searchTerm = searchQuery.toLowerCase().trim();

      const filtered = currentInfluencers.filter((influencer) => {
        if (selectedPlatform === "telegram") {
          const channelId = influencer.channel_id?.toLowerCase() || "";
          return channelId.includes(searchTerm);
        } else {
          const influencerName = influencer.influencer_name?.toLowerCase() || "";
          return influencerName.includes(searchTerm);
        }
      });

      const sortedResults = filtered.sort((a, b) => {
        const rankA = a.rank || 999999;
        const rankB = b.rank || 999999;
        return rankA - rankB;
      });

      setSearchResults(sortedResults.slice(0, 10));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, youtubeInfluencers, telegramInfluencers, selectedPlatform]);

  // Helper: get the year key for lookups ("all" → "all_years", otherwise the year string)
  const getYearKey = (year) => year === "all" ? "all_years" : year;

  // Helper: get rating for an influencer based on selected year + timeframe
  const getInfluencerRating = (raw, yearKey, timeframeKey) => {
    return raw.star_rating_yearly?.[yearKey]?.[timeframeKey]?.current_rating || 0;
  };

  // Helper: get score data for an influencer based on selected year + timeframe
  const getInfluencerScoreData = (raw, yearKey, timeframeKey) => {
    return raw.score_yearly_timeframes?.[yearKey]?.[timeframeKey] || {};
  };

  // Build filtered, sorted, and ranked influencer list — fully client-side
  const filteredInfluencers = useMemo(() => {
    const yearKey = getYearKey(selectedYear);
    const timeframeKey = selectedTimeframe;
    const rawList = selectedPlatform === "youtube" ? youtubeInfluencers : telegramInfluencers;

    // 1. Map raw data to normalized influencer objects with computed values for this year+timeframe
    let influencers = rawList.map((raw) => {
      const isYoutube = selectedPlatform === "youtube";
      const channelId = isYoutube ? raw.channel_id : (raw.channel_id || raw.id);
      const scoreData = getInfluencerScoreData(raw, yearKey, timeframeKey);
      const rating = getInfluencerRating(raw, yearKey, timeframeKey);

      return {
        id: channelId,
        name: isYoutube
          ? raw.influencer_name
          : (raw.influencer_name && raw.influencer_name !== "N/A" ? raw.influencer_name : (channelId || "Unknown Channel")),
        platform: isYoutube ? "YouTube" : "Telegram",
        subs: isYoutube ? raw.subs : (raw.subscribers || raw.subs || 0),
        channel_thumbnails: raw.channel_thumbnails,
        price_counts: raw.price_counts || 0,
        total_posts: raw.total_posts || 0,
        gemini_summary: raw.gemini_summary || '',
        Gemini: raw.Gemini || null,
        star_rating_yearly: raw.star_rating_yearly || {},
        score_yearly_timeframes: raw.score_yearly_timeframes || {},
        yearly_post_counts: raw.yearly_post_counts || {},
        // Computed values for current year+timeframe selection
        current_rating: rating,
        final_score: scoreData.final_score || 0,
        prob_weighted_returns: scoreData.prob_weighted_returns || 0,
        win_percentage: scoreData.win_percentage || 0,
      };
    });

    // 2. Hide influencers with no MCM rating for the selected year
    if (selectedYear !== "all") {
      influencers = influencers.filter(inf => inf.current_rating > 0);
    }

    // 3. Apply star rating filter
    if (selectedRating !== "all") {
      const minRating = parseInt(selectedRating);
      influencers = influencers.filter(inf => Math.floor(inf.current_rating) >= minRating);
    }

    // 4. Apply client-side ROI / Win Rate / Total Calls filters
    influencers = influencers.filter(influencer => {
      if (roiFilter !== "all") {
        const roi = influencer.prob_weighted_returns;
        if (roiFilter === "above_0.8" && roi < 0.8) return false;
        if (roiFilter === "0.5_to_0.8" && (roi < 0.5 || roi >= 0.8)) return false;
        if (roiFilter === "below_0.5" && roi >= 0.5) return false;
      }
      if (winRateFilter !== "all") {
        const winRate = influencer.win_percentage;
        if (winRateFilter === "above_70" && winRate < 70) return false;
        if (winRateFilter === "50_to_70" && (winRate < 50 || winRate >= 70)) return false;
        if (winRateFilter === "below_50" && winRate >= 50) return false;
      }
      if (totalCallsFilter !== "all") {
        const calls = influencer.price_counts;
        if (totalCallsFilter === "above_1000" && calls < 1000) return false;
        if (totalCallsFilter === "500_to_1000" && (calls < 500 || calls >= 1000)) return false;
        if (totalCallsFilter === "below_500" && calls >= 500) return false;
      }
      return true;
    });

    // 5. Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      influencers = influencers.filter(inf => {
        const name = inf.name?.toLowerCase() || '';
        const id = inf.id?.toLowerCase() || '';
        return name.includes(query) || id.includes(query);
      });
    }

    // 6. Sort by final_score descending
    influencers.sort((a, b) => b.final_score - a.final_score);

    // 7. Assign rank 1, 2, 3...
    influencers.forEach((inf, idx) => {
      inf.rank = idx + 1;
    });

    return influencers;
  }, [selectedPlatform, youtubeInfluencers, telegramInfluencers, selectedYear, selectedTimeframe, selectedRating, roiFilter, winRateFilter, totalCallsFilter, searchQuery]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      handlePageChange(totalPages);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage < maxPagesToShow - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Filter options - Dynamic rating filter based on available data
  const allRatingOptions = [
    { value: "all", label: "All", stars: 0 },
    { value: "5", label: "5", stars: 5 },
    { value: "4", label: "4", stars: 4 },
    { value: "3", label: "3", stars: 3 },
    { value: "2", label: "2", stars: 2 },
    { value: "1", label: "1", stars: 1 },
  ];

  // Filter rating options based on available ratings for current year+timeframe
  const ratingOptions = useMemo(() => {
    const rawList = selectedPlatform === "youtube" ? youtubeInfluencers : telegramInfluencers;
    const yearKey = getYearKey(selectedYear);
    const timeframeKey = selectedTimeframe;

    return allRatingOptions.filter(option => {
      if (option.value === "all") return true;
      const ratingValue = parseInt(option.value);
      return rawList.some(influencer => {
        const rating = getInfluencerRating(influencer, yearKey, timeframeKey);
        return Math.floor(rating) >= ratingValue;
      });
    });
  }, [selectedPlatform, youtubeInfluencers, telegramInfluencers, selectedYear, selectedTimeframe]);

  const timeframeOptions = getDynamicTimeframeOptions(selectedYear);

  const yearOptions = selectedPlatform === "telegram"
    ? getYearOptions(2024, false)
    : getYearOptions(2022);

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    const newTimeframeOptions = getDynamicTimeframeOptions(year);
    const isCurrentTimeframeValid = newTimeframeOptions.some(t => t.value === selectedTimeframe);
    if (!isCurrentTimeframeValid) {
      setSelectedTimeframe("30_days");
    }
  };

  // Pagination for ALL influencers
  const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInfluencers = filteredInfluencers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-fuchsia-50 text-gray-900 font-sans overflow-x-hidden relative">
      {/* Navigating Spinner Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 border-t-4 border-t-cyan-500"></div>
        </div>
      )}
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <main className="mx-auto px-4 pb-8 overflow-x-hidden relative z-10">
        <div className="min-w-0">
          {/* Leaderboard Section */}
          <div className="bg-gradient-to-br from-white/80 via-indigo-50/60 to-fuchsia-50/60 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-500/10 border-2 border-white/40">
            <div className="px-6 py-4 border-b border-indigo-200/30 bg-gradient-to-r from-cyan-50/50 to-fuchsia-50/50 backdrop-blur-sm overflow-visible relative z-20">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold flex items-center gap-3 drop-shadow-sm">
                  <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent leading-normal pb-2 inline-block">
                    Influencer Analysis
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full mt-1 shadow-lg shadow-indigo-500/50"></div>
              </div>

              {/* Filter Section inside Influencers */}
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className={selectedInfluencer ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase mb-2 text-center">Source</label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      disabled={!!selectedInfluencer}
                      className="w-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 backdrop-blur-sm border-2 border-indigo-300/50 hover:border-indigo-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="telegram">Telegram</option>
                    </select>
                  </div>

                  <div className={selectedInfluencer ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase mb-2 text-center">Rating</label>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      disabled={!!selectedInfluencer}
                      className="w-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 backdrop-blur-sm border-2 border-indigo-300/50 hover:border-indigo-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      {ratingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value === "all" ? "All Ratings" : "⭐".repeat(option.stars)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={selectedInfluencer ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase mb-2 text-center">Holding Period</label>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      disabled={!!selectedInfluencer}
                      className="w-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 backdrop-blur-sm border-2 border-indigo-300/50 hover:border-indigo-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      {timeframeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={selectedInfluencer ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase mb-2 text-center">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      disabled={!!selectedInfluencer}
                      className="w-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 backdrop-blur-sm border-2 border-indigo-300/50 hover:border-indigo-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      {yearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative search-dropdown-container lg:col-span-2">
                    <label className="block text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent uppercase mb-2 text-center">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (searchQuery.trim().length > 0 && searchResults.length > 0) {
                            setShowSearchResults(true);
                          }
                        }}
                        placeholder={selectedPlatform === "telegram" ? "Search by channel..." : "Search by name..."}
                        className="w-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 backdrop-blur-sm border-2 border-indigo-300/50 hover:border-indigo-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-md hover:shadow-lg placeholder:text-indigo-400/60 placeholder:font-normal"
                      />
                    </div>
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-indigo-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => {
                          const displayName = selectedPlatform === "telegram"
                            ? (result.channel_id || "Unknown Channel")
                            : (result.influencer_name || "Unknown");
                          const channelId = result.channel_id || result.id;
                          return (
                            <div
                              key={channelId}
                              onClick={() => {
                                setSearchQuery("");
                                setShowSearchResults(false);
                                setSelectedInfluencer(result);
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-indigo-50 cursor-pointer transition-all border-b border-indigo-100/50 last:border-b-0"
                            >
                              {result.channel_thumbnails?.high?.url ? (
                                <Image
                                  src={result.channel_thumbnails.high.url}
                                  alt={displayName}
                                  width={28}
                                  height={28}
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-200"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
                                  <span className="text-white text-[10px] font-bold">
                                    {displayName?.charAt(0)?.toUpperCase() || "?"}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-800 truncate">{displayName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {selectedInfluencer && (
              <div className="px-4 py-2">
                <button
                  onClick={() => setSelectedInfluencer(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all
                </button>
              </div>
            )}
            {/* Pagination Top */}
            {!selectedInfluencer && totalPages > 1 && (
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, filteredInfluencers.length)}</span> of{" "}
                  <span className="font-medium">{filteredInfluencers.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    First
                  </button>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
            <div className="overflow-hidden">
              <table className="w-full relative">
                <thead>
                  {/* Main header row */}
                  <tr className="bg-gradient-to-r from-cyan-500 to-indigo-500 border-b border-white/20">
                    <th className="px-1 py-2 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20 w-[10%]">
                      Influencer
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20 w-[15%]">
                      MCM Rating
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-bold text-white uppercase tracking-wider border-r border-white/20 w-[15%]">
                      Details
                    </th>
                    <th className="px-1 py-2 text-center text-xs font-bold text-white uppercase tracking-wider w-[55%]">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 relative" style={{ isolation: 'isolate' }}>
                  {selectedInfluencer ? (
                    (() => {
                      const inf = selectedInfluencer;
                      const isYoutube = selectedPlatform === "youtube";
                      const channelId = isYoutube ? inf.channel_id : (inf.channel_id || inf.id);
                      const displayName = isYoutube
                        ? (inf.influencer_name || "Unknown")
                        : (inf.influencer_name && inf.influencer_name !== "N/A" ? inf.influencer_name : (channelId || "Unknown Channel"));
                      const subs = isYoutube ? inf.subs : (inf.subscribers || inf.subs || 0);

                      const starRatingYearly = inf.star_rating_yearly || {};
                      const scoreYearlyTimeframes = inf.score_yearly_timeframes || {};
                      const yearKey = getYearKey(selectedYear);
                      const timeframeKey = selectedTimeframe;
                      const scoreData = scoreYearlyTimeframes[yearKey]?.[timeframeKey] || {};
                      const filteredROI = scoreData.prob_weighted_returns || 0;
                      const filteredWinRate = scoreData.win_percentage || 0;
                      const filteredPosts = selectedYear === "all"
                        ? (inf.total_posts || 0)
                        : (inf.yearly_post_counts?.[selectedYear] || 0);

                      // Build scatter data for MCM Rating column
                      const currentDate = new Date();
                      const currentRealYear = currentDate.getFullYear();
                      const currentRealMonth = currentDate.getMonth();
                      const scatterData = [];
                      const years = Object.keys(starRatingYearly)
                        .map(year => parseInt(year))
                        .filter(year => {
                          if (year < 2022) return false;
                          if (year > currentRealYear) return false;
                          if (year === currentRealYear && currentRealMonth < 3) return false;
                          return true;
                        })
                        .sort((a, b) => a - b);
                      years.forEach((year, yearIndex) => {
                        const yearData = starRatingYearly[year];
                        if (yearData && yearData[timeframeKey] && yearData[timeframeKey].current_rating !== undefined) {
                          scatterData.push({
                            year: yearIndex,
                            yearLabel: year,
                            rating: yearData[timeframeKey].current_rating,
                          });
                        }
                      });

                      // Gemini summary
                      let rawText = '';
                      if (inf.Gemini) {
                        const geminiData = selectedYear === "all" ? inf.Gemini.Overall : inf.Gemini.Yearly?.[selectedYear];
                        if (geminiData) {
                          const summary = geminiData.summary;
                          if (Array.isArray(summary)) rawText = summary.join(' ');
                          else if (typeof summary === 'string') rawText = summary;
                        }
                      }
                      if (!rawText && inf.gemini_summary) {
                        const fallback = inf.gemini_summary;
                        if (Array.isArray(fallback)) rawText = fallback.join(' ');
                        else if (typeof fallback === 'object') rawText = Object.values(fallback).join(' ');
                        else rawText = fallback;
                      }
                      const summaryText = rawText
                        .replace(/[•]\s*/g, '')
                        .replace(/\.,/g, '.')
                        .replace(/\s*,\s*$/gm, '')
                        .replace(/\n+/g, ' ')
                        .replace(/\s{2,}/g, ' ')
                        .trim();

                      const isExpanded = expandedSummaries['selected'];
                      const MAX_LENGTH = 690;
                      const shouldTruncate = summaryText.length > MAX_LENGTH;
                      const displayText = (shouldTruncate && !isExpanded)
                        ? summaryText.substring(0, MAX_LENGTH) + '...'
                        : summaryText;

                      return (
                        <>
                          {/* Same table row format as normal rows */}
                          <tr
                            className="cursor-pointer bg-gradient-to-r from-cyan-50/40 via-indigo-50/40 to-fuchsia-50/40 border-b border-indigo-100/50 hover:shadow-lg hover:scale-[1.01] hover:z-10 transition-all duration-300"
                            style={{ position: 'relative', zIndex: 1 }}
                            onClick={() => {
                              router.push(
                                isYoutube ? `/influencers/${channelId}` : `/telegram-influencer/${channelId}`
                              );
                            }}
                          >
                            {/* Influencer Column */}
                            <td className="px-1 py-2 border-r border-indigo-100/50 w-[10%]">
                              <div className="flex flex-col items-center gap-0.5">
                                <div className="flex-shrink-0">
                                  {inf.channel_thumbnails?.high?.url && !failedImagesRef.current.has(inf.channel_thumbnails.high.url) ? (
                                    <Image
                                      src={inf.channel_thumbnails.high.url}
                                      alt={displayName}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200/50 ring-offset-2 shadow-md"
                                      onError={() => {
                                        failedImagesRef.current.add(inf.channel_thumbnails.high.url);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 items-center justify-center flex ring-2 ring-indigo-200/50 ring-offset-2 shadow-md">
                                      <span className="text-white text-sm font-bold">
                                        {displayName?.match(/\b\w/g)?.join("").toUpperCase() || "?"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-center">
                                  <span className="text-[11px] font-bold text-gray-900 line-clamp-2">
                                    {displayName?.replace(/_/g, " ") || "Unknown"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* MCM Rating Column */}
                            <td className="px-3 py-2 border-r border-indigo-100/50 w-[15%]">
                              <div className="flex justify-center items-center py-1">
                                {scatterData.length > 0 ? (
                                  <div className="relative">
                                    <div className="relative">
                                      <div className="flex items-end gap-6 pl-1 h-24 pb-8">
                                        {scatterData.map((point, idx) => {
                                          const fullStars = Math.floor(point.rating);
                                          const hasHalfStar = point.rating % 1 >= 0.5;
                                          const totalStars = 5;
                                          const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
                                          return (
                                            <div
                                              key={idx}
                                              className="flex flex-col items-center relative min-w-[12px]"
                                              title={`Year: ${point.yearLabel}, Rating: ${point.rating}`}
                                            >
                                              <div className="flex flex-col-reverse gap-0">
                                                {[...Array(fullStars)].map((_, i) => (
                                                  <FaStar key={`full-${i}`} className="text-yellow-500 w-2.5 h-2.5" />
                                                ))}
                                                {hasHalfStar && (
                                                  <FaStarHalfAlt key="half" className="text-yellow-500 w-2.5 h-2.5" />
                                                )}
                                                {[...Array(emptyStars)].map((_, i) => (
                                                  <FaStar key={`empty-${i}`} className="text-gray-300 w-2.5 h-2.5" />
                                                ))}
                                              </div>
                                              <span
                                                className="text-[8px] text-black-500 font-semibold absolute whitespace-nowrap mt-2"
                                                style={{ top: '100%' }}
                                              >
                                                {point.yearLabel}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-gray-400">loading...</div>
                                )}
                              </div>
                            </td>

                            {/* Details Column */}
                            <td className="px-2 py-2 border-r border-indigo-100/50 w-[15%]">
                              <div className="flex items-center justify-center h-full">
                                <div className="grid grid-cols-2 gap-2.5">
                                  <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-blue-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-blue-900 font-bold uppercase tracking-wide">ROI</div>
                                    <div className="text-[10px] font-bold text-blue-700 w-full">
                                      {formatROI(filteredROI)}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-green-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-green-900 font-bold uppercase tracking-wide">Win Rate</div>
                                    <div className="text-[10px] font-bold text-green-700 truncate w-full">
                                      {filteredWinRate ? `${Math.round(filteredWinRate)}%` : '0%'}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-purple-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-purple-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-purple-900 font-bold uppercase tracking-wide">Posts</div>
                                    <div className="text-[10px] font-bold text-purple-700 truncate w-full">
                                      {filteredPosts ? filteredPosts.toLocaleString() : '0'}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-orange-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-orange-900 font-bold uppercase tracking-wide">Subs</div>
                                    <div className="text-[10px] font-bold text-orange-700 truncate w-full">
                                      {subs ? formatNumber(subs) : '0'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Summary Column */}
                            <td className="p-2 align-middle w-[75%]">
                              {summaryText ? (
                                <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-fuchsia-50/80 rounded-lg p-2.5 border border-indigo-200/40 mx-auto">
                                  <div className="text-[11px] text-gray-700 leading-snug text-justify">
                                    {displayText}
                                  </div>
                                  {shouldTruncate && !isExpanded && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedSummaries(prev => ({ ...prev, selected: true }));
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold mt-1 inline-block"
                                    >
                                      Read More
                                    </button>
                                  )}
                                  {isExpanded && shouldTruncate && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedSummaries(prev => ({ ...prev, selected: false }));
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold mt-1 inline-block"
                                    >
                                      Read Less
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 text-center p-4">No summary available</div>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    })()
                  ) : loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 border-t-4 border-t-cyan-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : initialLoad ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={`skeleton-row-${i}`}>
                        {/* Influencer column skeleton */}
                        <td className="px-1 py-1 whitespace-nowrap w-[10%]">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                          </div>
                        </td>
                        {/* MCM Ranking column skeleton */}
                        <td className="px-1 py-1 whitespace-nowrap w-[15%]">
                          <div className="h-20 bg-gray-200 rounded w-full"></div>
                        </td>
                        {/* Metrics column skeleton */}
                        <td className="px-2 py-1 whitespace-nowrap w-[20%]">
                          <div className="h-16 bg-gray-200 rounded w-full"></div>
                        </td>
                        {/* Summary column skeleton */}
                        <td className="px-3 py-1 whitespace-nowrap w-[75%]">
                          <div className="h-16 bg-gray-200 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredInfluencers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-lg font-semibold text-gray-600 mb-2">No influencers found</p>
                          <p className="text-sm text-gray-500">No influencers match the selected filters. Try adjusting your filter criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {/* Paginated influencers */}
                      {paginatedInfluencers.map((influencer, index) => {
                        // Values already computed in filteredInfluencers (prob_weighted_returns, win_percentage)
                        const filteredROI = influencer.prob_weighted_returns;
                        const filteredWinRate = influencer.win_percentage;
                        const filteredPosts = selectedYear === "all"
                          ? (influencer.total_posts || 0)
                          : (influencer.yearly_post_counts?.[selectedYear] || 0);

                        const starRatingYearly = influencer.star_rating_yearly || {};
                        const timeframeKey = selectedTimeframe;

                        // Extract all available yearly ratings dynamically, starting from 2022
                        const scatterData = [];
                        const currentDate = new Date();
                        const currentRealYear = currentDate.getFullYear();
                        const currentRealMonth = currentDate.getMonth();

                        const years = Object.keys(starRatingYearly)
                          .map(year => parseInt(year))
                          .filter(year => {
                            if (year < 2022) return false;

                            // Rule: Current year is only visible if Q1 is completed (April onwards)
                            // Future years are hidden
                            if (year > currentRealYear) return false;
                            if (year === currentRealYear && currentRealMonth < 3) return false;

                            return true;
                          }) // Filter to start from 2022 and apply visibility rules
                          .sort((a, b) => a - b); // Sort in ascending order

                        // Build scatter data for each year using selected timeframe
                        years.forEach((year, yearIndex) => {
                          const yearData = starRatingYearly[year];
                          if (yearData && yearData[timeframeKey] && yearData[timeframeKey].current_rating !== undefined) {
                            scatterData.push({
                              year: yearIndex,
                              yearLabel: year,
                              rating: yearData[timeframeKey].current_rating,
                              finalScore: yearData[timeframeKey].current_final_score
                            });
                          }
                        });

                        return (
                          <motion.tr
                            key={influencer.id}
                            layout
                            layoutId={`leaderboard-${influencer.id}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{
                              layout: {
                                type: "spring",
                                stiffness: 100,
                                damping: 18,
                                mass: 1.5
                              },
                              opacity: { duration: 0.5 },
                              x: { duration: 0.5 }
                            }}
                            className={`cursor-pointer transition-all duration-300 border-b border-indigo-100/50 ${index % 2 === 0
                              ? 'bg-white/50 hover:bg-gradient-to-r hover:from-cyan-50/40 hover:via-indigo-50/40 hover:to-fuchsia-50/40'
                              : 'bg-gradient-to-r from-indigo-50/20 to-fuchsia-50/20 hover:from-cyan-50/40 hover:via-indigo-50/40 hover:to-fuchsia-50/40'
                              } hover:shadow-lg hover:scale-[1.01] hover:z-10`}
                            style={{ position: 'relative', zIndex: 1 }}
                            onClick={() => {
                              router.push(
                                selectedPlatform === "youtube"
                                  ? `/influencers/${influencer.id}`
                                  : `/telegram-influencer/${influencer.id}`
                              );
                            }}
                          >
                            {/* Influencer Column */}
                            <td className="px-1 py-2 border-r border-indigo-100/50 w-[10%]">
                              <Link
                                href={
                                  selectedPlatform === "youtube"
                                    ? `/influencers/${influencer.id}`
                                    : `/telegram-influencer/${influencer.id}`
                                }
                                className="block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex flex-col items-center gap-0.5">
                                  {/* Profile Image */}
                                  <div className="flex-shrink-0">
                                    {influencer.channel_thumbnails?.high?.url && !failedImagesRef.current.has(influencer.channel_thumbnails.high.url) ? (
                                      <Image
                                        src={influencer.channel_thumbnails.high.url}
                                        alt={influencer.name || "Influencer"}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200/50 ring-offset-2 shadow-md"
                                        onError={() => {
                                          failedImagesRef.current.add(influencer.channel_thumbnails.high.url);
                                        }}
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 items-center justify-center flex ring-2 ring-indigo-200/50 ring-offset-2 shadow-md">
                                        <span className="text-white text-sm font-bold">
                                          {influencer.name?.match(/\b\w/g)?.join("").toUpperCase() || "?"}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Name Only */}
                                  <div className="text-center">
                                    <span className="text-[11px] font-bold text-gray-900 line-clamp-2">
                                      {influencer.name?.replace(/_/g, " ") || "Unknown"}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            </td>

                            {/* MCM Ranking Column - Yearly Rating Graph with Stars */}
                            <td className="px-3 py-2 border-r border-indigo-100/50 w-[15%]">
                              <div className="flex justify-center items-center py-1">
                                {scatterData.length > 0 ? (
                                  <div className="relative">
                                    {/* Graph container with axes */}
                                    <div className="relative">
                                      {/* Data columns with stars - FIXED: Increased gap and height */}
                                      <div className="flex items-end gap-6 pl-1 h-24 pb-8">
                                        {scatterData.map((point, idx) => {
                                          const fullStars = Math.floor(point.rating);
                                          const hasHalfStar = point.rating % 1 >= 0.5;
                                          const totalStars = 5;
                                          const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

                                          return (
                                            <div
                                              key={idx}
                                              className="flex flex-col items-center relative min-w-[12px]"
                                              title={`Year: ${point.yearLabel}, Rating: ${point.rating}`}
                                            >
                                              {/* Stars displayed vertically (bottom to top) */}
                                              <div className="flex flex-col-reverse gap-0">
                                                {[...Array(fullStars)].map((_, i) => (
                                                  <FaStar key={`full-${i}`} className="text-yellow-500 w-2.5 h-2.5" />
                                                ))}
                                                {hasHalfStar && (
                                                  <FaStarHalfAlt key="half" className="text-yellow-500 w-2.5 h-2.5" />
                                                )}
                                                {[...Array(emptyStars)].map((_, i) => (
                                                  <FaStar key={`empty-${i}`} className="text-gray-300 w-2.5 h-2.5" />
                                                ))}
                                              </div>
                                              {/* Year label at bottom (below x-axis) - FIXED: Better positioning with mt-2 */}
                                              <span
                                                className="text-[8px] text-black-500 font-semibold absolute whitespace-nowrap mt-2"
                                                style={{ top: '100%' }}
                                              >
                                                {point.yearLabel}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-gray-400">loading...</div>
                                )}
                              </div>
                            </td>

                            {/* Metrics Column */}
                            <td className="px-2 py-2 border-r border-indigo-100/50 w-[15%]">
                              <div className="flex items-center justify-center h-full">
                                {/* 2x2 Metrics Grid with enhanced styling */}
                                <div className="grid grid-cols-2 gap-2.5">
                                  {/* ROI - from selected year and timeframe */}
                                  <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-blue-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-blue-900 font-bold uppercase tracking-wide">ROI</div>
                                    <div className="text-[10px] font-bold text-blue-700 w-full">
                                      {formatROI(filteredROI)}
                                    </div>
                                  </div>

                                  {/* Win Rate - from selected year and timeframe */}
                                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-green-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-green-900 font-bold uppercase tracking-wide">Win Rate</div>
                                    <div className="text-[10px] font-bold text-green-700 truncate w-full">
                                      {filteredWinRate ? `${Math.round(filteredWinRate)}%` : '0%'}
                                    </div>
                                  </div>

                                  {/* Posts - from selected year */}
                                  <div className="bg-gradient-to-br from-purple-50 via-fuchsia-50 to-purple-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-purple-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-purple-900 font-bold uppercase tracking-wide">Posts</div>
                                    <div className="text-[10px] font-bold text-purple-700 truncate w-full">
                                      {filteredPosts ? filteredPosts.toLocaleString() : '0'}
                                    </div>
                                  </div>

                                  {/* Subscribers */}
                                  <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-xl p-2 text-center flex flex-col items-center justify-center w-[70px] h-[60px] border border-orange-200/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                                    <div className="text-[9px] text-orange-900 font-bold uppercase tracking-wide">Subs</div>
                                    <div className="text-[10px] font-bold text-orange-700 truncate w-full">
                                      {influencer.subs
                                        ? formatNumber(influencer.subs)
                                        : '0'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Summary Column */}
                            <td className="p-2 align-middle w-[75%]">
                              {(() => {
                                // Determine which summary to show based on selected year
                                let geminiData = null;
                                let summarySource = null;

                                if (influencer.Gemini) {
                                  if (selectedYear === "all") {
                                    // Show Overall summary
                                    geminiData = influencer.Gemini.Overall || null;
                                    summarySource = "overall";
                                  } else {
                                    // Show year-specific summary
                                    geminiData = influencer.Gemini.Yearly?.[selectedYear] || null;
                                    summarySource = "yearly";
                                  }
                                }

                                // Extract summary text from Gemini data
                                let rawText = '';
                                if (geminiData) {
                                  const summary = geminiData.summary;
                                  if (Array.isArray(summary)) {
                                    rawText = summary.join(' ');
                                  } else if (typeof summary === 'string') {
                                    rawText = summary;
                                  }
                                }

                                // Fallback to gemini_summary if no Gemini data
                                if (!rawText && influencer.gemini_summary) {
                                  const fallback = influencer.gemini_summary;
                                  if (Array.isArray(fallback)) {
                                    rawText = fallback.join(' ');
                                  } else if (typeof fallback === 'object') {
                                    rawText = Object.values(fallback).join(' ');
                                  } else {
                                    rawText = fallback;
                                  }
                                }

                                if (!rawText) {
                                  return <div className="text-xs text-gray-400 text-center p-4">No summary available</div>;
                                }

                                // Clean up: remove bullets, trailing commas after periods, and extra whitespace
                                const summaryText = rawText
                                  .replace(/[•]\s*/g, '')
                                  .replace(/\.,/g, '.')
                                  .replace(/\s*,\s*$/gm, '')
                                  .replace(/\n+/g, ' ')
                                  .replace(/\s{2,}/g, ' ')
                                  .trim();

                                const isExpanded = expandedSummaries[influencer.id];
                                const MAX_LENGTH = 690;
                                const shouldTruncate = summaryText.length > MAX_LENGTH;
                                const displayText = (shouldTruncate && !isExpanded)
                                  ? summaryText.substring(0, MAX_LENGTH) + '...'
                                  : summaryText;

                                return (
                                  <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-fuchsia-50/80 rounded-lg p-2.5 border border-indigo-200/40 mx-auto">
                                    {/* Summary Text */}
                                    <div className="text-[11px] text-gray-700 leading-snug text-justify">
                                      {displayText}
                                    </div>
                                    {shouldTruncate && !isExpanded && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedSummaries(prev => ({
                                            ...prev,
                                            [influencer.id]: !prev[influencer.id]
                                          }));
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold mt-1 inline-block"
                                      >
                                        Read More
                                      </button>
                                    )}

                                    {isExpanded && shouldTruncate && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedSummaries(prev => ({
                                            ...prev,
                                            [influencer.id]: !prev[influencer.id]
                                          }));
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold mt-1 inline-block"
                                      >
                                        Read Less
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!selectedInfluencer && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, filteredInfluencers.length)}</span> of{" "}
                  <span className="font-medium">{filteredInfluencers.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    First
                  </button>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}