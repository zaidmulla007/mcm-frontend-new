"use client";

import { useState, useEffect } from "react";

export default function RecentActivityTab({ channelID, channelData, youtubeLast5 }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [hoveredPost, setHoveredPost] = useState(null);
  const [expandedSummaries, setExpandedSummaries] = useState({});

  useEffect(() => {
    console.log("RecentActivities - Full channelData:", channelData);
    console.log("RecentActivities - channelData.youtube_last_5:", channelData?.youtube_last_5);
    console.log("RecentActivities - channelData.last5:", channelData?.last5);
    console.log("RecentActivities - youtubeLast5 prop:", youtubeLast5);
    
    // Priority: 1) youtubeLast5 prop, 2) channelData.youtube_last_5, 3) channelData.last5
    const videosData = youtubeLast5?.length 
      ? youtubeLast5
      : (channelData?.youtube_last_5?.length 
        ? channelData.youtube_last_5 
        : channelData?.last5);
    
    if (videosData && videosData.length > 0) {
      console.log("RecentActivities - videosData:", videosData);
      
      const formattedPosts = videosData.map((video, index) => {
        console.log(`Video ${index + 1} mentioned:`, video.mentioned);
        const coinRecommendations = (video.mentioned || []).map((coin) => {
          console.log(`Mapping coin:`, coin);
          return {
            coin: coin.symbol || coin.name,
            name: coin.name,
            sentiment: coin.sentiment,
            term: coin.cryptoRecommendationType || "short-term",
            outlook: coin.outlook || "N/A",
            action: coin.action,
            entryStrategy: coin.entryStrategy,
            exitStrategy: coin.exitStrategy,
            tradingCall: coin.tradingCall,
            price: coin.price
          };
        });
        console.log(`Final coinRecommendations for video ${index + 1}:`, coinRecommendations);
        
        return {
          id: (index + 1),
          title: video.title,
          date: video.publishedAt,
          summary: video.summary,
          coinRecommendations,
          videoUrl: video.videoID ? `https://www.youtube.com/watch?v=${video.videoID}` : (video.videoURL || "#"),
          outlook: video.mentioned && video.mentioned.length > 0 ? video.mentioned[0].cryptoRecommendationType || "short-term" : "medium-term",
          actionableInsights: video.actionableInsights,
          buyingPriceZone: video.buyingPriceZone,
        clarityOfAnalysis: video.clarityOfAnalysis,
        credibilityScore: video.credibilityScore,
        educationalPurpose: video.educationalPurpose,
        exitStrategyScore: video.exitStrategyScore,
        overallScore: video.overallScore,
        recommendations: video.recommendations,
        riskManagement: video.riskManagement,
          viewOnCoins: video.viewOnCoins
        };
      });
      console.log("Final formattedPosts:", formattedPosts);
      setRecentPosts(formattedPosts);
    } else {
      console.log("No data found - no video data available in any format");
    }
  }, [channelData, youtubeLast5]);

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

  const toggleSummary = (postId) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="bg-white min-h-screen rounded-xl text-black p-2">
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-black">
          {channelData?.influencer_name || "Influencer"}
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
              )} text-black-600 p-1 text-center text-xs font-bold flex justify-between items-center`}
            >
              <span>POST {post.id}</span>
              <span className="text-[8px]">{formatDate(post.date)}</span>
            </div>

            {/* Post Header */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">Post Header</span>
              </div>
              <div className="text-[9px] mb-1 font-medium" title={post.title}>
                {post.title}
              </div>
              <div className="text-[9px]">
                <a
                  href={post.videoUrl}
                  target="_blank"
                  className="text-red-600 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            </div>

            {/* AI Summary */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">Post Summary</span>
              </div>
              <p className="text-[9px]">
                {expandedSummaries[post.id] 
                  ? post.summary 
                  : `${post.summary.substring(0, 150)}${post.summary.length > 150 ? '...' : ''}`}
              </p>
              {post.summary.length > 150 && (
                <button
                  onClick={() => toggleSummary(post.id)}
                  className="text-[8px] text-blue-600 hover:text-blue-800 mt-1 cursor-pointer underline"
                >
                  {expandedSummaries[post.id] ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Content Type */}
            <div className="p-1 border-b border-black">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">MCM Scoring</span>
              </div>
              <ul className="text-[9px] space-y-1">
                <li className="flex items-start">
                  <span className="mr-1">*</span>
                  <span>Overall Score: {post.overallScore || "N/A"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">*</span>
                  <span>Educational Purpose: {post.educationalPurpose || "N/A"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">*</span>
                  <span>Actionable Insights: {post.actionableInsights || "N/A"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">*</span>
                  <span>Credibility: {post.credibilityScore || "N/A"}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">*</span>
                  <span>Clarity of Analysis: {post.clarityOfAnalysis || "N/A"}</span>
                </li>
              </ul>
            </div>

            {/* Post Analysis */}
            <div
              className="p-1 relative"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-[9px]">Coins Analysis</span>
              </div>

              {/* Coins display */}
              <div className="space-y-1 text-[9px]">
                {console.log(`Post ${post.id} coinRecommendations:`, post.coinRecommendations)}
                {post.coinRecommendations && post.coinRecommendations.length > 0 ? (
                  (expandedPosts[post.id]
                    ? post.coinRecommendations
                    : post.coinRecommendations.slice(0, 5)
                  ).map((rec, i) => (
                    <div
                      key={i}
                      className={`flex items-start ${getSentimentColor(rec.sentiment || 'neutral')}`}
                      title={`${rec.name || rec.coin}: ${rec.sentiment || 'N/A'}, ${rec.term}`}
                    >
                      <span className="mr-1">*</span>
                      <span>{rec.name || rec.coin}: {(rec.sentiment || 'N/A').replace('_', ' ')}, {rec.term}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-[9px]">
                    <span className="mr-1">*</span>
                    <span>No coins mentioned</span>
                  </div>
                )}
              </div>

              {post.coinRecommendations && post.coinRecommendations.length > 5 && (
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
                          <div key={i} className={`${getSentimentColor(rec.sentiment)} mb-1 flex items-start`}>
                            <span className="mr-1">*</span>
                            <span>{rec.name || rec.coin}: {rec.sentiment.replace('_', ' ')}, {rec.term}</span>
                            {rec.price && <span className="ml-1 text-gray-400">@ {rec.price}</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Actionable:</span> {post.actionableInsights || "N/A"}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Buying Zone:</span> {post.buyingPriceZone || "N/A"}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Clarity:</span> {post.clarityOfAnalysis || "N/A"}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Credibility:</span> {post.credibilityScore || "N/A"}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Educational:</span> {post.educationalPurpose || "N/A"}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="text-gray-300">Exit Strategy:</span> {post.exitStrategyScore || "N/A"}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <div className="text-gray-300 text-[10px] flex items-start">
                        <span className="mr-1">*</span>
                        <span><span className="font-semibold">Outlook:</span> {post.outlook}</span>
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