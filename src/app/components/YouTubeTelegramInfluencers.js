"use client";
import { useState, useEffect } from "react";
import { FaYoutube, FaCalendarAlt, FaSync, FaArrowUp, FaArrowDown, FaMinus, FaTelegramPlane, FaEye, FaHeart, FaThumbsUp, FaChevronDown, FaChevronUp } from "react-icons/fa";

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

    // Toggle post expansion
    const togglePostExpansion = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // Hardcoded data for YouTube influencers
    const youtubeInfluencers = [
        {
            id: 1,
            name: "Crypto Bull",
            channel: "CryptoBullOfficial",
            avatar: "https://via.placeholder.com/40x40/FF0000/FFFFFF?text=CB",
            subscribers: "2.3M",
            platform: "YouTube",
            posts: [
                {
                    id: 1,
                    title: "🚀 Bitcoin Breaking $70K Soon! MASSIVE Opportunity",
                    date: "2023-10-15",
                    summary: "Bitcoin is showing incredible strength with key technical indicators pointing to a potential breakout above $70K. I analyze the current market structure, volume patterns, and macroeconomic factors that could drive this move. The RSI is showing bullish divergence while institutional accumulation continues. I also discuss optimal entry points and risk management strategies for this trade setup.",
                    content: "Bitcoin is showing incredible strength and I believe we're about to see a major breakout above $70K...",
                    timestamp: "2 hours ago",
                    views: "45.2K",
                    likes: "3.2K",
                    videoUrl: "https://www.youtube.com/watch?v=example1",
                    outlook: "short term",
                    comment: "Education : Technical analysis with some hype elements. Good educational value on chart patterns and market structure.",
                    recommendations: [
                        { coin: "BTC", sentiment: "Strong Bullish" },
                        { coin: "ETH", sentiment: "Mild Bullish" }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Altcoin Daily",
            channel: "AltcoinDailyChannel",
            avatar: "https://via.placeholder.com/40x40/00FF00/FFFFFF?text=AD",
            subscribers: "1.8M",
            platform: "YouTube",
            posts: [
                {
                    id: 2,
                    title: "⚠️ Market Correction Coming? Key Levels to Watch",
                    date: "2023-10-14",
                    summary: "I'm seeing concerning signals across multiple timeframes that suggest a potential market correction. Key resistance levels are holding strong while volume is declining. I analyze the current market sentiment, fear and greed index, and institutional flows to provide a balanced perspective on what might happen next.",
                    content: "I'm seeing some concerning signals in the market that suggest we might see a correction soon...",
                    timestamp: "1 hour ago",
                    views: "28.5K",
                    likes: "1.9K",
                    videoUrl: "https://www.youtube.com/watch?v=example2",
                    outlook: "short term",
                    comment: "Marketing : Contains warning elements with educational backing. Balanced analysis with some sensationalism.",
                    recommendations: [
                        { coin: "BTC", sentiment: "Mild Bearish" },
                        { coin: "ALT", sentiment: "Neutral" }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Coin Bureau",
            channel: "CoinBureauOfficial",
            avatar: "https://via.placeholder.com/40x40/0000FF/FFFFFF?text=CB",
            subscribers: "2.1M",
            platform: "YouTube",
            posts: [
                {
                    id: 3,
                    title: "Solana vs Ethereum: Which is Better Investment?",
                    date: "2023-10-13",
                    summary: "A comprehensive comparison of Solana and Ethereum ecosystems covering technology, scalability, developer activity, and investment potential. I analyze transaction costs, processing speeds, and the growing DeFi ecosystems on both chains. The video includes on-chain metrics, upcoming upgrades, and competitive advantages of each platform.",
                    content: "A detailed comparison of Solana and Ethereum ecosystems, technology, and investment potential...",
                    timestamp: "3 hours ago",
                    views: "52.7K",
                    likes: "3.5K",
                    videoUrl: "https://www.youtube.com/watch?v=example3",
                    outlook: "long term",
                    comment: "Education : Highly educational content with deep technical analysis. Minimal hype, strong fundamental research.",
                    recommendations: [
                        { coin: "SOL", sentiment: "Mild Bullish" },
                        { coin: "ETH", sentiment: "Neutral" }
                    ]
                }
            ]
        }
    ];

    // Hardcoded data for Telegram influencers
    const telegramInfluencers = [
        {
            id: 4,
            name: "Crypto Signals Pro",
            channel: "@cryptosignalspro",
            avatar: "https://via.placeholder.com/40x40/FF6B00/FFFFFF?text=CS",
            subscribers: "150K",
            platform: "Telegram",
            posts: [
                {
                    id: 4,
                    title: "🎯 BTC/USDT Long Signal - Target $72K",
                    date: "2023-10-15",
                    summary: "High-probability long setup on BTC/USDT with excellent risk-reward ratio. Technical analysis shows strong support at current levels with momentum indicators turning bullish. Entry at $68,500 with tight stop loss at $67,000 and target at $72,000 provides 1:2.3 risk-reward ratio. Multiple confirmations including volume profile and order book analysis support this trade.",
                    content: "Entry: $68,500 | Stop Loss: $67,000 | Target: $72,000 | Risk/Reward: 1:2.3",
                    timestamp: "30 minutes ago",
                    views: "8.2K",
                    reactions: "542",
                    telegramUrl: "https://t.me/cryptosignalspro/1234",
                    outlook: "short term",
                    comment: "Trading : Professional trading signals with clear risk management. Educational value for trade setup analysis.",
                    recommendations: [
                        { coin: "BTC", sentiment: "Strong Bullish" }
                    ]
                }
            ]
        },
        {
            id: 5,
            name: "DeFi Alpha",
            channel: "@defialpha",
            avatar: "https://via.placeholder.com/40x40/9C27B0/FFFFFF?text=DA",
            subscribers: "89K",
            platform: "Telegram",
            posts: [
                {
                    id: 5,
                    title: "🚨 New Yield Farm Alert - 450% APY",
                    date: "2023-10-14",
                    summary: "New high-yield farming opportunity discovered on Polygon network offering 450% APY. Contract has been audited and liquidity is locked for 6 months. However, high APY indicates high risk and potential for impermanent loss. I provide detailed analysis of the tokenomics, team background, and risk factors to consider before participating.",
                    content: "New farming opportunity on Polygon with insane APY. DYOR but looks legitimate...",
                    timestamp: "1 hour ago",
                    views: "5.8K",
                    reactions: "376",
                    telegramUrl: "https://t.me/defialpha/5678",
                    outlook: "short term",
                    comment: "Marketing : High-risk opportunity with marketing tone. Contains some educational elements about DeFi risks.",
                    recommendations: [
                        { coin: "MATIC", sentiment: "Mild Bullish" },
                        { coin: "DeFi", sentiment: "Neutral" }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: "Whale Alerts",
            channel: "@whalealerts",
            avatar: "https://via.placeholder.com/40x40/2196F3/FFFFFF?text=WA",
            subscribers: "220K",
            platform: "Telegram",
            posts: [
                {
                    id: 6,
                    title: "🐋 Large BTC Transfer: 2,547 BTC to Unknown Wallet",
                    date: "2023-10-15",
                    summary: "Major whale movement detected: 2,547 BTC worth approximately $174M transferred from Coinbase to an unknown wallet address. This could indicate institutional accumulation or preparation for OTC trading. Historical analysis shows similar large transfers often precede significant price movements. I analyze the wallet patterns and potential market impact of this transaction.",
                    content: "Whale alert: 2,547 BTC ($174M) transferred from Coinbase to unknown wallet. Possible accumulation?",
                    timestamp: "45 minutes ago",
                    views: "15.7K",
                    reactions: "987",
                    telegramUrl: "https://t.me/whalealerts/9876",
                    outlook: "medium term",
                    comment: "Information : Factual whale movement data with analytical insights. Neutral reporting with market context.",
                    recommendations: [
                        { coin: "BTC", sentiment: "Neutral" }
                    ]
                }
            ]
        }
    ];

    // Get combined data based on selected platform
    const getDisplayData = () => {
        let allPosts = [];

        if (selectedPlatform === "YouTube") {
            youtubeInfluencers.forEach(influencer => {
                influencer.posts.forEach(post => {
                    allPosts.push({ ...post, influencer, platform: "YouTube" });
                });
            });
        } else if (selectedPlatform === "Telegram") {
            telegramInfluencers.forEach(influencer => {
                influencer.posts.forEach(post => {
                    allPosts.push({ ...post, influencer, platform: "Telegram" });
                });
            });
        } else {
            // Combined - show all posts from all influencers
            [...youtubeInfluencers, ...telegramInfluencers].forEach(influencer => {
                influencer.posts.forEach(post => {
                    allPosts.push({ ...post, influencer, platform: influencer.platform });
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
            case "Strong Bullish":
                return {
                    color: "bg-green-100 text-green-800",
                    icon: <FaArrowUp className="text-green-600" />,
                    arrow: "↑"
                };
            case "Mild Bullish":
                return {
                    color: "bg-green-50 text-green-700",
                    icon: <FaArrowUp className="text-green-500" />,
                    arrow: "↗"
                };
            case "Neutral":
                return {
                    color: "bg-blue-50 text-blue-700",
                    icon: <FaMinus className="text-blue-500" />,
                    arrow: "→"
                };
            case "Mild Bearish":
                return {
                    color: "bg-red-50 text-red-700",
                    icon: <FaArrowDown className="text-red-500" />,
                    arrow: "↘"
                };
            case "Strong Bearish":
                return {
                    color: "bg-red-100 text-red-800",
                    icon: <FaArrowDown className="text-red-600" />,
                    arrow: "↓"
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800",
                    icon: <FaMinus className="text-gray-500" />,
                    arrow: "→"
                };
        }
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
            <div className="relative h-24 bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg mb-4 p-6">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mt-10">
                        <span className="text-black">
                            Latest Post based on UTC
                        </span>
                    </h2>
                </div>

                {/* Platform Selection */}
                <div className="flex justify-center">
                    <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg p-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-lg text-black font-semibold">Platform:</label>
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    className="bg-white border border-purple-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                                >
                                    {platformOptions.map((option) => (
                                        <option key={option.key} value={option.key} className="bg-white text-black">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-black font-medium">Source: </span>
                                <div className="flex items-center gap-2">
                                    {selectedPlatform === "Combined" ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            <span className="text-sm text-black">YouTube</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                            <span className="text-sm text-black">Telegram</span>
                                        </>
                                    ) : selectedPlatform === "YouTube" ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            <span className="text-sm text-black">YouTube</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                            <span className="text-sm text-black">Telegram</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* Update Times Display */}
            <div className="flex justify-center">
                <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg p-4">
                    <div className="flex items-center justify-center gap-8">
                        {/* Last Updated */}
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-black font-medium">Last Updated :</span>
                            <span className="text-md font-bold text-black">
                                {lastUpdated ? formatUTCDate(lastUpdated) : "N/A"}
                            </span>
                        </div>

                        {/* Separator */}
                        <div className="h-8 w-px bg-purple-200"></div>

                        {/* Next Update */}
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-black font-medium">Next Update :</span>
                            <span className="text-md font-bold text-black">
                                {nextUpdate ? formatUTCDate(nextUpdate) : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
                {/* Posts */}
                <div className="space-y-8">
                    {getDisplayData().map((post, index) => (
                        <div key={post.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
                            {/* Post Header */}
                            <div className="p-6 bg-gradient-to-r from-gray-50/50 to-white/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            {/* Influencer Info */}
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.influencer.avatar}
                                                    alt={post.influencer.name}
                                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                                />
                                                <div>
                                                    <div className="font-bold text-lg text-gray-800">{post.influencer.name}</div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        {post.platform === "YouTube" ? <FaYoutube className="text-red-500" /> : <FaTelegramPlane className="text-blue-500" />}
                                                        <span>{post.influencer.channel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Post Title */}
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                                            {post.title}
                                        </h3>
                                        
                                        {/* Post Time and Watch/View Button */}
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-lg">
                                                <FaCalendarAlt className="text-blue-500" />
                                                <span className="font-medium text-sm">Time of Post: {formatUTCDate(new Date(post.date))}</span>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <a
                                                href={post.videoUrl || post.telegramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 font-medium ${post.platform === "YouTube"
                                                        ? "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                                                        : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
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
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
                                        >
                                            <span>{expandedPosts[post.id] ? 'Hide Details' : 'Show Details'}</span>
                                            {expandedPosts[post.id] ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Collapsible Content */}
                            {expandedPosts[post.id] && (
                                <div className="border-t border-gray-100">
                                    <div className="p-6 space-y-6">
                                        {/* AI Summary Section */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                            <h4 className="font-bold mb-4 text-xl">
                                                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                                    ✨ AI Summary
                                                </span>
                                            </h4>
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-lg">{post.summary}</p>
                                            </div>
                                        </div>

                                        {/* Content Type Section */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                            <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                Content Type
                                            </h4>
                                            <div className="bg-white/70 rounded-lg p-4">
                                                <p className="text-gray-700 font-medium">{post.comment}</p>
                                            </div>
                                        </div>

                                        {/* Recommendations Section */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                                            <h4 className="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Posts Analysis
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {post.recommendations.map((rec, index) => {
                                                    const sentimentInfo = getSentimentInfo(rec.sentiment);
                                                    return (
                                                        <div key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <span className="font-bold text-2xl text-gray-800">{rec.coin}</span>
                                                                <span className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm ${sentimentInfo.color}`}>
                                                                    {sentimentInfo.icon}
                                                                    <span>{rec.sentiment.replace('_', ' ')}</span>
                                                                </span>
                                                            </div>
                                                            <div className="mt-4">
                                                                <span className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium capitalize shadow-sm">
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