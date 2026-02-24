"use client";
import { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import TwitterInfluencerProfileHeader from "./TwitterInfluencerProfileHeader";
import GaugeComponent from "react-gauge-component";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from 'recharts';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useTimezone } from "../../contexts/TimezoneContext";

// ===================== HARDCODED DATA =====================
const HARDCODED_CHANNEL_DATA = {
  success: true,
  results: {
    channel_id: "", // Will be set dynamically from channelId prop
    followers_count: 284500,
    last_updated: "2025-01-28T14:30:00Z",
    total_records: 1245,
    crypto_related: 980,
    Overall: {
      total_coins: 87,
      bullish_count: 520,
      bearish_count: 210,
      neutral_count: 250,
    },
    Gemini: {
      Yearly: {
        "2024": {
          summary: "This Twitter influencer has demonstrated a consistent track record of providing crypto analysis throughout 2024. Their posts frequently cover major assets like BTC, ETH, and SOL, with a focus on technical analysis and market sentiment. The influencer tends to be moderately bullish, with well-reasoned arguments backing their positions. Their engagement rate is notably high, suggesting a loyal and active follower base.",
          posting_frequency_analysis: "The influencer maintains a steady posting schedule with an average of 4-6 tweets per day. Activity peaks during major market movements, with increased posting during volatile periods. Weekend activity is slightly lower but still consistent, showing dedication to their audience.",
        },
        "2025": {
          summary: "In early 2025, the influencer has shifted focus towards emerging altcoins and DeFi narratives. Their analysis has become more data-driven, incorporating on-chain metrics and institutional flow data. They have been particularly accurate on SOL and AVAX calls, with several tweets preceding significant price movements.",
          posting_frequency_analysis: "Posting frequency has increased to 6-8 tweets per day in 2025, reflecting a more active market environment. The influencer has also started using Twitter Spaces for live market commentary, typically hosting 2-3 sessions per week.",
        },
      },
      Overall: {
        summary: "A well-established crypto Twitter influencer known for technical analysis and market commentary. Consistently provides actionable trading insights with a balanced approach to risk management. Has built a reputation for transparent track record sharing and educational content that helps followers understand market dynamics.",
        posting_frequency_analysis: "Maintains high posting frequency with an average of 5 tweets per day across all periods. Shows consistent engagement with followers through replies and quote tweets. Content mix includes chart analysis, macro commentary, and project fundamentals.",
      },
    },
    Ai_scoring: {
      Yearly: {
        "2023": {
          avg_overall_score: 6.8,
          avg_credibility_score: 7.2,
          avg_risk_management: 6.5,
          avg_actionable_insights: 6.9,
          avg_educational_purpose: 7.1,
        },
        "2024": {
          avg_overall_score: 7.5,
          avg_credibility_score: 7.8,
          avg_risk_management: 7.2,
          avg_actionable_insights: 7.6,
          avg_educational_purpose: 7.4,
        },
        "2025": {
          avg_overall_score: 8.1,
          avg_credibility_score: 8.3,
          avg_risk_management: 7.8,
          avg_actionable_insights: 8.0,
          avg_educational_purpose: 7.9,
        },
      },
    },
    Yearly: {
      "2023": {
        bullish_count: 180,
        bearish_count: 75,
        "1_hour": {
          price_true_count: 95,
          price_false_count: 60,
          price_probablity_of_winning_percentage: 61.3,
          price_probablity_of_loosing_percentage: 38.7,
          probablity_weighted_returns_percentage: 2.8,
        },
        "24_hours": {
          price_true_count: 105,
          price_false_count: 50,
          price_probablity_of_winning_percentage: 67.7,
          price_probablity_of_loosing_percentage: 32.3,
          probablity_weighted_returns_percentage: 5.4,
        },
        "7_days": {
          price_true_count: 98,
          price_false_count: 57,
          price_probablity_of_winning_percentage: 63.2,
          price_probablity_of_loosing_percentage: 36.8,
          probablity_weighted_returns_percentage: 8.1,
        },
        "30_days": {
          price_true_count: 88,
          price_false_count: 67,
          price_probablity_of_winning_percentage: 56.8,
          price_probablity_of_loosing_percentage: 43.2,
          probablity_weighted_returns_percentage: 12.5,
        },
        "60_days": {
          price_true_count: 82,
          price_false_count: 73,
          price_probablity_of_winning_percentage: 52.9,
          price_probablity_of_loosing_percentage: 47.1,
          probablity_weighted_returns_percentage: 15.2,
        },
        "90_days": {
          price_true_count: 79,
          price_false_count: 76,
          price_probablity_of_winning_percentage: 51.0,
          price_probablity_of_loosing_percentage: 49.0,
          probablity_weighted_returns_percentage: 18.7,
        },
        "180_days": {
          price_true_count: 85,
          price_false_count: 70,
          price_probablity_of_winning_percentage: 54.8,
          price_probablity_of_loosing_percentage: 45.2,
          probablity_weighted_returns_percentage: 25.3,
        },
        "1_year": {
          price_true_count: 90,
          price_false_count: 65,
          price_probablity_of_winning_percentage: 58.1,
          price_probablity_of_loosing_percentage: 41.9,
          probablity_weighted_returns_percentage: 42.6,
        },
      },
      "2024": {
        bullish_count: 220,
        bearish_count: 90,
        "1_hour": {
          price_true_count: 130,
          price_false_count: 80,
          price_probablity_of_winning_percentage: 61.9,
          price_probablity_of_loosing_percentage: 38.1,
          probablity_weighted_returns_percentage: 3.2,
        },
        "24_hours": {
          price_true_count: 145,
          price_false_count: 65,
          price_probablity_of_winning_percentage: 69.0,
          price_probablity_of_loosing_percentage: 31.0,
          probablity_weighted_returns_percentage: 6.8,
        },
        "7_days": {
          price_true_count: 138,
          price_false_count: 72,
          price_probablity_of_winning_percentage: 65.7,
          price_probablity_of_loosing_percentage: 34.3,
          probablity_weighted_returns_percentage: 11.4,
        },
        "30_days": {
          price_true_count: 125,
          price_false_count: 85,
          price_probablity_of_winning_percentage: 59.5,
          price_probablity_of_loosing_percentage: 40.5,
          probablity_weighted_returns_percentage: 18.9,
        },
        "60_days": {
          price_true_count: 118,
          price_false_count: 92,
          price_probablity_of_winning_percentage: 56.2,
          price_probablity_of_loosing_percentage: 43.8,
          probablity_weighted_returns_percentage: 22.1,
        },
        "90_days": {
          price_true_count: 112,
          price_false_count: 98,
          price_probablity_of_winning_percentage: 53.3,
          price_probablity_of_loosing_percentage: 46.7,
          probablity_weighted_returns_percentage: 28.5,
        },
        "180_days": {
          price_true_count: 120,
          price_false_count: 90,
          price_probablity_of_winning_percentage: 57.1,
          price_probablity_of_loosing_percentage: 42.9,
          probablity_weighted_returns_percentage: 35.2,
        },
        "1_year": {
          price_true_count: 128,
          price_false_count: 82,
          price_probablity_of_winning_percentage: 61.0,
          price_probablity_of_loosing_percentage: 39.0,
          probablity_weighted_returns_percentage: 55.8,
        },
      },
      "2025": {
        bullish_count: 120,
        bearish_count: 45,
        "1_hour": {
          price_true_count: 72,
          price_false_count: 38,
          price_probablity_of_winning_percentage: 65.5,
          price_probablity_of_loosing_percentage: 34.5,
          probablity_weighted_returns_percentage: 4.1,
        },
        "24_hours": {
          price_true_count: 78,
          price_false_count: 32,
          price_probablity_of_winning_percentage: 70.9,
          price_probablity_of_loosing_percentage: 29.1,
          probablity_weighted_returns_percentage: 7.5,
        },
        "7_days": {
          price_true_count: 74,
          price_false_count: 36,
          price_probablity_of_winning_percentage: 67.3,
          price_probablity_of_loosing_percentage: 32.7,
          probablity_weighted_returns_percentage: 13.2,
        },
        "30_days": {
          price_true_count: 68,
          price_false_count: 42,
          price_probablity_of_winning_percentage: 61.8,
          price_probablity_of_loosing_percentage: 38.2,
          probablity_weighted_returns_percentage: 21.5,
        },
        "60_days": null,
        "90_days": null,
        "180_days": null,
        "1_year": null,
      },
    },
    Quarterly: {
      "2024-Q1": {
        "30_days": {
          price_true_count: 30,
          price_false_count: 22,
          price_probablity_of_winning_percentage: 57.7,
          price_probablity_of_loosing_percentage: 42.3,
          probablity_weighted_returns_percentage: 14.2,
        },
        "7_days": {
          price_true_count: 35,
          price_false_count: 17,
          price_probablity_of_winning_percentage: 67.3,
          price_probablity_of_loosing_percentage: 32.7,
          probablity_weighted_returns_percentage: 9.8,
        },
        "24_hours": {
          price_true_count: 38,
          price_false_count: 14,
          price_probablity_of_winning_percentage: 73.1,
          price_probablity_of_loosing_percentage: 26.9,
          probablity_weighted_returns_percentage: 5.1,
        },
        "1_hour": {
          price_true_count: 32,
          price_false_count: 20,
          price_probablity_of_winning_percentage: 61.5,
          price_probablity_of_loosing_percentage: 38.5,
          probablity_weighted_returns_percentage: 2.9,
        },
        "60_days": null,
        "90_days": null,
        "180_days": null,
        "1_year": null,
      },
      "2024-Q2": {
        "30_days": {
          price_true_count: 33,
          price_false_count: 19,
          price_probablity_of_winning_percentage: 63.5,
          price_probablity_of_loosing_percentage: 36.5,
          probablity_weighted_returns_percentage: 16.8,
        },
        "7_days": {
          price_true_count: 36,
          price_false_count: 16,
          price_probablity_of_winning_percentage: 69.2,
          price_probablity_of_loosing_percentage: 30.8,
          probablity_weighted_returns_percentage: 10.5,
        },
        "24_hours": {
          price_true_count: 37,
          price_false_count: 15,
          price_probablity_of_winning_percentage: 71.2,
          price_probablity_of_loosing_percentage: 28.8,
          probablity_weighted_returns_percentage: 6.2,
        },
        "1_hour": {
          price_true_count: 34,
          price_false_count: 18,
          price_probablity_of_winning_percentage: 65.4,
          price_probablity_of_loosing_percentage: 34.6,
          probablity_weighted_returns_percentage: 3.5,
        },
        "60_days": null,
        "90_days": null,
        "180_days": null,
        "1_year": null,
      },
      "2024-Q3": {
        "30_days": {
          price_true_count: 28,
          price_false_count: 24,
          price_probablity_of_winning_percentage: 53.8,
          price_probablity_of_loosing_percentage: 46.2,
          probablity_weighted_returns_percentage: 10.3,
        },
        "7_days": {
          price_true_count: 32,
          price_false_count: 20,
          price_probablity_of_winning_percentage: 61.5,
          price_probablity_of_loosing_percentage: 38.5,
          probablity_weighted_returns_percentage: 7.8,
        },
        "24_hours": {
          price_true_count: 35,
          price_false_count: 17,
          price_probablity_of_winning_percentage: 67.3,
          price_probablity_of_loosing_percentage: 32.7,
          probablity_weighted_returns_percentage: 4.9,
        },
        "1_hour": {
          price_true_count: 30,
          price_false_count: 22,
          price_probablity_of_winning_percentage: 57.7,
          price_probablity_of_loosing_percentage: 42.3,
          probablity_weighted_returns_percentage: 2.1,
        },
        "60_days": null,
        "90_days": null,
        "180_days": null,
        "1_year": null,
      },
      "2024-Q4": {
        "30_days": {
          price_true_count: 34,
          price_false_count: 20,
          price_probablity_of_winning_percentage: 63.0,
          price_probablity_of_loosing_percentage: 37.0,
          probablity_weighted_returns_percentage: 19.5,
        },
        "7_days": {
          price_true_count: 35,
          price_false_count: 19,
          price_probablity_of_winning_percentage: 64.8,
          price_probablity_of_loosing_percentage: 35.2,
          probablity_weighted_returns_percentage: 12.1,
        },
        "24_hours": {
          price_true_count: 35,
          price_false_count: 19,
          price_probablity_of_winning_percentage: 64.8,
          price_probablity_of_loosing_percentage: 35.2,
          probablity_weighted_returns_percentage: 7.3,
        },
        "1_hour": {
          price_true_count: 34,
          price_false_count: 20,
          price_probablity_of_winning_percentage: 63.0,
          price_probablity_of_loosing_percentage: 37.0,
          probablity_weighted_returns_percentage: 3.8,
        },
        "60_days": null,
        "90_days": null,
        "180_days": null,
        "1_year": null,
      },
    },
    hyperactive: {
      Yearly: {
        "2023": { bullish_count: 45, bearish_count: 20 },
        "2024": { bullish_count: 68, bearish_count: 25 },
        "2025": { bullish_count: 35, bearish_count: 12 },
      },
    },
    normal: {
      Yearly: {
        "2023": { bullish_count: 135, bearish_count: 55 },
        "2024": { bullish_count: 152, bearish_count: 65 },
        "2025": { bullish_count: 85, bearish_count: 33 },
      },
    },
  },
};

// Hardcoded recent tweets data
const HARDCODED_TWEETS = [
  {
    id: "tweet_001",
    text: "$BTC looking strong above 100k support. The weekly close above this level is extremely bullish. Next target 115k-120k range. Accumulation zone for long-term holders. #Bitcoin #Crypto",
    symbol: "BTC",
    sentiment: "Strong_Bullish",
    action: "Buy",
    price_at_post: 101250.00,
    created_at: "2025-01-28T10:15:00Z",
    likes: 1245,
    retweets: 342,
    replies: 89,
    returns_30d: 8.5,
    returns_7d: 3.2,
    returns_24h: 1.1,
  },
  {
    id: "tweet_002",
    text: "$ETH breakout confirmed. The merge of ETH/BTC ratio bottoming out with increasing DeFi TVL is a strong signal. Target $4,200. Risk: below $3,000. #Ethereum",
    symbol: "ETH",
    sentiment: "Strong_Bullish",
    action: "Buy",
    price_at_post: 3450.00,
    created_at: "2025-01-27T14:30:00Z",
    likes: 892,
    retweets: 215,
    replies: 67,
    returns_30d: 12.3,
    returns_7d: 5.8,
    returns_24h: 2.4,
  },
  {
    id: "tweet_003",
    text: "$SOL ecosystem growing rapidly. NFT volume picking up and DePIN narrative gaining traction. Watching $220 as key resistance. Conservative target $250+. #Solana",
    symbol: "SOL",
    sentiment: "Mild_Bullish",
    action: "Buy",
    price_at_post: 198.50,
    created_at: "2025-01-26T09:45:00Z",
    likes: 756,
    retweets: 189,
    replies: 54,
    returns_30d: 15.7,
    returns_7d: 4.1,
    returns_24h: -0.8,
  },
  {
    id: "tweet_004",
    text: "$DOGE showing weakness at current levels. Meme coin momentum fading as capital rotates to utility tokens. Might see a retest of $0.25 before any meaningful bounce. #Dogecoin",
    symbol: "DOGE",
    sentiment: "Mild_Bearish",
    action: "Sell",
    price_at_post: 0.32,
    created_at: "2025-01-25T16:20:00Z",
    likes: 534,
    retweets: 145,
    replies: 112,
    returns_30d: -5.2,
    returns_7d: -2.1,
    returns_24h: -0.3,
  },
  {
    id: "tweet_005",
    text: "$AVAX the undervalued L1 play. Subnet adoption accelerating with gaming and enterprise use cases. Price lagging fundamentals significantly. Accumulating below $40. #Avalanche",
    symbol: "AVAX",
    sentiment: "Strong_Bullish",
    action: "Buy",
    price_at_post: 38.75,
    created_at: "2025-01-24T11:00:00Z",
    likes: 623,
    retweets: 178,
    replies: 43,
    returns_30d: 22.4,
    returns_7d: 8.9,
    returns_24h: 3.5,
  },
  {
    id: "tweet_006",
    text: "Market structure shifting. $BTC dominance declining while altcoin season index rising. Time to diversify into quality alts with strong fundamentals. Stay selective. #CryptoMarket",
    symbol: "BTC",
    sentiment: "Mild_Bullish",
    action: "Hold",
    price_at_post: 99800.00,
    created_at: "2025-01-23T08:30:00Z",
    likes: 1102,
    retweets: 298,
    replies: 76,
    returns_30d: 4.8,
    returns_7d: 1.5,
    returns_24h: 0.7,
  },
  {
    id: "tweet_007",
    text: "$LINK still one of the most undervalued infra plays. Oracle dominance, CCIP adoption, and staking going live. This is a $50+ token in this cycle. #Chainlink",
    symbol: "LINK",
    sentiment: "Strong_Bullish",
    action: "Buy",
    price_at_post: 22.80,
    created_at: "2025-01-22T13:45:00Z",
    likes: 845,
    retweets: 234,
    replies: 58,
    returns_30d: 18.6,
    returns_7d: 6.3,
    returns_24h: 1.9,
  },
  {
    id: "tweet_008",
    text: "Warning on $SHIB - volume declining significantly, whales are distributing. The chart looks like a textbook distribution pattern. Would avoid entering new positions here. #SHIB",
    symbol: "SHIB",
    sentiment: "Strong_Bearish",
    action: "Sell",
    price_at_post: 0.0000225,
    created_at: "2025-01-21T15:10:00Z",
    likes: 412,
    retweets: 156,
    replies: 203,
    returns_30d: -12.8,
    returns_7d: -4.5,
    returns_24h: -1.2,
  },
];

// ===================== MAIN COMPONENT =====================
export default function TwitterInfluencerProfile({ channelId }) {
  const { useLocalTime, formatDate } = useTimezone();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Use hardcoded data with dynamic channel_id
  const channelData = {
    ...HARDCODED_CHANNEL_DATA,
    results: {
      ...HARDCODED_CHANNEL_DATA.results,
      channel_id: channelId,
    },
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "performance", label: "Performance Summary" },
    { id: "recentActivities", label: "Latest Posts" },
    { id: "recommendations", label: "Audit" },
  ];

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.find(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-70 via-blue-50 to-purple-50 text-black-900 font-sans pb-16">
      {/* Header */}
      <TwitterInfluencerProfileHeader channelData={channelData} />

      {/* Tabs Navigation */}
      <div className="px-4">
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap
                ${activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-black-600 hover:text-black-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6">
        {activeTab === "overview" && (
          <OverviewTab channelData={channelData} />
        )}
        {activeTab === "performance" && (
          <PerformanceTab channelData={channelData} />
        )}
        {activeTab === "recommendations" && (
          <RecommendationsTab formatDate={formatDate} />
        )}
        {activeTab === "recentActivities" && (
          <LatestPostsTab channelId={channelId} />
        )}
      </div>
    </div>
  );
}

// ===================== OVERVIEW TAB =====================
function OverviewTab({ channelData }) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [summaryType, setSummaryType] = useState("yearly");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (channelData?.results?.Gemini?.Yearly && !selectedPeriod) {
      const currentYearStr = new Date().getFullYear().toString();
      if (channelData.results.Gemini.Yearly[currentYearStr]) {
        setSelectedPeriod(currentYearStr);
      } else {
        const availableYears = Object.keys(channelData.results.Gemini.Yearly).sort((a, b) => parseInt(b) - parseInt(a));
        if (availableYears.length > 0) {
          setSelectedPeriod(availableYears[0]);
        }
      }
    }
  }, [channelData, selectedPeriod]);

  // Helper function to strip bullet points and normalize text into paragraphs
  const normalizeText = (text) => {
    if (!text) return "";
    if (Array.isArray(text)) text = text.join(" ");
    let str = String(text);
    // Remove all bullet characters anywhere in text
    str = str.replace(/[•●]/g, '');
    // Remove list markers at start of lines (-, *, numbered)
    str = str.replace(/^[\s]*[\-\*]\s+/gm, '');
    str = str.replace(/^[\s]*\d+[\.\)]\s*/gm, '');
    // Replace newlines with spaces to join into flowing paragraph
    str = str.replace(/\n+/g, ' ');
    // Collapse multiple spaces into single space
    str = str.replace(/\s{2,}/g, ' ');
    return str.trim();
  };

  const truncateToWords = (text, wordCount = 40) => {
    const normalized = normalizeText(text);
    if (!normalized) return "";
    const words = normalized.split(/\s+/);
    if (words.length <= wordCount) return normalized;
    return words.slice(0, wordCount).join(" ") + "...";
  };

  return (
    <div className="flex flex-col gap-8 overflow-x-hidden">
      {/* Summary Section */}
      <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-[#0c0023]">About</h3>

        {/* Type Selection Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setSummaryType("yearly"); setSelectedPeriod(""); }}
            className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "yearly"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
              : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
              }`}
          >
            Year
          </button>
          <button
            onClick={() => { setSummaryType("overall"); setSelectedPeriod("overall"); }}
            className={`px-4 py-2 rounded-lg font-medium transition ${summaryType === "overall"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
              : "bg-gray-100 text-[#0c0023] hover:bg-gray-200"
              }`}
          >
            Cumulative
          </button>
        </div>

        {/* Period Selection Dropdown */}
        {summaryType === "yearly" && (
          <div className="mb-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-[#0c0023] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a year...</option>
              {channelData?.results?.Gemini?.Yearly &&
                Object.keys(channelData.results.Gemini.Yearly)
                  .sort((a, b) => parseInt(b) - parseInt(a))
                  .map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
            </select>
          </div>
        )}

        {/* Summary Display */}
        {selectedPeriod && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {(() => {
              const data = summaryType === "yearly"
                ? channelData?.results?.Gemini?.Yearly?.[selectedPeriod]
                : channelData?.results?.Gemini?.Overall;

              if (!data) return <p className="text-gray-500">No data available for this period.</p>;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0c0023] mb-2">Summary</h4>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        {isSummaryExpanded ? normalizeText(data.summary) : truncateToWords(data.summary)}
                      </p>
                      {data.summary && normalizeText(data.summary).split(/\s+/).length > 40 && (
                        <button
                          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                          className="text-sm text-cyan-600 hover:underline font-medium mt-2 focus:outline-none"
                        >
                          {isSummaryExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                    {data.posting_frequency_analysis && (
                      <div>
                        <h4 className="font-semibold text-[#0c0023] mb-2">Posting Frequency Analysis</h4>
                        <p className="text-gray-700 leading-relaxed text-justify">
                          {isSummaryExpanded ? normalizeText(data.posting_frequency_analysis) : truncateToWords(data.posting_frequency_analysis)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Channel Performance Metrics */}
      <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0c0023]">Channel Performance Metrics</h3>
        </div>

        <div className="space-y-6">
          {channelData?.results?.Ai_scoring?.Yearly
            ? (() => {
              const years = Object.keys(channelData.results.Ai_scoring.Yearly).sort().reverse();

              const metrics = [
                { key: 'overall_score', label: 'Overall Score', field: 'avg_overall_score', color: '#1e3a8a', definition: 'Combined score reflecting overall quality across all metrics.' },
                { key: 'credibility_score', label: 'Credibility Score', field: 'avg_credibility_score', color: '#1d4ed8', definition: 'Trustworthiness and accuracy of the content.' },
                { key: 'risk_management', label: 'Risk Management', field: 'avg_risk_management', color: '#3b82f6', definition: 'How well risk strategies are addressed.' },
                { key: 'actionable_insights', label: 'Actionable Insights', field: 'avg_actionable_insights', color: '#93c5fd', definition: 'Presence and quality of actionable insights.' },
                { key: 'educational_value', label: 'Educational Value', field: 'avg_educational_purpose', color: '#dbeafe', definition: 'Higher when explanations of why certain moves are expected are included.' }
              ];

              const chartsData = metrics.map(metric => {
                const data = years.map(year => ({
                  year: year === currentYear.toString() ? year + '*' : year,
                  value: channelData.results.Ai_scoring.Yearly[year][metric.field] || 0
                })).filter(d => d.value > 0);
                return { ...metric, data, hasData: data.length > 0 };
              }).filter(chart => chart.hasData);

              return (
                <div className="space-y-4">
                  {chartsData.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500 italic">No yearly performance data available</div>
                  ) : (
                    <>
                      <div className="block md:hidden grid grid-cols-1 gap-4">
                        {chartsData.map((metric) => (
                          <div key={metric.key} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h4 className="text-center font-medium text-gray-700">{metric.label}</h4>
                              <div className="relative group">
                                <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                  {metric.definition}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={180}>
                              <BarChart data={metric.data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#666" />
                                <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 11 }} stroke="#666" />
                                <Bar dataKey="value" fill={metric.color} radius={[8, 8, 0, 0]} barSize={40}>
                                  <LabelList dataKey="value" position="top" formatter={(value) => value.toFixed(1)} style={{ fontSize: '12px', fontWeight: 'bold', fill: '#333' }} />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ))}
                      </div>

                      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {chartsData.map((metric) => (
                          <div key={metric.key} className="space-y-2">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-[#0c0023]">{metric.label}</h4>
                              <div className="relative group">
                                <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                  {metric.definition}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={150}>
                              <BarChart data={metric.data} margin={{ top: 5, right: 5, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#666" />
                                <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 10 }} stroke="#666" />
                                <Bar dataKey="value" fill={metric.color} radius={[8, 8, 0, 0]} barSize={25}>
                                  <LabelList dataKey="value" position="top" formatter={(value) => value.toFixed(1)} style={{ fontSize: '12px', fontWeight: 'bold', fill: '#333' }} />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()
            : (
              <div className="h-40 flex items-center justify-center text-gray-500 italic">No yearly performance data available</div>
            )}
        </div>
      </div>

      {/* Total Recommendations Charts */}
      <div className="bg-white rounded-xl p-6 mb-2 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0c0023]">Total Recommendations</h3>
        </div>
        <div className="space-y-6">
          {(() => {
            const overallData = channelData?.results?.Yearly || {};
            const moonshotsData = channelData?.results?.hyperactive?.Yearly || {};
            const normalData = channelData?.results?.normal?.Yearly || {};

            const transformData = (data) => {
              return Object.keys(data).map(year => ({
                year: year === currentYear.toString() ? year + '*' : year,
                bullish: data[year].bullish_count,
                bearish: data[year].bearish_count
              })).sort((a, b) => b.year.replace('*', '') - a.year.replace('*', ''));
            };

            const categories = [
              { key: 'overall', label: 'Overall', data: transformData(overallData) },
              { key: 'with_moonshots', label: 'Moonshots', data: transformData(moonshotsData) },
              { key: 'without_moonshots', label: 'Without Moonshots', data: transformData(normalData) }
            ];

            const chartsData = categories.map(category => ({
              ...category,
              hasData: category.data.length > 0
            })).filter(chart => chart.hasData);

            const explanations = [
              {
                title: "Understanding the Categories",
                content: "Recommendation is deemed if the language used by the influencer carries an identifiable sentiment such as bullish or bearish, and could be interpreted by a user/retail investor as a buy or sell indication."
              }
            ];

            return (
              <div className="space-y-4">
                {chartsData.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-gray-500 italic">No recommendation data available</div>
                ) : (
                  <>
                    <div className="hidden md:grid md:grid-cols-4 gap-3">
                      {chartsData.map((category) => (
                        <div key={category.key} className="space-y-2">
                          <h4 className="text-sm font-semibold text-[#0c0023] text-center mb-2 flex items-center justify-center gap-1">
                            {category.label}
                            {(category.key === 'with_moonshots' || category.key === 'without_moonshots') && (
                              <div className="relative group">
                                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <div className="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg border border-gray-700 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-left font-normal">
                                  {category.key === 'with_moonshots'
                                    ? "Moonshot is defined by hyperactivity in a coin recommended by the influencer within a short period of time."
                                    : "Refers to fundamental, organic-growth crypto assets that are not driven by influencer hype or short-term pumps."}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            )}
                          </h4>
                          <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={category.data} margin={{ top: 25, right: 5, left: 0, bottom: 25 }}>
                              <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#666" />
                              <YAxis hide={true} />
                              <Bar dataKey="bullish" fill="#1e3a8a" name="Bullish" radius={[4, 4, 0, 0]} barSize={15}>
                                <LabelList dataKey="bullish" position="top" style={{ fontSize: '10px', fill: '#333' }} formatter={(value) => value.toLocaleString()} />
                              </Bar>
                              <Bar dataKey="bearish" fill="#dbeafe" name="Bearish" radius={[4, 4, 0, 0]} barSize={15}>
                                <LabelList dataKey="bearish" position="top" style={{ fontSize: '10px', fill: '#333' }} formatter={(value) => value.toLocaleString()} />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ))}
                      <div className="bg-gray-50 rounded-lg p-4">
                        {explanations.map((explanation, index) => (
                          <div key={index}>
                            <h4 className="text-sm font-semibold text-[#0c0023] mb-2">{explanation.title}</h4>
                            <p className="text-xs text-gray-600">{explanation.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile layout */}
                    <div className="block md:hidden grid grid-cols-1 gap-4">
                      {chartsData.map((category) => (
                        <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="text-center font-medium text-gray-700 mb-3">{category.label}</h4>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={category.data} margin={{ top: 30, right: 10, left: 0, bottom: 30 }}>
                              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#666" />
                              <YAxis hide={true} />
                              <Bar dataKey="bullish" fill="#1e3a8a" name="Bullish" radius={[4, 4, 0, 0]} barSize={20}>
                                <LabelList dataKey="bullish" position="top" style={{ fontSize: '10px', fill: '#333' }} formatter={(value) => value.toLocaleString()} />
                              </Bar>
                              <Bar dataKey="bearish" fill="#dbeafe" name="Bearish" radius={[4, 4, 0, 0]} barSize={20}>
                                <LabelList dataKey="bearish" position="top" style={{ fontSize: '10px', fill: '#333' }} formatter={(value) => value.toLocaleString()} />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: "#1e3a8a" }}></div>
                        <span className="text-sm text-[#0c0023]">Bullish</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: "#dbeafe" }}></div>
                        <span className="text-sm text-[#0c0023]">Bearish</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ===================== PERFORMANCE TAB =====================
function PerformanceTab({ channelData }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [expandedRecommendations, setExpandedRecommendations] = useState(false);
  const [expandedWinLoss, setExpandedWinLoss] = useState(false);
  const [expandedAverageReturn, setExpandedAverageReturn] = useState(false);
  const [expandedYearsROI, setExpandedYearsROI] = useState({});
  const [expandedYearsWinRate, setExpandedYearsWinRate] = useState({});
  const [hoveredColumnROI, setHoveredColumnROI] = useState(null);
  const [hoveredRowROI, setHoveredRowROI] = useState(null);
  const [hoveredColumnWinRate, setHoveredColumnWinRate] = useState(null);
  const [hoveredRowWinRate, setHoveredRowWinRate] = useState(null);

  const toggleYearROI = (year) => {
    setExpandedYearsROI(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const formatPercentageWithStyling = (value, column, hoveredColumn, hoveredRow, row) => {
    const isHovered = hoveredColumn === column && hoveredRow === row;
    const isNegative = value && value < 0;
    const display = value != null ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%` : 'N/A';
    return { display, isHovered, isNegative };
  };

  const quarterLabelsROI = {
    q1: "Jan - Mar (Q1)",
    q2: "Apr - Jun (Q2)",
    q3: "Jul - Sep (Q3)",
    q4: "Oct - Dec (Q4)"
  };

  const yearlyData = channelData?.results?.Yearly || {};
  const quarterlyData = channelData?.results?.Quarterly || {};
  const availableYears = Object.keys(yearlyData).sort().reverse();
  const currentYear = new Date().getFullYear();

  const getPeriodOptions = () => {
    const options = [{ value: "", label: "All Periods" }];
    const quarterLabels = { Q1: "Jan - Mar (Q1)", Q2: "Apr - Jun (Q2)", Q3: "Jul - Sep (Q3)", Q4: "Oct - Dec (Q4)" };
    Object.entries(quarterLabels).forEach(([quarter, label]) => {
      options.push({ value: quarter, label });
    });
    return options;
  };

  const getDynamicColumns = () => {
    return availableYears
      .filter((year) => year !== "2026")
      .map((year) => ({ type: "year", key: year, label: year }));
  };

  const dynamicColumns = getDynamicColumns();

  const getYearData = (yearKey) => {
    const timeframeKey = selectedTimeframe === "1" ? "1_hour" : selectedTimeframe === "24" ? "24_hours" : selectedTimeframe === "7" ? "7_days" : selectedTimeframe === "30" ? "30_days" : selectedTimeframe === "90" ? "90_days" : selectedTimeframe === "180" ? "180_days" : selectedTimeframe === "365" ? "1_year" : "30_days";

    let baseData;
    if (selectedPeriod && quarterlyData) {
      const quarterlyKey = `${yearKey}-${selectedPeriod}`;
      const quarterlyYearData = quarterlyData[quarterlyKey];
      if (quarterlyYearData) baseData = quarterlyYearData[timeframeKey];
    } else {
      baseData = yearlyData[yearKey]?.[timeframeKey];
    }
    return baseData || null;
  };

  const calculateYearMetrics = (yearKey) => {
    const data = getYearData(yearKey);
    if (!data) return null;
    const totalRecommendations = (data.price_true_count || 0) + (data.price_false_count || 0);
    if (totalRecommendations === 0) return null;
    return {
      totalRecommendations,
      winPercentage: data.price_probablity_of_winning_percentage || 0,
      lossPercentage: data.price_probablity_of_loosing_percentage || 0,
      averageReturn: data.probablity_weighted_returns_percentage || 0,
      winningTrades: data.price_true_count || 0,
      losingTrades: data.price_false_count || 0,
    };
  };

  const periodOptions = getPeriodOptions();

  return (
    <div className="space-y-6">
      {/* Performance Table */}
      <div className="light-theme-table bg-white rounded-xl p-6 border border-gray-200 overflow-x-auto text-to-purple">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mb-4">
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex items-center gap-4 min-w-max px-2 py-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-to-purple whitespace-nowrap">Period:</label>
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="light-dropdown bg-[#c4c5e14d] border border-gray-300 rounded-lg px-3 py-1 text-sm text-to-purple">
                  {periodOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-to-purple whitespace-nowrap">Timeframe:</label>
                <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} className="light-dropdown bg-[#c4c5e14d] border border-gray-300 rounded-lg px-3 py-1 text-sm text-to-purple">
                  <option value="1">1 Hour</option>
                  <option value="24">24 Hours</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-to-purple font-semibold text-sm">Hits & Misses</th>
              {dynamicColumns.map((column) => (
                <th key={column.key} className="text-center py-3 px-4 text-to-purple font-semibold text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>{column.label}</span>
                    {selectedPeriod && <span>{selectedPeriod}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Total Recommendations Row */}
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4 text-to-purple font-medium">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">No. of Recommendations during period</span>
                  <button onClick={() => setExpandedRecommendations(!expandedRecommendations)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className={`w-4 h-4 transform transition-transform ${expandedRecommendations ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </td>
              {dynamicColumns.map((column) => {
                const metrics = calculateYearMetrics(column.key);
                return (
                  <td key={column.key} className="py-4 px-4 text-center">
                    <div className="font-semibold text-sm text-to-purple">{metrics ? metrics.totalRecommendations.toLocaleString() : "-"}</div>
                  </td>
                );
              })}
            </tr>

            {/* Expanded Rows */}
            {expandedRecommendations && (
              <>
                <tr className="border-b border-gray-100 light-dropdown">
                  <td className="py-3 px-4 text-to-purple font-semibold text-sm pl-8">Moonshots</td>
                  {dynamicColumns.map((column) => {
                    const metrics = calculateYearMetrics(column.key);
                    return (<td key={column.key} className="py-3 px-4 text-center"><div className="font-semibold text-sm text-to-purple">{metrics ? Math.floor(metrics.totalRecommendations * 0.7).toLocaleString() : "-"}</div></td>);
                  })}
                </tr>
                <tr className="border-b border-gray-100 light-dropdown">
                  <td className="py-3 px-4 text-to-purple font-semibold text-sm pl-8">Without Moonshots</td>
                  {dynamicColumns.map((column) => {
                    const metrics = calculateYearMetrics(column.key);
                    return (<td key={column.key} className="py-3 px-4 text-center"><div className="font-semibold text-sm text-to-purple">{metrics ? Math.floor(metrics.totalRecommendations * 0.3).toLocaleString() : "-"}</div></td>);
                  })}
                </tr>
              </>
            )}

            {/* Win/Loss Ratio Row */}
            <tr className="light-win-loss-row">
              <td className="light-win-loss-header">
                <div className="header-content">
                  <span className="font-semibold text-sm">Win/Loss Ratio (Cumulative)</span>
                  <button onClick={() => setExpandedWinLoss(!expandedWinLoss)} className="light-expand-button">
                    <svg className={`expand-icon ${expandedWinLoss ? "expanded" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </td>
              {dynamicColumns.map((column) => {
                const metrics = calculateYearMetrics(column.key);
                const winPercentage = metrics?.winPercentage || 0;
                return (
                  <td key={column.key} className="light-win-loss-cell text-center">
                    {metrics ? (
                      <div className="flex flex-col items-center gap-2">
                        <GaugeComponent
                          id={`gauge-${column.key}-winloss`}
                          type="radial"
                          style={{ width: 60, height: 60 }}
                          labels={{ valueLabel: { hide: true }, tickLabels: { ticks: [{ value: 20 }, { value: 50 }, { value: 80 }, { value: 100 }] } }}
                          arc={{ colorArray: ['#CE1F1F', '#00FF15'], nbSubArcs: 90, padding: 0.01, width: 0.4 }}
                          pointer={{ animationDelay: 0, strokeWidth: 7 }}
                          value={winPercentage}
                        />
                        <div className="font-semibold text-sm text-to-purple">{Math.round(winPercentage)}% Win</div>
                      </div>
                    ) : (
                      <div className="light-empty-metric">-</div>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Average Return Row */}
            <tr className="light-win-loss-row">
              <td className="light-win-loss-header">
                <div className="header-content">
                  <span className="font-semibold text-sm">Average Return (Cumulative)</span>
                  <button onClick={() => setExpandedAverageReturn(!expandedAverageReturn)} className="light-expand-button">
                    <svg className={`expand-icon ${expandedAverageReturn ? "expanded" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </td>
              {dynamicColumns.map((column) => {
                const metrics = calculateYearMetrics(column.key);
                if (!metrics) return (<td key={column.key} className="light-win-loss-cell"><div className="light-empty-metric">-</div></td>);

                const returnValue = metrics.averageReturn || 0;
                const barWidth = 100;
                const ballDiameter = 14;
                const maxTravel = barWidth - ballDiameter;
                const minValue = -100;
                const maxValue = 500;
                const clamped = Math.max(Math.min(returnValue, maxValue), minValue);
                const normalized = (clamped - minValue) / (maxValue - minValue);
                const positionPx = normalized * maxTravel;

                return (
                  <td key={column.key} className="light-win-loss-cell">
                    <div className="win-loss-container">
                      <div className="segmented-bar-container">
                        <div className="segmented-bar-background">
                          <div className="segment segment-red" />
                          <div className="segment segment-yellow" />
                          <div className="segment segment-green" />
                        </div>
                        <div className="percentage-ball" style={{ left: `${positionPx}px` }} />
                      </div>
                      <div className="font-semibold text-sm text-to-purple">{returnValue > 0 ? "+" : ""}{returnValue.toFixed(1)}%</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Performance Overview ROI Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Performance Overview ROI</h3>
        </div>
        <p className="text-md mb-3 text-to-purple">Hover Mouse for info</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-black">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" rowSpan={2}>Year</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" colSpan={8}>Holding Period (From the Date of Post/Recommendations)</th>
              </tr>
              <tr>
                {['1 Hour', '24 Hours', '7 Days', '30 Days', '60 Days', '90 Days', '180 Days', '1 Year'].map((label, i) => {
                  const keys = ['1_hour', '24_hours', '7_days', '30_days', '60_days', '90_days', '180_days', '1_year'];
                  return (
                    <th key={keys[i]} className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                      onMouseEnter={() => setHoveredColumnROI(keys[i])}
                      onMouseLeave={() => setHoveredColumnROI(null)}>{label}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {channelData?.results?.Yearly &&
                Object.entries(channelData.results.Yearly)
                  .filter(([year]) => parseInt(year) !== 2026)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, yearData]) => {
                    const yearQuarters = channelData?.results?.Quarterly
                      ? Object.entries(channelData.results.Quarterly)
                        .filter(([quarter]) => quarter && quarter.startsWith(year))
                        .sort(([a], [b]) => {
                          const qA = parseInt(a.split("-")[1]?.replace("Q", "") || "0");
                          const qB = parseInt(b.split("-")[1]?.replace("Q", "") || "0");
                          return qA - qB;
                        })
                      : [];

                    const timeframeKeys = ['1_hour', '24_hours', '7_days', '30_days', '60_days', '90_days', '180_days', '1_year'];

                    return (
                      <Fragment key={year}>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer" onClick={() => yearQuarters.length > 0 && toggleYearROI(year)}>
                            <div className="flex items-center gap-2">
                              <span>{parseInt(year) >= currentYear ? `${year}*` : year}</span>
                              {yearQuarters.length > 0 && (
                                <svg className={`w-4 h-4 transform transition-transform ${expandedYearsROI[year] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </div>
                          </td>
                          {timeframeKeys.map((tfKey) => {
                            const result = formatPercentageWithStyling(yearData?.[tfKey]?.probablity_weighted_returns_percentage, tfKey, hoveredColumnROI, hoveredRowROI, year);
                            return (
                              <td key={tfKey}
                                className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${result.isHovered ? (result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold") : (result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold")} ${hoveredColumnROI === tfKey && hoveredRowROI === year ? 'bg-yellow-200' : ''}`}
                                onMouseEnter={() => { setHoveredColumnROI(tfKey); setHoveredRowROI(year); }}
                                onMouseLeave={() => { setHoveredColumnROI(null); setHoveredRowROI(null); }}
                              >
                                {result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Quarter rows */}
                        {expandedYearsROI[year] && yearQuarters.map(([quarter, quarterData]) => (
                          <tr key={quarter} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-1 text-xs text-to-purple">
                              {quarterLabelsROI[quarter.slice(-2).toLowerCase()] ?? quarter}
                            </td>
                            {timeframeKeys.map((tfKey) => {
                              const result = formatPercentageWithStyling(quarterData?.[tfKey]?.probablity_weighted_returns_percentage, tfKey, hoveredColumnROI, hoveredRowROI, quarter);
                              return (
                                <td key={tfKey}
                                  className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${result.isHovered ? (result.isNegative ? "text-red-800 font-bold" : "text-to-purple font-bold") : (result.isNegative ? "text-red-200 hover:text-red-800 hover:font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold")} ${hoveredColumnROI === tfKey && hoveredRowROI === quarter ? 'bg-yellow-200' : ''}`}
                                  onMouseEnter={() => { setHoveredColumnROI(tfKey); setHoveredRowROI(quarter); }}
                                  onMouseLeave={() => { setHoveredColumnROI(null); setHoveredRowROI(null); }}
                                >
                                  {result.display === 'N/A' ? <span className={result.isHovered ? "text-red-800 font-bold" : "text-red-200 hover:text-red-800 hover:font-bold"}>N/A</span> : result.display}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Win Rate Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Performance Overview Win Rate</h3>
        </div>
        <p className="text-md mb-3 text-to-purple">Hover Mouse for info</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-black">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" rowSpan={2}>Year</th>
                <th className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple" colSpan={8}>Holding Period (From the Date of Post/Recommendations)</th>
              </tr>
              <tr>
                {['1 Hour', '24 Hours', '7 Days', '30 Days', '60 Days', '90 Days', '180 Days', '1 Year'].map((label, i) => {
                  const keys = ['1_hour', '24_hours', '7_days', '30_days', '60_days', '90_days', '180_days', '1_year'];
                  return (
                    <th key={keys[i]} className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple cursor-pointer"
                      onMouseEnter={() => setHoveredColumnWinRate(keys[i])}
                      onMouseLeave={() => setHoveredColumnWinRate(null)}>{label}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {channelData?.results?.Yearly &&
                Object.entries(channelData.results.Yearly)
                  .filter(([year]) => parseInt(year) !== 2026)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, yearData]) => {
                    const timeframeKeys = ['1_hour', '24_hours', '7_days', '30_days', '60_days', '90_days', '180_days', '1_year'];
                    return (
                      <tr key={year} className="hover:bg-gray-50">
                        <td className="border border-gray-300 bg-gray-50 px-3 py-1 font-medium text-to-purple">
                          {parseInt(year) >= currentYear ? `${year}*` : year}
                        </td>
                        {timeframeKeys.map((tfKey) => {
                          const winRate = yearData?.[tfKey]?.price_probablity_of_winning_percentage;
                          const result = formatPercentageWithStyling(winRate, tfKey, hoveredColumnWinRate, hoveredRowWinRate, year);
                          return (
                            <td key={tfKey}
                              className={`border border-gray-300 px-2 py-1 text-center cursor-pointer ${result.isHovered ? "text-to-purple font-bold" : "text-gray-300 hover:text-to-purple hover:font-bold"} ${hoveredColumnWinRate === tfKey && hoveredRowWinRate === year ? 'bg-yellow-200' : ''}`}
                              onMouseEnter={() => { setHoveredColumnWinRate(tfKey); setHoveredRowWinRate(year); }}
                              onMouseLeave={() => { setHoveredColumnWinRate(null); setHoveredRowWinRate(null); }}
                            >
                              {result.display === 'N/A' ? <span className="text-gray-300">N/A</span> : result.display}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== LATEST POSTS TAB =====================
function LatestPostsTab({ channelId }) {
  const { formatDate } = useTimezone();
  const [expandedPosts] = useState({});
  const [hoveredPost, setHoveredPost] = useState(null);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedMarketing, setExpandedMarketing] = useState({});

  // Format hardcoded tweets into the card-based format
  const recentPosts = HARDCODED_TWEETS.map((tweet, index) => ({
    id: index + 1,
    title: tweet.text ? (tweet.text.substring(0, 80) + (tweet.text.length > 80 ? "..." : "")) : "No message",
    date: tweet.created_at,
    summary: `Analysis of ${tweet.symbol}: ${tweet.sentiment?.replace("_", " ")} sentiment with ${tweet.action} action. Price at time of post was $${tweet.price_at_post?.toLocaleString()}. Returns show ${tweet.returns_30d > 0 ? 'positive' : 'negative'} performance over 30 days at ${tweet.returns_30d > 0 ? '+' : ''}${tweet.returns_30d}%.`,
    coinRecommendations: [
      {
        coin: tweet.symbol,
        name: tweet.symbol,
        sentiment: tweet.sentiment,
        term: "short-term",
        outlook: "short-term",
        action: tweet.action,
        price: `$${tweet.price_at_post?.toLocaleString()}`
      }
    ],
    messageUrl: `https://x.com/${channelId}/status/${tweet.id}`,
    outlook: "short-term",
    overallScore: 7 + Math.random() * 2,
    educationalPurpose: 6 + Math.random() * 3,
    actionableInsights: 7 + Math.random() * 2,
    marketingContent: "No marketing content detected in this post.",
    views: tweet.likes + tweet.retweets + tweet.replies,
    forwards: tweet.retweets,
    messageText: tweet.text,
  }));

  const toggleSummary = (postId) => {
    setExpandedSummaries(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleTitle = (postId) => {
    setExpandedTitles(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleMarketing = (postId) => {
    setExpandedMarketing(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const renderStars = (score) => {
    const stars = [];
    const rating = score / 2;
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
    return <div className="flex">{stars}</div>;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment?.toLowerCase().includes("bullish")) return "text-green-500";
    if (sentiment?.toLowerCase().includes("bearish")) return "text-red-500";
    return "text-blue-500";
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-blue-500";
    if (score >= 4) return "text-yellow-500";
    return "text-red-500";
  };

  const formatCoinName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const formatSentiment = (sentiment) => {
    if (!sentiment) return 'N/A';
    return sentiment.replace('_', ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatHoldingPeriod = (term) => {
    if (!term || term.toLowerCase() === 'no outlook') return 'Not Specified';
    return term.replace(/-/g, ' ').split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="bg-white min-h-screen rounded-xl text-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            @{channelId}
          </h1>
          <div className="mt-3 flex flex-wrap justify-start gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-gray-600">Total Posts:</span>
              <span className="font-semibold text-gray-900 bg-blue-100 px-3 py-1 rounded-full">{recentPosts.length} tweets</span>
            </div>
          </div>
        </div>

        {/* Posts - Horizontal scroll cards */}
        <div className="flex gap-4 overflow-x-auto pb-6">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="w-80 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg"
            >
              {/* Post Header with Number */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 text-center text-sm font-bold flex justify-between items-center">
                <span>POST {post.id}</span>
                <span className="text-xs">{formatDate(post.date)}</span>
              </div>

              {/* Post Title */}
              <div className="p-3 border-b border-gray-200">
                <div className="min-h-[40px] mb-2">
                  <div className={`text-sm font-medium text-gray-900 ${expandedTitles[post.id] ? '' : 'line-clamp-2'}`} title={post.messageText}>
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
                  <div className="flex justify-between text-gray-600">
                    <span>Views: {post.views?.toLocaleString()}</span>
                    <span>Retweets: {post.forwards?.toLocaleString()}</span>
                  </div>
                  <a
                    href={post.messageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    View Tweet
                  </a>
                </div>
              </div>

              {/* MCM Scoring */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-xs text-gray-700">MCM Scoring</span>
                </div>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Overall</span>
                    {renderStars(post.overallScore)}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Educational</span>
                    {renderStars(post.educationalPurpose)}
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Actionable</span>
                    {renderStars(post.actionableInsights)}
                  </li>
                  <li className="flex flex-col">
                    <span className="text-gray-700 mb-2">Marketing Content</span>
                    <div className={`text-xs text-gray-500 ${expandedMarketing[post.id] ? 'leading-tight' : 'truncate overflow-hidden whitespace-nowrap'}`}>
                      {post.marketingContent || "N/A"}
                    </div>
                    <div className="h-6 mt-2">
                      {typeof post.marketingContent === "string" && post.marketingContent.length > 50 && (
                        <button
                          onClick={() => toggleMarketing(post.id)}
                          className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer self-start"
                        >
                          {expandedMarketing[post.id] ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Post Summary */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-gray-700">Post Summary</span>
                  <button
                    onClick={() => toggleSummary(post.id)}
                    className="text-lg text-blue-500 hover:text-blue-700 cursor-pointer font-bold"
                  >
                    {expandedSummaries[post.id] ? '−' : '+'}
                  </button>
                </div>
                <div className="min-h-[96px] mb-2">
                  <div className={`text-xs text-gray-600 leading-tight transition-all duration-300 ${expandedSummaries[post.id] ? '' : 'line-clamp-4'}`}>
                    {post.summary || "No summary available"}
                  </div>
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
                  <span className="font-bold text-xs text-gray-700">Coins Analysis</span>
                </div>
                <div className="flex justify-center">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-center text-gray-700 pb-1 pr-2">Name</th>
                          <th className="text-center text-gray-700 pb-1 pr-2">Sentiment</th>
                          <th className="text-center text-gray-700 pb-1">Holding Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const coins = expandedPosts[post.id]
                            ? post.coinRecommendations || []
                            : (post.coinRecommendations || []).slice(0, 5);
                          const rows = [];
                          for (let i = 0; i < Math.max(1, coins.length); i++) {
                            const coin = coins[i];
                            rows.push(
                              <tr key={i} className={coin ? "border-b border-gray-200" : ""}>
                                <td className="py-1 pr-2 text-center">
                                  {coin ? <span className="text-gray-900">{formatCoinName(coin.name)}</span> : <span className="text-transparent">-</span>}
                                </td>
                                <td className="py-1 pr-2 text-center">
                                  {coin ? <span className={getSentimentColor(coin.sentiment)}>{formatSentiment(coin.sentiment)}</span> : <span className="text-transparent">-</span>}
                                </td>
                                <td className="py-1 text-center">
                                  {coin ? <span className="text-gray-700">{formatHoldingPeriod(coin.term)}</span> : <span className="text-transparent">-</span>}
                                </td>
                              </tr>
                            );
                          }
                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </div>
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
                              {rec.price && <span className="ml-1 text-gray-400">@ {rec.price}</span>}
                              {rec.action && <span className="ml-1 text-yellow-400">({rec.action})</span>}
                            </div>
                          )) || []}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start">
                          <span className="mr-1 text-gray-400">•</span>
                          <span><span className="text-gray-400">Actionable:</span> <span className={getScoreColor(post.actionableInsights)}>{post.actionableInsights?.toFixed(1)}/10</span></span>
                        </div>
                        <div className="flex items-start">
                          <span className="mr-1 text-gray-400">•</span>
                          <span><span className="text-gray-400">Educational:</span> <span className={getScoreColor(post.educationalPurpose)}>{post.educationalPurpose?.toFixed(1)}/10</span></span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-600">
                        <div className="text-gray-400 text-xs flex items-start">
                          <span className="mr-1">•</span>
                          <span><span className="font-semibold">Engagement:</span> {post.views?.toLocaleString()} views | {post.forwards?.toLocaleString()} retweets</span>
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
    </div>
  );
}

// ===================== AUDIT / RECOMMENDATIONS TAB =====================
function RecommendationsTab({ formatDate }) {
  const [selectedSentiment, setSelectedSentiment] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Hardcoded recommendations data matching Telegram Audit UI
  const allRecommendations = [
    { _id: "rec_001", date: "2025-01-28T10:15:00Z", symbol: "BTC", coin_name: "Bitcoin", sentiment: "Strong_Bullish", price: 101250.00, "1_hour_price_returns": 0.8, "24_hours_price_returns": 1.1, "7_days_price_returns": 3.2, "30_days_price_returns": 8.5, "60_days_price_returns": 12.3, "90_days_price_returns": 15.8, "180_days_price_returns": 28.5, "1_year_price_returns": 45.2 },
    { _id: "rec_002", date: "2025-01-27T14:30:00Z", symbol: "ETH", coin_name: "Ethereum", sentiment: "Strong_Bullish", price: 3450.00, "1_hour_price_returns": 1.2, "24_hours_price_returns": 2.4, "7_days_price_returns": 5.8, "30_days_price_returns": 12.3, "60_days_price_returns": 18.5, "90_days_price_returns": 22.1, "180_days_price_returns": 35.8, "1_year_price_returns": 62.5 },
    { _id: "rec_003", date: "2025-01-26T09:45:00Z", symbol: "SOL", coin_name: "Solana", sentiment: "Mild_Bullish", price: 198.50, "1_hour_price_returns": -0.3, "24_hours_price_returns": -0.8, "7_days_price_returns": 4.1, "30_days_price_returns": 15.7, "60_days_price_returns": 22.4, "90_days_price_returns": 28.9, "180_days_price_returns": 45.2, "1_year_price_returns": 85.3 },
    { _id: "rec_004", date: "2025-01-25T16:20:00Z", symbol: "DOGE", coin_name: "Dogecoin", sentiment: "Mild_Bearish", price: 0.32, "1_hour_price_returns": -0.1, "24_hours_price_returns": -0.3, "7_days_price_returns": -2.1, "30_days_price_returns": -5.2, "60_days_price_returns": -8.5, "90_days_price_returns": -12.3, "180_days_price_returns": -15.8, "1_year_price_returns": -22.5 },
    { _id: "rec_005", date: "2025-01-24T11:00:00Z", symbol: "AVAX", coin_name: "Avalanche", sentiment: "Strong_Bullish", price: 38.75, "1_hour_price_returns": 1.5, "24_hours_price_returns": 3.5, "7_days_price_returns": 8.9, "30_days_price_returns": 22.4, "60_days_price_returns": 35.2, "90_days_price_returns": 42.8, "180_days_price_returns": 55.3, "1_year_price_returns": 95.2 },
    { _id: "rec_006", date: "2025-01-23T08:30:00Z", symbol: "BTC", coin_name: "Bitcoin", sentiment: "Mild_Bullish", price: 99800.00, "1_hour_price_returns": 0.3, "24_hours_price_returns": 0.7, "7_days_price_returns": 1.5, "30_days_price_returns": 4.8, "60_days_price_returns": 8.2, "90_days_price_returns": 12.5, "180_days_price_returns": 22.8, "1_year_price_returns": 38.5 },
    { _id: "rec_007", date: "2025-01-22T13:45:00Z", symbol: "LINK", coin_name: "Chainlink", sentiment: "Strong_Bullish", price: 22.80, "1_hour_price_returns": 0.9, "24_hours_price_returns": 1.9, "7_days_price_returns": 6.3, "30_days_price_returns": 18.6, "60_days_price_returns": 25.8, "90_days_price_returns": 32.5, "180_days_price_returns": 48.2, "1_year_price_returns": 78.5 },
    { _id: "rec_008", date: "2025-01-21T15:10:00Z", symbol: "SHIB", coin_name: "Shiba Inu", sentiment: "Strong_Bearish", price: 0.0000225, "1_hour_price_returns": -0.5, "24_hours_price_returns": -1.2, "7_days_price_returns": -4.5, "30_days_price_returns": -12.8, "60_days_price_returns": -18.5, "90_days_price_returns": -22.3, "180_days_price_returns": -28.5, "1_year_price_returns": -35.8 },
    { _id: "rec_009", date: "2025-01-20T10:00:00Z", symbol: "XRP", coin_name: "Ripple", sentiment: "Mild_Bullish", price: 2.45, "1_hour_price_returns": 0.4, "24_hours_price_returns": 1.5, "7_days_price_returns": 3.8, "30_days_price_returns": 9.2, "60_days_price_returns": 14.5, "90_days_price_returns": 18.2, "180_days_price_returns": 32.5, "1_year_price_returns": 55.8 },
    { _id: "rec_010", date: "2025-01-19T14:20:00Z", symbol: "ADA", coin_name: "Cardano", sentiment: "Mild_Bearish", price: 0.95, "1_hour_price_returns": -0.2, "24_hours_price_returns": -0.5, "7_days_price_returns": -1.8, "30_days_price_returns": -3.5, "60_days_price_returns": -5.2, "90_days_price_returns": -8.5, "180_days_price_returns": -12.8, "1_year_price_returns": -18.5 },
  ];

  // Hardcoded analytics
  const analytics = {
    average_roi: { "1_hour": 0.4, "24_hours": 0.83, "7_days": 2.52, "30_days": 6.99, "60_days": 10.47, "90_days": 12.77, "180_days": 21.04 },
    sentiment_analysis: {
      sentiment_breakdown: { Strong_Bullish: 4, Mild_Bullish: 3, Mild_Bearish: 2, Strong_Bearish: 1 }
    },
    unique_symbols: { symbols: ["BTC", "ETH", "SOL", "DOGE", "AVAX", "LINK", "SHIB", "XRP", "ADA"] }
  };

  // Filter recommendations
  const filteredRecs = allRecommendations.filter(rec => {
    if (selectedSymbol && rec.symbol !== selectedSymbol) return false;
    if (selectedSentiment && rec.sentiment !== selectedSentiment) return false;
    return true;
  });

  const getSentimentColor = (sentiment) => {
    if (sentiment?.includes("Bullish")) return "text-to-purple-400";
    if (sentiment?.includes("Bearish")) return "text-to-red-recomendations";
    return "text-to-purple-400";
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return typeof price === 'number' ? `$${price.toFixed(4)}` : price;
  };

  const formatNumberWithCommas = (number) => {
    if (number === undefined || number === null) return "-";
    if (isNaN(Number(number))) return "-";
    return Number(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const handleClearFilters = () => {
    setSelectedSymbol('');
    setSelectedSentiment('');
    setStartDate('2024-01-01');
    setEndDate('2025-01-31');
    setCurrentPage(0);
  };

  return (
    <div id="twitter-recommendations-top" className="bg-white rounded-xl border border-gray-200 overflow-x-auto text-to-purple">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-6 border-b border-gray-200">
        <h3 className="font-normal text-to-purple">
          Number of mentions of{" "}
          <span className="font-bold text-to-purple">{selectedSymbol || "all coins"}</span>
          {" during "}
          <span className="font-bold text-to-purple">
            {startDate && endDate ? `${formatDate(startDate)} to ${formatDate(endDate)}` : "all time"}
          </span>{" "}
          for{" "}
          <span className="font-bold text-to-purple">
            {selectedSentiment ? selectedSentiment.replace("_", " ") : "all"}
          </span>{" "}
          sentiment (
          <span className="font-bold text-to-purple">{filteredRecs.length}</span>)
        </h3>

        <div id="twitter-filters-section" className="flex flex-col gap-3 items-end">
          <div className="w-full md:w-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="flex gap-3 items-center min-w-max px-2 py-1">
              <div className="relative">
                <select
                  className="bg-[#c4c5e14d] border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-to-purple appearance-none"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                >
                  <option value="">All Coins</option>
                  {analytics.unique_symbols.symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-to-purple pointer-events-none">▾</span>
              </div>
              <div className="relative">
                <select
                  className="bg-[#c4c5e14d] border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-to-purple appearance-none"
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value)}
                >
                  <option value="">All Sentiments</option>
                  <option value="Strong_Bullish">Strong Bullish</option>
                  <option value="Mild_Bullish">Mild Bullish</option>
                  <option value="Strong_Bearish">Strong Bearish</option>
                  <option value="Mild_Bearish">Mild Bearish</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-to-purple pointer-events-none">▾</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="bg-transparent border border-gray-300 text-to-purple hover:bg-gray-100 px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >
                Clear
              </button>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="bg-[#c4c5e14d] border border-gray-300 rounded px-3 py-2 text-sm text-to-purple hover:bg-gray-100 flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                Advanced Filters
                <span className={`transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`}>▾</span>
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="w-full md:w-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex gap-3 items-center min-w-max px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-to-purple whitespace-nowrap">Start Date:</span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#c4c5e14d] border border-gray-300 rounded px-3 py-2 text-sm text-to-purple" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-to-purple whitespace-nowrap">End Date:</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#c4c5e14d] border border-gray-300 rounded px-3 py-2 text-sm text-to-purple" max={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Summary Table */}
          <div className="bg-[#f5f5f5] rounded-lg border border-gray-200 shadow-lg">
            <h4 className="text-lg font-semibold text-to-purple mb-4 p-4 pb-0">Performance Summary (Avg ROI)</h4>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4 pt-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#e8e8e8] text-to-purple">
                    <th className="p-2 text-left font-semibold">Metric</th>
                    <th className="p-2 text-center font-semibold">1H</th>
                    <th className="p-2 text-center font-semibold">24H</th>
                    <th className="p-2 text-center font-semibold">7D</th>
                    <th className="p-2 text-center font-semibold">30D</th>
                    <th className="p-2 text-center font-semibold">60D</th>
                    <th className="p-2 text-center font-semibold">90D</th>
                    <th className="p-2 text-center font-semibold">180D</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-100">
                    <td className="p-3 font-medium text-to-purple">Average Performance</td>
                    {Object.entries(analytics.average_roi).map(([timeframe, roi]) => (
                      <td key={timeframe} className={`p-2 text-center font-semibold ${roi > 0 ? "text-green-600" : roi < 0 ? "text-red-600" : "text-gray-600"}`}>
                        {roi !== null ? `${roi > 0 ? "+" : ""}${roi.toFixed(2)}%` : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sentiment Summary Table */}
          <div className="bg-[#f5f5f5] rounded-lg border border-gray-200 shadow-lg">
            <h4 className="text-lg font-semibold text-to-purple mb-4 p-4 pb-0">Sentiment Summary</h4>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4 pt-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#e8e8e8] text-to-purple">
                    <th className="p-2 text-left font-semibold">Metric</th>
                    <th className="p-2 text-center font-semibold">Strong Bullish</th>
                    <th className="p-2 text-center font-semibold">Mild Bullish</th>
                    <th className="p-2 text-center font-semibold">Mild Bearish</th>
                    <th className="p-2 text-center font-semibold">Strong Bearish</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-100">
                    <td className="p-3 font-medium text-to-purple">Sentiment Distribution</td>
                    <td className="p-3 text-center text-green-600 font-semibold">{analytics.sentiment_analysis.sentiment_breakdown.Strong_Bullish}</td>
                    <td className="p-3 text-center text-green-500 font-semibold">{analytics.sentiment_analysis.sentiment_breakdown.Mild_Bullish}</td>
                    <td className="p-3 text-center text-red-500 font-semibold">{analytics.sentiment_analysis.sentiment_breakdown.Mild_Bearish}</td>
                    <td className="p-3 text-center text-red-600 font-semibold">{analytics.sentiment_analysis.sentiment_breakdown.Strong_Bearish}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full text-sm" style={{ minWidth: '1200px' }}>
          <thead>
            <tr className="bg-[#e8e8e8] text-to-purple">
              <th className="p-2 text-left font-semibold sticky left-0 bg-[#e8e8e8] z-10" style={{ minWidth: '120px' }}>
                <span className="text-xs">Date UTC</span>
              </th>
              <th className="p-2 text-center font-semibold sticky left-[120px] bg-[#e8e8e8] z-10" style={{ minWidth: '100px' }}>
                <span className="text-xs">Coin</span>
              </th>
              <th className="p-2 text-center font-semibold" style={{ minWidth: '90px' }}><span className="text-xs">Sentiment</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '80px' }}><span className="text-xs">Initial</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">1H</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">24H</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">7D</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">30D</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">60D</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">90D</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">180D</span></th>
              <th className="p-2 text-left font-semibold" style={{ minWidth: '60px' }}><span className="text-xs">1Y</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecs.map((rec) => {
              const roiKeys = ["1_hour_price_returns", "24_hours_price_returns", "7_days_price_returns", "30_days_price_returns", "60_days_price_returns", "90_days_price_returns", "180_days_price_returns", "1_year_price_returns"];
              return (
                <tr key={rec._id} className="hover:bg-gray-100 group">
                  <td className="p-2 text-to-purple sticky left-0 bg-white group-hover:bg-gray-100 z-10" style={{ minWidth: '120px' }}>
                    <div className="text-xs">
                      {new Date(rec.date).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" })}
                      <br />
                      {new Date(rec.date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}
                    </div>
                  </td>
                  <td className="p-2 flex items-center gap-1 sticky left-[120px] bg-white group-hover:bg-gray-100 z-10" style={{ minWidth: '100px' }}>
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center text-xs font-bold text-white">
                      {rec.symbol?.charAt(0) || "?"}
                    </span>
                    <div>
                      <div className="font-semibold text-to-purple text-xs">{rec.symbol}</div>
                      <div className="text-xs text-to-purple-400 truncate" style={{ maxWidth: '60px' }}>{rec.coin_name}</div>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <span className={`inline-block text-xs font-semibold text-center ${getSentimentColor(rec.sentiment)}`}>
                      {rec.sentiment?.replace("_", " ") || "N/A"}
                    </span>
                  </td>
                  <td className="p-2 text-to-purple text-xs">{formatPrice(rec.price)}</td>
                  {roiKeys.map((key) => {
                    const roi = rec[key];
                    return (
                      <td key={key} className={`p-2 font-semibold text-xs ${roi > 0 ? "text-to-purple-400" : roi < 0 ? "text-to-red-recomendations" : "text-to-purple-400"}`}>
                        {roi !== null && roi !== undefined ? `${roi > 0 ? "+" : ""}${formatNumberWithCommas(roi)}%` : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
