"use client";
import { useState, useEffect } from "react";
import { FaYoutube, FaCalendarAlt, FaSync, FaArrowUp, FaArrowDown, FaMinus, FaTelegramPlane, FaEye, FaHeart, FaThumbsUp, FaChevronDown, FaChevronUp, FaStar, FaChartLine, FaWallet, FaExchangeAlt, FaGraduationCap, FaLightbulb, FaShoppingCart, FaSearch, FaCertificate } from "react-icons/fa";

export default function YouTubeTelegramInfluencers2() {
    const [selectedPlatform, setSelectedPlatform] = useState("Combined");
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [nextUpdate, setNextUpdate] = useState(() => {
        const next = new Date();
        next.setHours(next.getHours() + 4);
        return next;
    });
    const [expandedSummaries, setExpandedSummaries] = useState({});
    const [expandedCoins, setExpandedCoins] = useState({});
    const [hoveredPost, setHoveredPost] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [useLocalTime, setUseLocalTime] = useState(false);

    // Toggle summary expansion
    const toggleSummary = (postId) => {
        setExpandedSummaries(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // Toggle coins expansion
    const toggleCoins = (postId) => {
        setExpandedCoins(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // Render stars based on score
    const renderStars = (score) => {
        const stars = [];
        const fullStars = Math.floor(score / 2);
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaStar key={i} className="text-gray-600" />);
            }
        }
        
        return (
            <div className="flex">
                {stars}
            </div>
        );
    };

    // Fetch data from API
    const fetchData = () => {
        setLoading(true);
        fetch('https://mcm.showmyui.com:5000/api/admin/strategyyoutubedata/getlast6hrsytandtg')
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
                    timestamp: useLocalTime 
                        ? new Date(item.publishedAt).toLocaleString()
                        : new Date(item.publishedAt).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC',
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
                    timestamp: useLocalTime 
                        ? new Date(item.publishedAt).toLocaleString()
                        : new Date(item.publishedAt).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC',
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

    // Format date function for post headers
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        if (useLocalTime) {
            // Get timezone abbreviation for local time
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let timezone;
            
            if (userTimezone === 'Asia/Kolkata' || userTimezone === 'Asia/Calcutta') {
                timezone = 'IST';
            } else {
                const formatter = new Intl.DateTimeFormat('en', {
                    timeZoneName: 'short',
                    timeZone: userTimezone
                });
                const parts = formatter.formatToParts(date);
                let rawTimezone = parts.find(part => part.type === 'timeZoneName')?.value;
                
                // Replace GMT+XX:XX format with proper abbreviations
                if (rawTimezone && rawTimezone.includes('GMT+05:30')) {
                    timezone = 'IST';
                } else {
                    timezone = rawTimezone || userTimezone;
                }
            }
            
            const dateOptions = { year: "numeric", month: "short", day: "numeric" };
            const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
            
            return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString(undefined, timeOptions)} ${timezone}`;
        } else {
            const dateOptions = { year: "numeric", month: "short", day: "numeric", timeZone: 'UTC' };
            const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: 'UTC' };
            
            return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString(undefined, timeOptions)} UTC`;
        }
    };

    // Get sentiment color
    const getSentimentColor = (sentiment) => {
        if (sentiment.toLowerCase().includes("bullish")) return "text-green-400";
        if (sentiment.toLowerCase().includes("bearish")) return "text-red-400";
        return "text-blue-400"; // neutral
    };

    // Get column color - always blue-700 for all platforms
    const getColumnColor = (index) => {
        return "bg-blue-700";
    };

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 8) return "text-green-400";
        if (score >= 6) return "text-blue-400";
        if (score >= 4) return "text-yellow-400";
        return "text-red-400";
    };

    // Format date to UTC or local time for header display
    const formatDisplayDate = (date, showTimezone = true) => {
        if (!date) return "N/A";

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let dayName, day, month, year, hours, minutes, displayHours, ampm, timezone;

        if (useLocalTime) {
            // Use local time
            dayName = days[date.getDay()];
            day = date.getDate();
            month = months[date.getMonth()];
            year = date.getFullYear();
            hours = date.getHours();
            minutes = date.getMinutes();
            ampm = hours >= 12 ? 'PM' : 'AM';
            displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            
            // Get timezone abbreviation (e.g., IST, PST, EST)
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            if (userTimezone === 'Asia/Kolkata' || userTimezone === 'Asia/Calcutta') {
                timezone = 'IST';
            } else {
                const formatter = new Intl.DateTimeFormat('en', {
                    timeZoneName: 'short',
                    timeZone: userTimezone
                });
                const parts = formatter.formatToParts(date);
                let rawTimezone = parts.find(part => part.type === 'timeZoneName')?.value;
                
                // Replace GMT+XX:XX format with proper abbreviations
                if (rawTimezone && rawTimezone.includes('GMT+05:30')) {
                    timezone = 'IST';
                } else {
                    timezone = rawTimezone || userTimezone;
                }
            }
        } else {
            // Use UTC time
            dayName = days[date.getUTCDay()];
            day = date.getUTCDate();
            month = months[date.getUTCMonth()];
            year = date.getUTCFullYear();
            hours = date.getUTCHours();
            minutes = date.getUTCMinutes();
            ampm = hours >= 12 ? 'PM' : 'AM';
            displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            timezone = 'UTC';
        }

        const formattedHours = displayHours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const timezoneDisplay = showTimezone ? ` ${timezone}` : '';

        return `${dayName} ${day} ${month} ${year} ${formattedHours}:${formattedMinutes} ${ampm}${timezoneDisplay}`;
    };

    // Legacy function for backward compatibility
    const formatUTCDate = (date) => {
        return formatDisplayDate(date, true);
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 min-h-screen text-white">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="jsx-816192472cbeba0e flex justify-center">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mt-2">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Latest Posts
                    </h1>
                </div>

                {/* Platform Selection */}
                <div className="flex justify-center mb-8">
                    <div className="jsx-816192472cbeba0e bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border  border border-purple-500/30 p-4 w-full max-w-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <label className="text-lg text-gray-300 font-semibold">Platform:</label>
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    className="jsx-816192472cbeba0e bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                                >
                                    <option value="Combined" className="bg-gray-800">Combined</option>
                                    <option value="YouTube" className="bg-gray-800">YouTube</option>
                                    <option value="Telegram" className="bg-gray-800">Telegram</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300 font-medium">Source: </span>
                                <div className="flex items-center gap-2">
                                    {selectedPlatform === "Combined" ? (
                                        <>
                                            <FaYoutube className="text-red-500" />
                                            <span className="text-sm text-gray-300">YouTube</span>
                                            <FaTelegramPlane className="text-blue-500" />
                                            <span className="text-sm text-gray-300">Telegram</span>
                                        </>
                                    ) : selectedPlatform === "YouTube" ? (
                                        <>
                                            <FaYoutube className="text-red-500" />
                                            <span className="text-sm text-gray-300">YouTube</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTelegramPlane className="text-blue-500" />
                                            <span className="text-sm text-gray-300">Telegram</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Times Display */}
                <div className="flex justify-center mb-8">
                    <div className="jsx-816192472cbeba0e bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30 p-4 w-full max-w-2xl">
                        <div className="flex items-center justify-center gap-8">
                            <div className="flex flex-col items-center relative group">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 font-medium">Last Updated:</span>
                                    <FaEye 
                                        className="text-gray-400 hover:text-white cursor-pointer transition-colors" 
                                        onClick={() => setUseLocalTime(!useLocalTime)}
                                    />
                                </div>
                                <span className="text-md font-bold text-white">
                                    {lastUpdated ? formatDisplayDate(lastUpdated) : "N/A"}
                                </span>
                                
                                {/* Hover tooltip */}
                                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    <div className="text-xs">
                                        <div className="font-semibold text-blue-400 mb-1">
                                            {useLocalTime ? "Switch to UTC Time?" : "Convert to Local Time?"}
                                        </div>
                                        <div className="text-gray-300">
                                            {useLocalTime 
                                                ? "Times will be displayed in UTC timezone" 
                                                : "Times will be displayed in your browser's timezone"
                                            }
                                        </div>
                                        <div className="text-gray-400 mt-1">
                                            Current: {useLocalTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"}
                                        </div>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 border-l border-t border-gray-700 rotate-45"></div>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-gray-700"></div>

                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-400 font-medium">Next Update:</span>
                                <span className="text-md font-bold text-white">
                                    {nextUpdate ? formatDisplayDate(nextUpdate) : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div className="flex gap-4 overflow-x-auto pb-6">
                    {getDisplayData().map((post, index) => (
                        <div
                            key={post.id}
                            className="w-80 flex-shrink-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden border border-purple-500/30"
                        >
                            {/* Post Header with Platform Icon in Top Right */}
                            <div
                                className={`${getColumnColor(index)} text-white p-3 text-center text-sm font-bold flex justify-between items-center`}
                            >
                                <span>POST {index + 1}</span>
                                <div className="flex items-center">
                                    <span className="text-xs mr-2">{formatDate(post.date)}</span>
                                    {selectedPlatform === "YouTube" && (
                                        <FaYoutube className="text-white" />
                                    )}
                                    {selectedPlatform === "Telegram" && (
                                        <FaTelegramPlane className="text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Post Header */}
                            <div className="p-3 border-b border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-xs text-gray-300">Post Header</span>
                                </div>
                                <div className="text-sm mb-2 font-medium text-white" title={post.title}>
                                    {post.title}
                                </div>
                                <div className="text-xs">
                                    <a
                                        href={post.videoUrl || post.telegramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-1 ${post.platform === "YouTube" ? "text-red-400 hover:text-red-300" : "text-blue-400 hover:text-blue-300"}`}
                                    >
                                        {post.platform === "YouTube" ? "Watch Video" : "View Post"}
                                    </a>
                                </div>
                            </div>

                            {/* Post Summary */}
                            <div className="p-3 border-b border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-xs text-gray-300">Post Summary</span>
                                </div>
                                <div className={`text-xs text-gray-300 ${expandedSummaries[post.id] ? '' : 'line-clamp-8'}`}>
                                    {post.summary}
                                </div>
                                {post.summary.length > 300 && (
                                    <button
                                        onClick={() => toggleSummary(post.id)}
                                        className="text-xs text-blue-400 hover:text-blue-300 mt-2 cursor-pointer"
                                    >
                                        {expandedSummaries[post.id] ? 'Show Less' : 'Read More'}
                                    </button>
                                )}
                            </div>

                            {/* Post Analysis */}
                            <div
                                className="p-3 border-b border-gray-700 relative"
                                onMouseEnter={() => setHoveredPost(post.id)}
                                onMouseLeave={() => setHoveredPost(null)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-xs text-gray-300">Coins Analysis</span>
                                </div>

                                {/* Coins display */}
                                <div className="space-y-1 text-xs">
                                    {(expandedCoins[post.id] 
                                        ? post.mentionedCoins 
                                        : post.mentionedCoins.slice(0, 5)
                                    ).map((coin, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start ${getSentimentColor(coin.sentiment)}`}
                                            title={`${coin.name || coin.symbol}: ${coin.sentiment}, ${coin.cryptoRecommendationType}`}
                                        >
                                            <span className="mr-1">•</span>
                                            <span>
                                                {coin.name || coin.symbol}: {coin.sentiment.replace('_', ' ')}, {coin.cryptoRecommendationType}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {post.mentionedCoins.length > 5 && (
                                    <button
                                        onClick={() => toggleCoins(post.id)}
                                        className="text-xs text-blue-400 hover:text-blue-300 mt-2 cursor-pointer"
                                    >
                                        {expandedCoins[post.id] 
                                            ? 'Show Less' 
                                            : `+${post.mentionedCoins.length - 5} more coins`
                                        }
                                    </button>
                                )}

                                {/* Hover Tooltip */}
                                {hoveredPost === post.id && (
                                    <div className="absolute top-0 left-full ml-2 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-700 max-w-md">
                                        <div className="text-xs">
                                            <div className="font-bold mb-2 text-blue-400">Complete Post Analysis</div>

                                            <div className="mb-3">
                                                <span className="font-semibold text-blue-400">All Recommendations ({post.mentionedCoins.length}):</span>
                                                <div className="mt-1 max-h-32 overflow-y-auto">
                                                    {post.mentionedCoins.map((coin, i) => (
                                                        <div key={i} className={`${getSentimentColor(coin.sentiment)} mb-1 flex items-start`}>
                                                            <span className="mr-1">•</span>
                                                            <span>{coin.name || coin.symbol}: {coin.sentiment.replace('_', ' ')}, {coin.cryptoRecommendationType}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Actionable:</span> <span className={getScoreColor(post.actionableInsights)}>{post.actionableInsights}/10</span></span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Buying Zone:</span> <span className={getScoreColor(post.buyingPriceZone)}>{post.buyingPriceZone}/10</span></span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Clarity:</span> <span className={getScoreColor(post.clarityOfAnalysis)}>{post.clarityOfAnalysis}/10</span></span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Credibility:</span> <span className={getScoreColor(post.credibilityScore)}>{post.credibilityScore}/10</span></span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Educational:</span> <span className={getScoreColor(post.educationalPurpose)}>{post.educationalPurpose}/10</span></span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="mr-1 text-gray-400">•</span>
                                                    <span><span className="text-gray-400">Exit Strategy:</span> <span className={getScoreColor(post.exitStrategyScore)}>{post.exitStrategyScore}/10</span></span>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-2 border-t border-gray-700">
                                                <div className="text-gray-400 text-xs flex items-start">
                                                    <span className="mr-1">•</span>
                                                    <span><span className="font-semibold">Outlook:</span> {post.outlook}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MCM Scoring */}
                            <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-xs text-gray-300">MCM Scoring</span>
                                </div>
                                <ul className="text-xs space-y-2">
                                    <li className="flex items-center justify-between">
                                        <span className="text-gray-300">Overall</span>
                                        {renderStars(post.overallScore)}
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-gray-300">Educational</span>
                                        {renderStars(post.educationalPurpose)}
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-gray-300">Actionable</span>
                                        {renderStars(post.actionableInsights)}
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-gray-300">Credibility</span>
                                        {renderStars(post.credibilityScore)}
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="text-gray-300">Clarity</span>
                                        {renderStars(post.clarityOfAnalysis)}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}