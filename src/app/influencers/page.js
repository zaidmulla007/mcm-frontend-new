"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const platforms = [
  { label: "YouTube", value: "youtube" },
  { label: "Telegram", value: "telegram" },
];

// Example influencer data for demonstration
const influencerList = [
  { id: "cryptoking", name: "CryptoKing", platform: "YouTube" },
  { id: "blockqueen", name: "BlockQueen", platform: "YouTube" },
  { id: "moonshot", name: "Moonshot", platform: "Telegram" },
];

export default function InfluencersPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [youtubeInfluencers, setYoutubeInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchYouTubeData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "/api/youtube-data?metric=ai_scoring"
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setYoutubeInfluencers(data.results);
        } else {
          setYoutubeInfluencers([]);
        }
      } catch (err) {
        setError("Failed to fetch YouTube data");
        setYoutubeInfluencers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchYouTubeData();
  }, []);

  // Filter influencers by platform
  const filteredInfluencers =
    selectedPlatform === "youtube"
      ? youtubeInfluencers.map((ch) => ({
          id: ch.channel_id,
          name: ch.name,
          platform: "YouTube",
          subs: ch.subs,
          avg_score: ch.avg_score,
          rank: ch.rank,
        }))
      : influencerList.filter((inf) => inf.platform === "Telegram");

  // Placeholder: show different card counts for each platform
  // const cardCount = selectedPlatform === "youtube" ? 6 : 3;

  return (
    <div className="min-h-screen bg-[#19162b] text-white font-sans pb-16">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-16 pb-6 px-4 flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-center">
          Top Crypto Influencers
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl text-center">
          Discover, analyze, and follow the most impactful voices in crypto.
          Track their picks, ROI, and performance over time.
        </p>
        {/* Platform Toggle */}
        <div className="flex gap-2 mt-2">
          {platforms.map((platform) => (
            <button
              key={platform.value}
              onClick={() => setSelectedPlatform(platform.value)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition border-2 focus:outline-none
                ${
                  selectedPlatform === platform.value
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow"
                    : "bg-[#232042] text-gray-300 border-[#35315a] hover:bg-[#2d2950]"
                }
              `}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </section>
      {/* Influencer Cards */}
      <section className="max-w-5xl mx-auto px-4">
        {loading && selectedPlatform === "youtube" ? (
          <div className="text-center text-gray-400 py-8">
            Loading YouTube influencers...
          </div>
        ) : error && selectedPlatform === "youtube" ? (
          <div className="text-center text-red-400 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredInfluencers.length > 0
              ? filteredInfluencers.map((inf, i) => (
                  <Link
                    key={inf.id}
                    href={
                      selectedPlatform === "youtube"
                        ? `/influencers/${inf.id}`
                        : `/influencers/${inf.id}`
                    }
                    className="bg-[#232042] rounded-2xl p-6 flex flex-col items-center shadow-md hover:scale-105 transition cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mb-4 flex items-center justify-center text-2xl font-bold">
                      {inf.name.match(/\b\w/g).join("")}
                    </div>
                    {/* <div className="h-4 w-24 bg-[#35315a] rounded mb-2 group-hover:bg-purple-400/40 transition" />
                    <div className="h-3 w-16 bg-[#35315a] rounded group-hover:bg-blue-400/40 transition" /> */}
                    <div className="mt-3 text-sm text-gray-200 font-semibold">
                      {inf.name.replace(/_/g, " ")}
                    </div>
                    <div className="text-xs text-gray-400">{inf.platform}</div>
                    {selectedPlatform === "youtube" && (
                      <>
                        <div className="text-xs text-gray-400 mt-1">
                          Subscribers: {inf.subs.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          AI Score: {inf.avg_score?.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Rank: {inf.rank}
                        </div>
                      </>
                    )}
                  </Link>
                ))
              : Array.from({
                  length: selectedPlatform === "youtube" ? 6 : 3,
                }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#232042] rounded-2xl p-6 flex flex-col items-center shadow-md animate-pulse"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mb-4" />
                    <div className="h-4 w-24 bg-[#35315a] rounded mb-2" />
                    <div className="h-3 w-16 bg-[#35315a] rounded" />
                  </div>
                ))}
          </div>
        )}
      </section>
    </div>
  );
}
