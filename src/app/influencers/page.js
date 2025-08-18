"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const platforms = [
  {
    label: "YouTube",
    value: "youtube",
    logo: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
      </svg>
    )
  },
  {
    label: "Telegram",
    value: "telegram",
    logo: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    )
  },
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
              className={`px-4 py-2 rounded-full font-semibold text-sm transition border-2 focus:outline-none flex items-center gap-2
      ${selectedPlatform === platform.value
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow"
                  : "bg-[#232042] text-gray-300 border-[#35315a] hover:bg-[#2d2950]"
                }
    `}
            >
              {platform.logo}
              <span>{platform.label}</span> {/* 👈 now the label shows */}
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
