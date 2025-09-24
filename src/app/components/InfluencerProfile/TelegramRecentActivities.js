"use client";

import { useState, useEffect } from "react";

export default function TelegramRecentActivityTab({ channelID, channelData }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [hoveredPost, setHoveredPost] = useState(null);

  useEffect(() => {
    console.log("TelegramRecentActivities - channelData:", channelData);
    console.log("TelegramRecentActivities - channelID:", channelID);
    if (channelData && channelData.results && channelData.results.last5) {
      const formattedPosts = channelData.results.last5.map((message, index) => ({
        id: index + 1,
        title: message.message.substring(0, 50) + "...",
        date: message.date,
        summary: message.summary,
        coinRecommendations: Object.keys(message.sentiment || {}).map((coin) => {
          const cryptoRecType = message.Crypto_Recommendation_Type && message.Crypto_Recommendation_Type[coin];
          const longTermPeriod = message.Long_Term_Holding_Period && message.Long_Term_Holding_Period[coin];

          return {
            coin,
            sentiment: message.sentiment[coin],
            term: cryptoRecType || longTermPeriod || "short-term",
          };
        }),
        messageUrl: `https://t.me/${channelID}/${message.messageID}`,
        outlook:
          message.Crypto_Recommendation_Type
            ? Object.values(message.Crypto_Recommendation_Type)[0] ||
            "short-term"
            : "short-term",
        actionableInsights: message.actionableInsights,
        buyingPriceZone: message.buyingPriceZone,
        clarityOfAnalysis: message.clarityOfAnalysis,
        credibilityScore: message.credibilityScore,
        educationalPurpose: message.educationalPurpose,
        exitStrategyScore: message.exitStrategyScore,
        overallScore: message.overallScore,
        recommendations: message.recommendations,
        riskManagement: message.riskManagement,
        views: message.views,
        forwards: message.forwards,
        messageText: message.message,
      }));
      setRecentPosts(formattedPosts);
    }
  }, [channelData, channelID]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    return `${date.toLocaleDateString(
      undefined,
      dateOptions
    )} ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment.toLowerCase().includes("bullish")) return "text-green-600";
    if (sentiment.toLowerCase().includes("bearish")) return "text-red-600";
    return "text-blue-600"; // neutral
  };

  const getColumnColor = (index) => {
    const colors = [
      "bg-blue-900",
      "bg-blue-700",
      "bg-blue-500",
      "bg-blue-300",
      "bg-blue-100",
    ];
    return colors[index] || "bg-gray-400";
  };

  const toggleExpanded = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="bg-white min-h-screen rounded-xl text-black p-2">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-black">
          {channelData?.results?.channel_id || "Telegram Influencer"}
        </h1>
      </div>

      <div className="flex gap-1 pb-2 mt-5">
        {recentPosts.map((post, index) => (
          <div
            key={post.id}
            className="w-1/5 bg-white rounded-lg overflow-hidden border border-black"
          >
            <div
              className={`${getColumnColor(
                index
              )} text-black-600 p-1 text-center text-xs font-bold`}
            >
              POST {post.id}
            </div>

            {/* Post Header */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">Message Header</span>
              </div>
              <ul className="text-[9px] text-black space-y-1">
                <li className="truncate" title={formatDate(post.date)}>
                  • {formatDate(post.date)}
                </li>
                <li className="truncate" title={post.messageText}>
                  • {post.title}
                </li>
                <li className="truncate">
                  • Views: {post.views} | Forwards: {post.forwards}
                </li>
                <li className="truncate" title={post.messageUrl}>
                  •{" "}
                  <a
                    href={post.messageUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Message
                  </a>
                </li>
              </ul>
            </div>

            {/* AI Summary */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">AI Summary</span>
              </div>
              <p className="text-[9px] truncate" title={post.summary}>
                {post.summary}
              </p>
            </div>

            {/* AI Scoring */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">AI Scoring</span>
              </div>
              <ul className="text-[9px] space-y-1">
                <li>• Overall Score: {post.overallScore || "N/A"}</li>
                <li>• Credibility Score: {post.credibilityScore || "N/A"}</li>
                <li>• Clarity Of Analysis: {post.clarityOfAnalysis || "N/A"}</li>
                <li>• Educational Purpose: {post.educationalPurpose || "N/A"}</li>
                <li>• Actionable Insights: {post.actionableInsights || "N/A"}</li>
                <li>• Buying Zone: {post.buyingPriceZone || "N/A"}</li>
                <li>• Recommendations: {post.recommendations || "N/A"}</li>
                <li>• Exit Strategy: {post.exitStrategyScore || "N/A"}</li>
                <li>• Risk Management: {post.riskManagement || "N/A"}</li>
              </ul>
            </div>

            {/* Post Analysis */}
            <div
              className="p-1 relative"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">Post Analysis</span>
              </div>

              {/* Coins display */}
              <div className="grid grid-cols-3 gap-1 text-[9px]">
                {(expandedPosts[post.id]
                  ? post.coinRecommendations
                  : post.coinRecommendations.slice(0, 5)
                ).map((rec, i) => (
                  <div
                    key={i}
                    className={`truncate ${getSentimentColor(rec.sentiment)}`}
                    title={`${rec.coin}: ${rec.sentiment}, ${rec.term}`}
                  >
                    {rec.coin}: {rec.sentiment}, {rec.term}
                  </div>
                ))}
              </div>

              {post.coinRecommendations.length > 5 && (
                <button
                  onClick={() => toggleExpanded(post.id)}
                  className="text-[8px] text-blue-600 hover:text-blue-800 mt-1 cursor-pointer underline"
                >
                  {expandedPosts[post.id]
                    ? 'Show Less'
                    : `+${post.coinRecommendations.length - 5} more`
                  }
                </button>
              )}

              {/* Hover Tooltip */}
              {hoveredPost === post.id && (
                <div className="absolute top-0 left-full ml-2 z-50 bg-black text-white p-3 rounded-lg shadow-lg border border-gray-300 max-w-md">
                  <div className="text-xs">
                    <div className="font-bold mb-2 text-yellow-400">Complete Post Analysis</div>

                    <div className="mb-2">
                      <span className="font-semibold text-blue-400">All Recommendations ({post.coinRecommendations.length}):</span>
                      <div className="mt-1 max-h-32 overflow-y-auto">
                        {post.coinRecommendations.map((rec, i) => (
                          <div key={i} className={`${getSentimentColor(rec.sentiment)} mb-1`}>
                            • {rec.coin}: {rec.sentiment}, {rec.term}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-gray-300">Actionable:</span> {post.actionableInsights || "N/A"}</div>
                      <div><span className="text-gray-300">Buying Zone:</span> {post.buyingPriceZone || "N/A"}</div>
                      <div><span className="text-gray-300">Clarity:</span> {post.clarityOfAnalysis || "N/A"}</div>
                      <div><span className="text-gray-300">Credibility:</span> {post.credibilityScore || "N/A"}</div>
                      <div><span className="text-gray-300">Educational:</span> {post.educationalPurpose || "N/A"}</div>
                      <div><span className="text-gray-300">Exit Strategy:</span> {post.exitStrategyScore || "N/A"}</div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <div className="text-gray-300 text-[10px]">
                        <span className="font-semibold">Outlook:</span> {post.outlook}
                      </div>
                      <div className="text-gray-300 text-[10px]">
                        <span className="font-semibold">Views:</span> {post.views} | <span className="font-semibold">Forwards:</span> {post.forwards}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}