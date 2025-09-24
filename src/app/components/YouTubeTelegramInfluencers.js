"use client";
import { useState, useEffect } from "react";
import { FaYoutube, FaCalendarAlt, FaSync, FaArrowUp, FaArrowDown, FaMinus, FaTelegramPlane, FaEye, FaHeart, FaThumbsUp, FaChevronDown, FaChevronUp, FaStar, FaChartLine, FaWallet, FaExchangeAlt, FaGraduationCap, FaLightbulb, FaShoppingCart, FaSearch, FaCertificate } from "react-icons/fa";

export default function YouTubeTelegramInfluencers() {
    const [selectedPlatform, setSelectedPlatform] = useState("Combined");
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [nextUpdate, setNextUpdate] = useState(() => {
        const next = new Date();
        next.setHours(next.getHours() + 4);
        return next;
    });
    const [expandedPosts, setExpandedPosts] = useState({});
    const [apiData, setApiData] = useState(null);

    // Toggle post expansion
    const togglePostExpansion = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // Fetch data from API
    const fetchData = () => {
        setLoading(true);
        fetch('https://37.27.120.45:5000/api/admin/strategyyoutubedata/getlast5ytandtg')
            .then(response => response.json())
            .then(data => {
                setApiData(data);
                setLastUpdated(new Date());
                const next = new Date();
                next.setHours(next.getHours() + 4);
                setNextUpdate(next);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Get combined data based on selected platform
    const getDisplayData = () => {
        if (!apiData) return [];

        let allPosts = [];

        if (selectedPlatform === "YouTube" || selectedPlatform === "Combined") {
            apiData.youtube.forEach(item => {
                allPosts.push({
                    id: item.youtube_oid,
                    title: item.title,
                    date: item.publishedAt,
                    summary: item.summary,
                    content: item.summary,
                    timestamp: new Date(item.publishedAt).toLocaleString(),
                    views: "N/A",
                    likes: "N/A",
                    videoUrl: `https://www.youtube.com/watch?v=${item.videoID}`,
                    telegramUrl: null,
                    outlook: "short term",
                    comment: "Analysis from API",
                    mentionedCoins: item.mentioned && Array.isArray(item.mentioned) ? item.mentioned : [],
                    influencer: {
                        name: item.channelID,
                        channel: item.channelID,
                        avatar: `https://ui-avatars.com/api/?name=${item.channelID}&background=random`,
                        subscribers: "N/A",
                        platform: "YouTube"
                    },
                    // Add content scores
                    viewOnCoins: item.viewOnCoins || 0,
                    recommendationScore: item.recommendations || 0,
                    riskManagement: item.riskManagement || 0,
                    overallScore: item.overallScore || 0,
                    exitStrategyScore: item.exitStrategyScore || 0,
                    educationalPurpose: item.educationalPurpose || 0,
                    actionableInsights: item.actionableInsights || 0,
                    buyingPriceZone: item.buyingPriceZone || 0,
                    clarityOfAnalysis: item.clarityOfAnalysis || 0,
                    credibilityScore: item.credibilityScore || 0
                });
            });
        }

        if (selectedPlatform === "Telegram" || selectedPlatform === "Combined") {
            apiData.telegram.forEach(item => {
                allPosts.push({
                    id: item.telegram_oid,
                    title: item.message ? (item.message.substring(0, 50) + (item.message.length > 50 ? '...' : '')) : "No title",
                    date: item.publishedAt,
                    summary: item.summary,
                    content: item.message || "",
                    timestamp: new Date(item.publishedAt).toLocaleString(),
                    views: "N/A",
                    likes: "N/A",
                    videoUrl: null,
                    telegramUrl: `https://t.me/${item.channelID}/${item.messageID}`,
                    outlook: "short term",
                    comment: "Analysis from API",
                    mentionedCoins: item.mentioned && Array.isArray(item.mentioned) ? item.mentioned : [],
                    influencer: {
                        name: item.channelID,
                        channel: item.channelID,
                        avatar: `https://ui-avatars.com/api/?name=${item.channelID}&background=random`,
                        subscribers: "N/A",
                        platform: "Telegram"
                    },
                    // Add content scores
                    viewOnCoins: item.viewOnCoins || 0,
                    recommendationScore: item.recommendations || 0,
                    riskManagement: item.riskManagement || 0,
                    overallScore: item.overallScore || 0,
                    exitStrategyScore: item.exitStrategyScore || 0,
                    educationalPurpose: item.educationalPurpose || 0,
                    actionableInsights: item.actionableInsights || 0,
                    buyingPriceZone: item.buyingPriceZone || 0,
                    clarityOfAnalysis: item.clarityOfAnalysis || 0,
                    credibilityScore: item.credibilityScore || 0
                });
            });
        }

        return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get sentiment color and icon
    const getSentimentInfo = (sentiment) => {
        switch (sentiment) {
            case "Strong_Bullish":
                return {
                    color: "bg-green-900/30 text-green-400 border border-green-800/50",
                    icon: <FaArrowUp className="text-green-400" />,
                    arrow: "↑"
                };
            case "Mild_Bullish":
                return {
                    color: "bg-green-800/20 text-green-300 border border-green-700/50",
                    icon: <FaArrowUp className="text-green-300" />,
                    arrow: "↗"
                };
            case "Neutral":
                return {
                    color: "bg-blue-900/20 text-blue-300 border border-blue-800/50",
                    icon: <FaMinus className="text-blue-300" />,
                    arrow: "→"
                };
            case "Mild_Bearish":
                return {
                    color: "bg-red-900/20 text-red-300 border border-red-800/50",
                    icon: <FaArrowDown className="text-red-300" />,
                    arrow: "↘"
                };
            case "Strong_Bearish":
                return {
                    color: "bg-red-900/30 text-red-400 border border-red-800/50",
                    icon: <FaArrowDown className="text-red-400" />,
                    arrow: "↓"
                };
            default:
                return {
                    color: "bg-gray-800/30 text-gray-400 border border-gray-700/50",
                    icon: <FaMinus className="text-gray-400" />,
                    arrow: "→"
                };
        }
    };

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score >= 8) return "text-green-400";
        if (score >= 6) return "text-blue-400";
        if (score >= 4) return "text-yellow-400";
        return "text-red-400";
    };

    // Get score bar color based on value
    const getScoreBarColor = (score) => {
        if (score >= 8) return "bg-gradient-to-r from-green-600 to-green-400";
        if (score >= 6) return "bg-gradient-to-r from-blue-600 to-blue-400";
        if (score >= 4) return "bg-gradient-to-r from-yellow-600 to-yellow-400";
        return "bg-gradient-to-r from-red-600 to-red-400";
    };

    // Get recommendation type color
    const getRecommendationTypeColor = (type) => {
        switch (type) {
            case "long-term":
                return "bg-purple-900/30 text-purple-300 border border-purple-800/50";
            case "short-term":
                return "bg-blue-900/30 text-blue-300 border border-blue-800/50";
            default:
                return "bg-gray-800/30 text-gray-300 border border-gray-700/50";
        }
    };

    // Format trading call text
    const formatTradingCall = (call) => {
        if (!call) return "No specific call";
        return call.charAt(0).toUpperCase() + call.slice(1);
    };

    // Platform options
    const platformOptions = [
        { key: "Combined", label: "Combined" },
        { key: "YouTube", label: "YouTube" },
        { key: "Telegram", label: "Telegram" }
    ];

    // Format date to UTC string for header display
    const formatUTCDate = (date) => {
        if (!date) return "N/A";

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getUTCDay()];
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const formattedHours = displayHours.toString().padStart(2, '0');

        return `${dayName} ${day} ${month} ${year} ${formattedHours} ${ampm} UTC`;
    };

    if (loading) {
        return (
            <div className="relative h-24 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl mb-4 p-6">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="jsx-816192472cbeba0e space-y-6">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mt-10">
                        <span className="text-white-500">
                            Latest Posts
                        </span>
                    </h2>
                </div>

                {/* Platform Selection */}
                <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl p-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-lg text-white-300 font-semibold">Platform:</label>
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                                >
                                    {platformOptions.map((option) => (
                                        <option key={option.key} value={option.key} className="bg-gray-800 text-gray-200">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-medium">Source: </span>
                                <div className="flex items-center gap-2">
                                    {selectedPlatform === "Combined" ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12,24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            <span className="text-sm text-white">YouTube</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                            <span className="text-sm text-white">Telegram</span>
                                        </>
                                    ) : selectedPlatform === "YouTube" ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12,24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            <span className="text-sm text-white">YouTube</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                            <span className="text-sm text-white">Telegram</span>
                                        </>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Update Times Display */}
                <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl p-4">
                        <div className="flex items-center justify-center gap-8">
                            {/* Last Updated */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-white-300 font-medium">Last Updated :</span>
                                <span className="text-md font-bold text-white">
                                    {lastUpdated ? formatUTCDate(lastUpdated) : "N/A"}
                                </span>
                            </div>

                            {/* Separator */}
                            <div className="h-8 w-px bg-gray-600"></div>

                            {/* Next Update */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-white-300 font-medium">Next Update :</span>
                                <span className="text-md font-bold text-white">
                                    {nextUpdate ? formatUTCDate(nextUpdate) : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-8">
                    {getDisplayData().map((post, index) => (
                        <div key={post.id} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
                            {/* Post Header */}
                            <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            {/* Influencer Info */}
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.influencer.avatar}
                                                    alt={post.influencer.name}
                                                    className="w-12 h-12 rounded-full border-2 border-purple-500/30 shadow-sm"
                                                />
                                                <div>
                                                    <div className="font-bold text-lg text-white">{post.influencer.name}</div>
                                                    <div className="flex items-center gap-2 text-sm text-white-400">
                                                        {post.platform === "YouTube" ? <FaYoutube className="text-red-500" /> : <FaTelegramPlane className="text-blue-500" />}
                                                        <span>{post.influencer.channel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Title */}
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                                            {post.title}
                                        </h3>

                                        {/* Post Time and Watch/View Button */}
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-lg">
                                                <FaCalendarAlt className="text-white" />
                                                <span className="font-medium text-sm text-white">
                                                    Time of Post: {formatUTCDate(new Date(post.date))}
                                                </span>
                                            </div>
                                            <span className="text-white">•</span>
                                            <a
                                                href={post.videoUrl || post.telegramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 font-medium ${post.platform === "YouTube"
                                                    ? "bg-red-900/30 hover:bg-red-900/50 text-white"
                                                    : "bg-blue-900/30 hover:bg-blue-900/50 text-white"
                                                    }`}
                                            >
                                                {post.platform === "YouTube" ? <FaYoutube /> : <FaTelegramPlane />}
                                                {post.platform === "YouTube" ? "Watch Post" : "View Post"}
                                            </a>
                                        </div>

                                    </div>

                                    {/* Toggle Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => togglePostExpansion(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                                        >
                                            <span>{expandedPosts[post.id] ? 'Hide Details' : 'Show Details'}</span>
                                            {expandedPosts[post.id] ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Content */}
                            {expandedPosts[post.id] && (
                                <div className="border-t border-purple-500/30">
                                    <div className="p-6 space-y-6">
                                        {/* AI Summary Section */}
                                        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30">
                                            <h4 className="font-bold mb-4 text-xl">
                                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                    ✨ AI Summary
                                                </span>
                                            </h4>
                                            <div className="prose max-w-none">
                                                <p className="text-white leading-relaxed text-lg break-words overflow-hidden whitespace-normal">
                                                    {post.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content Type Section */}
                                        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30">
                                            <h4 className="font-bold text-white mb-6 text-xl flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                Content Analysis Scores
                                                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm flex items-center gap-1">
                                                    <FaStar className="text-yellow-300" />
                                                    Overall: {post.overallScore}/10
                                                </span>
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* View on Coins */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">View on Coins</span>
                                                        <span className={`font-bold ${getScoreColor(post.viewOnCoins)}`}>{post.viewOnCoins}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.viewOnCoins)}`}
                                                            style={{ width: `${post.viewOnCoins * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Recommendations */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Recommendations</span>
                                                        <span className={`font-bold ${getScoreColor(post.recommendationScore)}`}>{post.recommendationScore}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.recommendationScore)}`}
                                                            style={{ width: `${post.recommendationScore * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Risk Management */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Risk Management</span>
                                                        <span className={`font-bold ${getScoreColor(post.riskManagement)}`}>{post.riskManagement}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.riskManagement)}`}
                                                            style={{ width: `${post.riskManagement * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Exit Strategy */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Exit Strategy</span>
                                                        <span className={`font-bold ${getScoreColor(post.exitStrategyScore)}`}>{post.exitStrategyScore}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.exitStrategyScore)}`}
                                                            style={{ width: `${post.exitStrategyScore * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Educational Purpose */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Educational Purpose</span>
                                                        <span className={`font-bold ${getScoreColor(post.educationalPurpose)}`}>{post.educationalPurpose}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.educationalPurpose)}`}
                                                            style={{ width: `${post.educationalPurpose * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Actionable Insights */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Actionable Insights</span>
                                                        <span className={`font-bold ${getScoreColor(post.actionableInsights)}`}>{post.actionableInsights}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.actionableInsights)}`}
                                                            style={{ width: `${post.actionableInsights * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Buying Price Zone */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Buying Price Zone</span>
                                                        <span className={`font-bold ${getScoreColor(post.buyingPriceZone)}`}>{post.buyingPriceZone}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.buyingPriceZone)}`}
                                                            style={{ width: `${post.buyingPriceZone * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Clarity of Analysis */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Clarity of Analysis</span>
                                                        <span className={`font-bold ${getScoreColor(post.clarityOfAnalysis)}`}>{post.clarityOfAnalysis}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.clarityOfAnalysis)}`}
                                                            style={{ width: `${post.clarityOfAnalysis * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Credibility Score */}
                                                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-white text-sm font-medium">Credibility Score</span>
                                                        <span className={`font-bold ${getScoreColor(post.credibilityScore)}`}>{post.credibilityScore}/10</span>
                                                    </div>
                                                    <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getScoreBarColor(post.credibilityScore)}`}
                                                            style={{ width: `${post.credibilityScore * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Recommendations Section */}
                                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-purple-500/30">
                                            <h4 className="font-bold text-white mb-6 text-xl flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Posts Analysis
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {post.mentionedCoins.map((rec, index) => {
                                                    const sentimentInfo = getSentimentInfo(rec.sentiment);
                                                    return (
                                                        <div key={index} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <span className="font-bold text-2xl text-white">{rec.coin}</span>
                                                                    {rec.symbol && (
                                                                        <span className="block text-sm font-medium text-white mt-1">
                                                                            {rec.symbol}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm ${sentimentInfo.color}`}>
                                                                    {sentimentInfo.icon}
                                                                    <span className="text-white">{rec.sentiment.replace('_', ' ')}</span>
                                                                </span>
                                                            </div>
                                                            <div className="mt-4">
                                                                <span className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 text-white rounded-full text-sm font-medium capitalize shadow-sm">
                                                                    📈 {post.outlook} outlook
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}