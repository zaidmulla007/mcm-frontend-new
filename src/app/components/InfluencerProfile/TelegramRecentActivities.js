"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import moment from "moment-timezone";
import { useTimezone } from "../../contexts/TimezoneContext";

export default function TelegramRecentActivityTab({ channelID, channelData, telegramLast5, rank }) {
  const { useLocalTime, formatDate } = useTimezone();
  const [recentPosts, setRecentPosts] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [hoveredPost, setHoveredPost] = useState(null);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedMarketing, setExpandedMarketing] = useState({});

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  }, []);

  // Scroll by one card width (320px + 16px gap)
  const scrollByCard = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 336; // w-80 (320px) + gap-4 (16px)
    container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    console.log("TelegramRecentActivities - channelData:", channelData);
    console.log("TelegramRecentActivities - channelID:", channelID);
    console.log("TelegramRecentActivities - telegramLast5 prop:", telegramLast5);

    // Priority: 1) telegramLast5 prop, 2) channelData.telegram_last_5, 3) channelData.last5 (for backward compatibility)
    const messagesData = telegramLast5?.length
      ? telegramLast5
      : (channelData?.telegram_last_5?.length
        ? channelData.telegram_last_5
        : (channelData?.telegramLast5 || null));

    if (messagesData) {
      const formattedPosts = messagesData.map((message, index) => ({
        id: index + 1,
        title: message.message ? (message.message.substring(0, 80) + (message.message.length > 80 ? "..." : "")) : "No message",
        date: message.publishedAt || message.date,
        summary: message.summary,
        coinRecommendations: (message.mentioned || []).map((coin) => ({
          coin: coin.symbol || coin.name,
          name: coin.name,
          sentiment: coin.sentiment,
          term: coin.cryptoRecommendationType || coin.view || "short-term",
          outlook: coin.view || "N/A",
          action: coin.action,
          entryStrategy: coin.entryStrategy,
          exitStrategy: coin.exitStrategy,
          tradingCall: coin.tradingCall,
          price: coin.price
        })),
        messageUrl: `https://t.me/${message.channelID || channelID}/${message.messageID}`,
        outlook: message.mentioned && message.mentioned.length > 0 ?
          message.mentioned[0].cryptoRecommendationType || message.mentioned[0].view || "short-term" :
          "short-term",
        actionableInsights: message.actionableInsights,
        buyingPriceZone: message.buyingPriceZone,
        clarityOfAnalysis: message.clarityOfAnalysis,
        credibilityScore: message.credibilityScore,
        educationalPurpose: message.educationalPurpose,
        exitStrategyScore: message.exitStrategyScore,
        overallScore: message.overallScore,
        recommendations: message.recommendations,
        riskManagement: message.riskManagement,
        viewOnCoins: message.viewOnCoins,
        views: message.views || "N/A",
        forwards: message.forwards || "N/A",
        messageText: message.message,
        marketingContent: message.marketingContent || "No marketing content available"
      }));
      setRecentPosts(formattedPosts);
    }
  }, [channelData, channelID, telegramLast5]);

  // Update scroll buttons on resize and after data loads
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons, recentPosts]);

  // Force re-render when timezone changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [useLocalTime]);

  // Toggle functions
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

  const toggleTitle = (postId) => {
    setExpandedTitles(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleMarketing = (postId) => {
    setExpandedMarketing(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Render stars based on score
  const renderStars = (score) => {
    const stars = [];
    const rating = score / 2; // Convert score to 5-star rating
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }

    return (
      <div className="flex">
        {stars}
      </div>
    );
  };


  const getSentimentColor = (sentiment) => {
    if (sentiment.toLowerCase().includes("bullish")) return "text-green-700";
    if (sentiment.toLowerCase().includes("bearish")) return "text-red-700";
    return "text-blue-700"; // neutral
  };

  const getColumnColor = (index) => {
    return "bg-gradient-to-r from-cyan-500 to-indigo-500";
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-700";
    if (score >= 6) return "text-blue-700";
    if (score >= 4) return "text-yellow-700";
    return "text-red-700";
  };

  // Capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Format coin name - first letter capitalized, rest lowercase
  const formatCoinName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Format sentiment - capitalize each word
  const formatSentiment = (sentiment) => {
    if (!sentiment) return 'N/A';
    return sentiment.replace('_', ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Format holding period - capitalize each word and remove hyphens
  const formatHoldingPeriod = (term) => {
    if (!term || term.toLowerCase() === 'no outlook') return 'Not Specified';
    return term.replace(/-/g, ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="bg-white min-h-screen rounded-xl text-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            {channelData?.results?.channel_id || "Telegram Influencer"}
          </h1>
          <div className="mt-3 flex flex-wrap justify-start gap-4 text-sm text-black">
            {(channelData?.messages_last_30_count !== undefined && channelData?.messages_last_30_count !== null) && (
              <div className="flex items-start gap-2">
                <span className="text-black">Last 30 days:</span>
                <span className="font-semibold text-black bg-blue-100 px-3 py-1 rounded-full">{channelData.messages_last_30_count} messages</span>
              </div>
            )}
            {(channelData?.messages_last_7_count !== undefined && channelData?.messages_last_7_count !== null) && (
              <div className="flex items-start gap-2">
                <span className="text-black">Last 7 days:</span>
                <span className="font-semibold text-black bg-green-100 px-3 py-1 rounded-full">{channelData.messages_last_7_count} messages</span>
              </div>
            )}
            {(channelData?.messages_last_24h_count !== undefined && channelData?.messages_last_24h_count !== null) && (
              <div className="flex items-start gap-2">
                <span className="text-black">Last 24 hours:</span>
                <span className="font-semibold text-black bg-purple-100 px-3 py-1 rounded-full">{channelData.messages_last_24h_count} messages</span>
              </div>
            )}
          </div>
          {/* {rank && (
            <div className="text-xl font-semibold text-white-600 mt-2">
              Rank (180 days/Overall) : {rank}
            </div>
          )} */}
        </div>

        {/* Posts */}
        <div className="relative">
          {recentPosts.length === 0 ? (
            <div className="w-full text-center py-12">
              <p className="text-xl text-black font-semibold">No posts available</p>
            </div>
          ) : (
            <>
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollByCard(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all duration-200 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollByCard(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all duration-200 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

            <div
              ref={scrollContainerRef}
              onScroll={updateScrollButtons}
              className="flex gap-4 overflow-x-auto pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
          {recentPosts.map((post, index) => (
            <div
              key={post.id}
              className="w-80 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg"
            >
              {/* Post Header with Number */}
              <div
                className={`${getColumnColor(index)} text-white p-3 text-center text-sm font-bold flex justify-between items-center`}
              >
                <span>POST {post.id}</span>
                <span className="text-xs">{formatDate(post.date)}</span>
              </div>

              {/* Post Title */}
              <div className="p-3 border-b border-gray-800">
                <div className="min-h-[40px] mb-2">
                  <div className={`text-sm font-medium text-black ${expandedTitles[post.id] ? '' : 'line-clamp-2'}`} title={post.messageText}>
                    {expandedTitles[post.id] ? post.messageText : post.title}
                  </div>
                </div>
                <div className="h-6 mb-2">
                  {post.messageText && post.messageText.length > 80 && (
                    <button
                      onClick={() => toggleTitle(post.id)}
                      className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      {expandedTitles[post.id] ? '.....' : '......'}
                    </button>
                  )}
                </div>
                <div className="text-xs space-y-1 h-12">
                  <div className="flex justify-between text-black">
                    <span>Views: {post.views}</span>
                    <span>Forwards: {post.forwards}</span>
                  </div>
                  <a
                    href={post.messageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    View Message
                  </a>
                </div>
              </div>

              {/* MCM Scoring */}
              <div className="p-3 border-b border-gray-800 h-34">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-xs text-black">MCM Scoring</span>
                </div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-black">Overall</span>
                    {renderStars(post.overallScore)}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-black">Educational</span>
                    {renderStars(post.educationalPurpose)}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-black">Actionable</span>
                    {renderStars(post.actionableInsights)}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-black">Marketing Content</span>
                    {typeof post.marketingContent === "string" &&
                      post.marketingContent.toLowerCase().includes("no marketing content") ? (
                      <span className="text-black">None</span>
                    ) : post.marketingContent ? (
                      <div className="flex items-center gap-1">
                        <span className="text-black">Yes</span>
                        <span className="relative group cursor-pointer">
                          <span className="text-blue-600 text-sm">ⓘ</span>
                          <span className="invisible group-hover:visible absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl w-64 break-words z-50">
                            {post.marketingContent}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-black">None</span>
                    )}
                  </li>
                </ul>
              </div>

              {/* Post Summary */}
              <div className="p-3 border-b border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-black">Post Summary</span>
                  <button
                    onClick={() => toggleSummary(post.id)}
                    className="text-lg text-blue-500 hover:text-blue-700 cursor-pointer font-bold"
                  >
                    {expandedSummaries[post.id] ? '−' : '+'}
                  </button>
                </div>

                <div className="min-h-[96px] mb-2">
                  <div
                    className={`text-xs text-black leading-tight transition-all duration-300 text-justify ${expandedSummaries[post.id] ? '' : 'line-clamp-4'
                      }`}
                  >
                    {post.summary || "No summary available"}
                  </div>

                  {/* Read more / Read less */}
                  {post.summary && (
                    <button
                      onClick={() => toggleSummary(post.id)}
                      className="mt-1 text-blue-500 hover:text-blue-700 text-xs font-semibold"
                    >
                      {expandedSummaries[post.id] ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>


              {/* Coins Analysis */}
              <div
                className="p-3 relative"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-xs text-black">Coins Analysis</span>
                </div>

                {/* Coins table */}
                <div className="flex justify-center">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-center text-black pb-1 pr-2">Name</th>
                          <th className="text-center text-black pb-1 pr-2">Sentiment</th>
                          <th className="text-center text-black pb-1">Holding Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const coins = expandedPosts[post.id]
                            ? post.coinRecommendations || []
                            : (post.coinRecommendations || []).slice(0, 5);

                          const rows = [];
                          coins.forEach((coin, i) => {
                            rows.push(
                              <tr key={i} className="border-b border-gray-800/50">
                                <td className="py-1 pr-2 text-center">
                                  <span className="text-black" title={coin.symbol}>
                                    {formatCoinName(coin.name || coin.name)}
                                  </span>
                                </td>
                                <td className="py-1 pr-2 text-center">
                                  <span className={getSentimentColor(coin.sentiment || 'neutral')}>
                                    {formatSentiment(coin.sentiment)}
                                  </span>
                                </td>
                                <td className="py-1 text-center">
                                  <span className="text-black">
                                    {formatHoldingPeriod(coin.term)}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="h-6 mt-2">
                  {post.coinRecommendations && post.coinRecommendations.length > 5 && (
                    <button
                      onClick={() => toggleExpanded(post.id)}
                      className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      {expandedPosts[post.id]
                        ? 'Read Less'
                        : 'Read More'
                      }
                    </button>
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredPost === post.id && (
                  <div className="absolute top-0 left-full ml-2 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-300 max-w-md">
                    <div className="text-xs">
                      <div className="font-bold mb-2 text-blue-400">Complete Post Analysis</div>

                      <div className="mb-3">
                        <span className="font-semibold text-blue-400">All Recommendations ({post.coinRecommendations?.length || 0}):</span>
                        <div className="mt-1 max-h-32 overflow-y-auto">
                          {post.coinRecommendations?.map((rec, i) => (
                            <div key={i} className={`${getSentimentColor(rec.sentiment)} mb-1 flex items-start`}>
                              <span className="mr-1">•</span>
                              <span>{formatCoinName(rec.name || rec.coin)}: {formatSentiment(rec.sentiment)}, {formatHoldingPeriod(rec.term)}</span>
                              {rec.price && <span className="ml-1 text-black">@ {rec.price}</span>}
                              {rec.action && <span className="ml-1 text-yellow-400">({rec.action})</span>}
                            </div>
                          )) || []}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Actionable:</span> <span className={getScoreColor(post.actionableInsights)}>{post.actionableInsights}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Buying Zone:</span> <span className={getScoreColor(post.buyingPriceZone)}>{post.buyingPriceZone}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Clarity:</span> <span className={getScoreColor(post.clarityOfAnalysis)}>{post.clarityOfAnalysis}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Credibility:</span> <span className={getScoreColor(post.credibilityScore)}>{post.credibilityScore}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Educational:</span> <span className={getScoreColor(post.educationalPurpose)}>{post.educationalPurpose}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-black">•</span>
                          <span><span className="text-black">Exit Strategy:</span> <span className={getScoreColor(post.exitStrategyScore)}>{post.exitStrategyScore}/10</span></span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-600">
                        <div className="text-black text-xs flex items-start">
                          <span className="mr-1">•</span>
                          <span><span className="font-semibold">Outlook:</span> {post.outlook}</span>
                        </div>
                        <div className="text-black text-xs flex items-start mt-1">
                          <span className="mr-1">•</span>
                          <span><span className="font-semibold">Engagement:</span> {post.views} views | {post.forwards} forwards</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}