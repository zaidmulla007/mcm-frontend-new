"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MarketHeatmap = () => {
  const [topCoinsTimeFilter, setTopCoinsTimeFilter] = useState("24hrs");
  const [memeCoinsTimeFilter, setMemeCoinsTimeFilter] = useState("24hrs");
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://mcmapi.showmyui.com:3035/api/admin/youtubedata/topcoins');
      const data = await response.json();
      setHeatmapData(data);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  // Get color based on bullish vs bearish count (matching heatmap screenshot)
  const getColorIntensity = (bullishCount, bearishCount) => {
    if (bullishCount > bearishCount) {
      return "bg-green-600"; // Green for bullish majority
    } else if (bearishCount > bullishCount) {
      return "bg-red-600"; // Red for bearish majority  
    } else {
      return "bg-blue-600"; // Blue for equal/neutral counts
    }
  };

  // Get size based on total mentions
  const getSizeClass = (totalMentions, maxMentions) => {
    const ratio = totalMentions / maxMentions;
    if (ratio >= 0.8) return "col-span-2 row-span-2";
    if (ratio >= 0.6) return "col-span-2 row-span-1";
    if (ratio >= 0.4) return "col-span-1 row-span-2";
    return "col-span-1 row-span-1";
  };

  const renderHeatmapTiles = (coinType, timeFilter) => {
    if (!heatmapData || !heatmapData.resultsByTimeframe) return null;

    const timeframeData = heatmapData.resultsByTimeframe[timeFilter];
    if (!timeframeData) return null;

    const coins = coinType === "topcoins" ? timeframeData.topCoins : timeframeData.mem_coins;
    if (!coins || coins.length === 0) return null;

    // Sort coins by total mentions in descending order (highest first)
    const sortedCoins = [...coins].sort((a, b) => b.total_mentions - a.total_mentions);
    const maxMentions = Math.max(...sortedCoins.map(coin => coin.total_mentions));

    return sortedCoins.slice(0, 16).map((coin, index) => {
      const colorClass = getColorIntensity(coin.bullish_count, coin.bearish_count);
      const sizeClass = getSizeClass(coin.total_mentions, maxMentions);

      return (
        <motion.div
          key={`${coin.symbol}-${index}`}
          className={`${colorClass} ${sizeClass} rounded-lg p-3 flex flex-col justify-between text-white relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05, z: 10 }}
        >
          <div className="relative z-10">
            <div className="text-sm font-bold">{coin.symbol}</div>
            <div className="text-xs opacity-90 capitalize">{coin.coin_name}</div>
          </div>

          <div className="relative z-10 mt-2">
            <div className="text-xs">
              <div className="flex justify-between items-center">
                <span>Total no.of Influencers</span>
                <span>{coin.total_mentions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total no.of Influencers with Bullish sentiment</span>
                <span>{coin.bullish_count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total no.of Influencers with Bearish sentiment</span>
                <span>{coin.bearish_count}</span>
              </div>
            </div>
          </div>

          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </motion.div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Market Heatmaps
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Real-time visualization of cryptocurrency sentiment and mentions from top influencers
          </p>
        </motion.div>


        {/* Two Separate Heatmaps */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Top Coins Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Coins Header, Last Updated, and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-white">Top Coins</h3>

              {/* Last Updated and Next Update Display - Only for 24hrs */}
              {heatmapData && heatmapData.resultsByTimeframe && heatmapData.resultsByTimeframe[topCoinsTimeFilter] && topCoinsTimeFilter === "24hrs" && (
                <div className="flex flex-col gap-2">
                  {/* Last Updated */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full border border-purple-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-gray-300">
                      <span className="text-white font-medium">Last Updated (UTC): </span>
                      {new Date(heatmapData.resultsByTimeframe[topCoinsTimeFilter].dateRange.to).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                  
                  {/* Next Update */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-gray-300">
                      <span className="text-white font-medium">Next Update (UTC): </span>
                      {new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Update Date Display - Only for 7days and 30days */}
              {heatmapData && heatmapData.resultsByTimeframe && heatmapData.resultsByTimeframe[topCoinsTimeFilter] && (topCoinsTimeFilter === "7days" || topCoinsTimeFilter === "30days") && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full border border-purple-500/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="text-xs text-gray-300">
                    <span className="text-white font-medium">Update Date: </span>
                    {new Date().toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              )}

              {/* Top Coins Time Filter */}
              <div className="flex bg-gray-900/50 rounded-xl p-1 border border-purple-500/20">
                {["24hrs", "7days", "30days"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTopCoinsTimeFilter(period)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${topCoinsTimeFilter === period
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {period === "24hrs" ? "24H" : period === "7days" ? "7D" : "30D"}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Coins Heatmap Grid */}
            <div className="rounded-2xl p-6 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-96">
                {renderHeatmapTiles("topcoins", topCoinsTimeFilter)}
              </div>
            </div>

          </motion.div>

          {/* Meme Coins Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Meme Coins Header, Last Updated, and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-white">Meme Coins</h3>

              {/* Last Updated and Next Update Display - Only for 24hrs */}
              {heatmapData && heatmapData.resultsByTimeframe && heatmapData.resultsByTimeframe[memeCoinsTimeFilter] && memeCoinsTimeFilter === "24hrs" && (
                <div className="flex flex-col gap-2">
                  {/* Last Updated */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full border border-purple-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-gray-300">
                      <span className="text-white font-medium">Last Updated (UTC): </span>
                      {new Date(heatmapData.resultsByTimeframe[memeCoinsTimeFilter].dateRange.to).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                  
                  {/* Next Update */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-gray-300">
                      <span className="text-white font-medium">Next Update (UTC): </span>
                      {new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Update Date Display - Only for 7days and 30days */}
              {heatmapData && heatmapData.resultsByTimeframe && heatmapData.resultsByTimeframe[memeCoinsTimeFilter] && (memeCoinsTimeFilter === "7days" || memeCoinsTimeFilter === "30days") && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full border border-purple-500/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="text-xs text-gray-300">
                    <span className="text-white font-medium">Update Date: </span>
                    {new Date().toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              )}

              {/* Meme Coins Time Filter */}
              <div className="flex bg-gray-900/50 rounded-xl p-1 border border-purple-500/20">
                {["24hrs", "7days", "30days"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setMemeCoinsTimeFilter(period)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm ${memeCoinsTimeFilter === period
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {period === "24hrs" ? "24H" : period === "7days" ? "7D" : "30D"}
                  </button>
                ))}
              </div>
            </div>

            {/* Meme Coins Heatmap Grid */}
            <div className="rounded-2xl p-6 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 min-h-96">
                {renderHeatmapTiles("mem_coins", memeCoinsTimeFilter)}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MarketHeatmap;