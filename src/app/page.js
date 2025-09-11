"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import DragDropCards from "../components/DragDropCards";

// Top 5 mentioned coins data based on the image
const topMentionedCoins = [
  {
    rank: 1,
    symbol: "BTC",
    name: "Bitcoin",
    totalMentions: 12,
    totalInfluencers: 9,
    sentiment: "Mild_Bullish:6",
    icon: "/window.svg"
  },
  {
    rank: 2,
    symbol: "ETH",
    name: "Ethereum",
    totalMentions: 8,
    totalInfluencers: 8,
    sentiment: "Mild_Bullish:4",
    icon: "/next.svg"
  },
  {
    rank: 3,
    symbol: "LINK",
    name: "Chainlink",
    totalMentions: 5,
    totalInfluencers: 5,
    sentiment: "Mild_Bullish:5",
    icon: "/file.svg"
  },
  {
    rank: 4,
    symbol: "SOL",
    name: "Solana",
    totalMentions: 4,
    totalInfluencers: 4,
    sentiment: "Mild_Bullish:3",
    icon: "/globe.svg"
  },
  {
    rank: 5,
    symbol: "XRP",
    name: "XRP",
    totalMentions: 3,
    totalInfluencers: 3,
    sentiment: "Strong_Bullish:2",
    icon: "/window.svg"
  }
];

// Default fallback data for top 5 YouTube influencers  
const defaultTopInfluencers = [
  // YouTube Influencers
  {
    name: "CryptoKingdom",
    platform: "YouTube",
    score: 94,
    roi2025: {
      "24h": "+12.8%",
      "7d": "+24.1%",
      "30d": "+48.4%",
      "60d": "+72.7%",
      "90d": "+95.3%",
      "180d": "+128.9%"
    },
    avatar: "/window.svg"
  },
  {
    name: "BlockchainBeast",
    platform: "YouTube",
    score: 91,
    roi2025: {
      "24h": "+10.3%",
      "7d": "+19.7%",
      "30d": "+41.2%",
      "60d": "+65.5%",
      "90d": "+87.8%",
      "180d": "+114.3%"
    },
    avatar: "/next.svg"
  },
  {
    name: "CoinSensei",
    platform: "YouTube",
    score: 89,
    roi2025: {
      "24h": "+8.9%",
      "7d": "+17.4%",
      "30d": "+36.8%",
      "60d": "+58.2%",
      "90d": "+79.6%",
      "180d": "+102.4%"
    },
    avatar: "/file.svg"
  },
  {
    name: "DeFiDominator",
    platform: "YouTube",
    score: 87,
    roi2025: {
      "24h": "+7.6%",
      "7d": "+15.2%",
      "30d": "+32.1%",
      "60d": "+51.8%",
      "90d": "+71.4%",
      "180d": "+96.7%"
    },
    avatar: "/globe.svg"
  },
  {
    name: "AltcoinAlchemist",
    platform: "YouTube",
    score: 85,
    roi2025: {
      "24h": "+6.4%",
      "7d": "+13.8%",
      "30d": "+28.9%",
      "60d": "+46.3%",
      "90d": "+64.7%",
      "180d": "+87.2%"
    },
    avatar: "/window.svg"
  }
  // Only top 5 YouTube influencers needed for homepage
];


// Testimonials data
const testimonials = [
  {
    quote: "Finally-someone's holding influencers accountable. The Credibility Score is the first thing I check before I trade.",
    author: "Ravi S.",
    title: "Retail Investor"
  },
  {
    quote: "The leaderboard gave us visibility into who actually adds alpha versus just making noise.",
    author: "Claire M.",
    title: "Portfolio Manager, Crypto Fund"
  },
  {
    quote: "For compliance, this tool is gold. We can document every claim and link it to actual outcomes.",
    author: "Ahmed K.",
    title: "Head of Risk, Exchange"
  },
  {
    quote: "This feels like Moody's for the influencer age.",
    author: "Early Beta User",
    title: ""
  },
  {
    quote: "Before MyCryptoMonitor, I was guessing who to trust. Now I know which influencers actually deliver results.",
    author: "Maya L.",
    title: "Retail Trader"
  },
  {
    quote: "The alerts saved me from following hype calls that would have lost money. Worth every dollar.",
    author: "Daniel P.",
    title: "Part-time Investor"
  },
  {
    quote: "Finally a quant-style approach to influencer credibility. It's like Bloomberg meets social media.",
    author: "Tom K.",
    title: "Market Analyst"
  },
  {
    quote: "We track 50+ influencers, and this dashboard cuts through the noise in seconds.",
    author: "Elena V.",
    title: "Proprietary Trader"
  },
  {
    quote: "This feels like the Moody's of influence-finally bringing accountability to digital finance.",
    author: "Partner Risk Advisory",
    title: "A7pire Consulting"
  }
];

// Function to generate trending data using dynamic YouTube influencers
const getTrendingData = (influencers) => {
  const youtubeInfluencers = influencers.length > 0 ? influencers : defaultTopInfluencers.slice(0, 5);

  // Static telegram data for now (could be replaced with Telegram API later)
  const telegramInfluencers = [
    {
      name: "CryptoWhispers", platform: "Telegram", score: 96,
      roi2025: { "24h": "+15.2%", "7d": "+28.6%", "30d": "+56.3%", "180d": "+148.7%" },
      avatar: "/file.svg"
    },
    {
      name: "TokenTornado", platform: "Telegram", score: 93,
      roi2025: { "24h": "+13.1%", "7d": "+25.4%", "30d": "+51.8%", "180d": "+137.9%" },
      avatar: "/next.svg"
    }
  ];

  return {
    youtube: {
      "24hours": [
        { coin: "BTC", influencer: youtubeInfluencers[0], roi: youtubeInfluencers[0]?.roi2025?.["24h"] || "+12.8%", recommendation: "BUY" },
        { coin: "ETH", influencer: youtubeInfluencers[3] || youtubeInfluencers[0], roi: youtubeInfluencers[3]?.roi2025?.["24h"] || "+7.6%", recommendation: "HOLD" },
        { coin: "SOL", influencer: youtubeInfluencers[0], roi: "+12.4%", recommendation: "BUY" },
        { coin: "ADA", influencer: youtubeInfluencers[3] || youtubeInfluencers[0], roi: "+9.8%", recommendation: "BUY" },
        { coin: "DOT", influencer: youtubeInfluencers[0], roi: "+7.2%", recommendation: "HOLD" }
      ],
      "7days": [
        { coin: "AVAX", influencer: youtubeInfluencers[0], roi: youtubeInfluencers[0]?.roi2025?.["7d"] || "+24.1%", recommendation: "STRONG BUY" },
        { coin: "MATIC", influencer: youtubeInfluencers[3] || youtubeInfluencers[0], roi: youtubeInfluencers[3]?.roi2025?.["7d"] || "+15.2%", recommendation: "BUY" },
        { coin: "LINK", influencer: youtubeInfluencers[0], roi: "+18.3%", recommendation: "BUY" },
        { coin: "UNI", influencer: youtubeInfluencers[3] || youtubeInfluencers[0], roi: "+16.7%", recommendation: "HOLD" },
        { coin: "ATOM", influencer: youtubeInfluencers[0], roi: "+14.2%", recommendation: "BUY" }
      ]
    },
    telegram: {
      "24hours": [
        { coin: "BTC", influencer: telegramInfluencers[0], roi: telegramInfluencers[0].roi2025["24h"], recommendation: "STRONG BUY" },
        { coin: "ETH", influencer: telegramInfluencers[1], roi: telegramInfluencers[1].roi2025["24h"], recommendation: "BUY" },
        { coin: "SOL", influencer: telegramInfluencers[0], roi: "+15.6%", recommendation: "BUY" },
        { coin: "ADA", influencer: telegramInfluencers[1], roi: "+11.4%", recommendation: "HOLD" },
        { coin: "DOT", influencer: telegramInfluencers[0], roi: "+8.9%", recommendation: "BUY" }
      ],
      "7days": [
        { coin: "AVAX", influencer: telegramInfluencers[0], roi: telegramInfluencers[0].roi2025["7d"], recommendation: "STRONG BUY" },
        { coin: "MATIC", influencer: telegramInfluencers[1], roi: telegramInfluencers[1].roi2025["7d"], recommendation: "BUY" },
        { coin: "LINK", influencer: telegramInfluencers[0], roi: "+21.7%", recommendation: "STRONG BUY" },
        { coin: "UNI", influencer: telegramInfluencers[1], roi: "+19.3%", recommendation: "BUY" },
        { coin: "ATOM", influencer: telegramInfluencers[0], roi: "+17.8%", recommendation: "BUY" }
      ]
    }
  };
};




const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  }),
  hover: {
    y: -10,
    transition: { duration: 0.3 },
  },
};

const floatVariants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  glow: {
    boxShadow: [
      "0 0 5px rgba(139, 92, 246, 0.5)",
      "0 0 20px rgba(139, 92, 246, 0.8)",
      "0 0 5px rgba(139, 92, 246, 0.5)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    }
  }
};

// One-by-One Scrolling Three-Card Testimonial Carousel Component
const TestimonialsCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start from 1 to show center focus
  const [isHovered, setIsHovered] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-scroll functionality - 5 seconds per card
  useEffect(() => {
    if (isHovered) return; // Pause on hover

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  // Generate placeholder profile images with different colors
  const getProfileColor = (index) => {
    const colors = [
      'from-purple-400 to-purple-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-orange-400 to-orange-600'
    ];
    return colors[index % colors.length];
  };

  // Get three visible cards (previous, current, next)
  const getVisibleCards = () => {
    const cards = [];
    const totalCards = testimonials.length;

    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + totalCards) % totalCards;
      cards.push({
        testimonial: testimonials[index],
        position: i,
        index: index,
        isFocused: i === 0 // Center card is focused
      });
    }

    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Three Cards with Focus Effect - Continuous One-by-One Scroll */}
      <div className="mx-4 md:mx-16 relative h-80 flex items-center justify-center px-4 md:px-0">
        <div className="flex items-center justify-center space-x-2 md:space-x-6 w-full">
          {visibleCards.map((card, index) => {
            const { testimonial, position, isFocused } = card;

            return (
              <motion.div
                key={card.index}
                animate={{
                  scale: isFocused ? 1.1 : 0.9,
                  opacity: isFocused ? 1 : 0.6,
                  filter: `brightness(${isFocused ? 1 : 0.7})`,
                  zIndex: isFocused ? 10 : 5
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className={`${isFocused ? 'w-full max-w-sm sm:w-72' : 'w-64 sm:w-72 hover:scale-95 hidden md:block'}`}
              >
                {/* Dark Themed Card matching homepage colors */}
                <div className={`rounded-3xl p-4 sm:p-6 shadow-xl border transition-all duration-500 h-full flex flex-col ${isFocused
                  ? 'bg-gradient-to-br from-[#2d2555] to-[#1f1b35] shadow-[0_12px_40px_rgb(139,92,246,0.3)] border-purple-400/30'
                  : 'bg-gradient-to-br from-[#1a1731] to-[#0f0c1d] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-purple-500/10'
                  }`}>
                  {/* Profile Image - Circular with Gradient */}
                  <motion.div
                    className={`mx-auto mb-4`}
                    animate={{
                      width: isFocused ? 80 : 64,
                      height: isFocused ? 80 : 64
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${getProfileColor(card.index)} flex items-center justify-center shadow-lg`}>
                      <span className={`font-bold text-white ${isFocused ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  </motion.div>

                  {/* Testimonial Quote */}
                  <div className="text-center mb-4 flex-grow">
                    <p className={`leading-relaxed font-medium italic ${isFocused
                      ? 'text-gray-100 text-base sm:text-lg'
                      : 'text-gray-300 text-sm sm:text-base'
                      }`}>
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="text-center mt-auto">
                    <div className={`font-bold mb-1 ${isFocused
                      ? 'text-purple-300 text-base sm:text-lg'
                      : 'text-purple-400/70 text-sm sm:text-base'
                      }`}>
                      {testimonial.author}
                    </div>
                    {testimonial.title && (
                      <div className={`text-xs sm:text-sm font-medium ${isFocused
                        ? 'text-gray-400'
                        : 'text-gray-500'
                        }`}>
                        {testimonial.title}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>


    </div>
  );
};


// Professional Trending Table Component
const ProfessionalTrendingTable = ({ title, data, isLocked = false }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      {isLocked && !isRegistered && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg rounded-2xl flex flex-col items-center justify-center z-20 p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
              </svg>
            </div>
            {/* <h3 className="text-white font-bold text-xl mb-2">Premium Analytics</h3> */}
            <p className="text-gray-300 text-base mb-6 max-w-sm mx-auto">
              Get access to detailed influencer performance data, ROI tracking across multiple time periods, and actionable investment recommendations.
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-purple-500/20">
              <div className="text-purple-300 text-sm font-semibold mb-2">What you&apos;ll unlock:</div>
              <ul className="text-gray-300 text-sm space-y-1 text-left">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time ROI tracking (24h, 7d, 30d, 60d+)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Credibility scores & win rates
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Buy/sell/hold recommendations
                </li>
              </ul>
            </div>
            <Link href="/login">
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200 w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
            </Link>
          </div>
        </div>
      )}

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Analyst</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">ROI</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-white">{item.coin}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <Image src={item.influencer.avatar} alt={item.influencer.name} width={20} height={20} className="rounded-full" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.influencer.name}</div>
                      <div className="text-xs text-gray-400">{item.influencer.platform}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30">
                    {item.influencer.score}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">24h</div>
                      <div className="text-gray-500 font-bold">{item.influencer.roi2025["24h"]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">7d</div>
                      <div className="text-gray-500 font-bold">{item.influencer.roi2025["7d"]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">30d</div>
                      <div className="text-gray-500 font-bold">{item.influencer.roi2025["30d"]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs">180d</div>
                      <div className="text-gray-500 font-bold">{item.influencer.roi2025["180d"]}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.recommendation === 'STRONG BUY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.recommendation === 'BUY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {item.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // This would come from auth context
  const [shouldScroll, setShouldScroll] = useState(false);
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch top 5 YouTube influencers from API
  useEffect(() => {
    async function fetchTopInfluencers() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          sentiment: "all",
          timeframe: "1_hour",
          type: "overall",
          year: "all",
          quarter: "all"
        });

        const res = await fetch(`/api/youtube-data?${params.toString()}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.results)) {
          // Get top 5 influencers based on rank, ensure only 5 results
          const top5 = data.results
            .filter(inf => inf.rank && inf.rank <= 5)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 5) // Ensure exactly 5 results
            .map((inf) => ({
              name: inf.influencer_name,
              platform: "YouTube",
              score: Math.round(inf.ai_overall_score || 0), // MCM Score
              rank: inf.rank,
              roi2025: {
                "24h": `+${(inf.prob_weighted_returns || 0).toFixed(1)}%`,
                "7d": `+${((inf.prob_weighted_returns || 0) * 1.8).toFixed(1)}%`,
                "30d": `+${((inf.prob_weighted_returns || 0) * 3.2).toFixed(1)}%`,
                "60d": `+${((inf.prob_weighted_returns || 0) * 5.1).toFixed(1)}%`,
                "90d": `+${((inf.prob_weighted_returns || 0) * 7.3).toFixed(1)}%`,
                "180d": `+${((inf.prob_weighted_returns || 0) * 12.1).toFixed(1)}%`
              },
              avatar: inf.channel_thumbnails?.high?.url || "/window.svg",
              subs: inf.subs,
              win_percentage: inf.win_percentage
            }));

          console.log(`Fetched ${top5.length} top influencers:`, top5.map(inf => `${inf.name} (Rank: ${inf.rank}, MCM: ${inf.score})`));
          setTopInfluencers(top5);
        } else {
          console.log("API failed or no results, using default data");
          // Fallback to default data if API fails
          setTopInfluencers(defaultTopInfluencers.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch top influencers:", error);
        // Fallback to default data if API fails
        setTopInfluencers(defaultTopInfluencers.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }

    fetchTopInfluencers();
  }, []);

  // Removed auto-scroll functionality that was interfering with user interaction

  // Get dynamic trending data
  const trendingData = getTrendingData(topInfluencers);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c1d] via-[#19162b] to-[#1a1731] text-white font-sans pb-16 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-8 pb-4 px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start min-h-[60vh] lg:min-h-[50vh]">
          <div className="space-y-8 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI Powered Crypto Influencers Analytics Platform
                </span>
              </h1>
            </motion.div>

            <motion.div
              className="text-base text-purple-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-green-400">✓</span>
                <span>Live across</span>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>•</span>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span>•</span>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span className="text-gray-400 text-sm">(Coming Soon)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                Data Granularity: 1h, 24h, 7days, 30days, 60days, 90days, 180days, 1year
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                ROI Win/Loss Ranking & Other metrics
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                2022 to most current date data
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                17,000 coins covered
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                Covering moonshots to normal recommendations
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Daily analysis update (UTC TIME)
              </div>
            </motion.div>

          </div>

          {/* Hero Visual - TOP CRYPTO INFLUENCERS BY PLATFORM */}
          <div className="flex flex-col justify-start mt-8 lg:mt-0 hero-visual">
            {/* YouTube Influencers Section */}
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-1">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  CRYPTO INFLUENCERS
                </span>
              </h2>
              <p className="text-purple-300 text-lg font-semibold flex items-center justify-center gap-3">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </span>
                •
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0088cc">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </span>
                •
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DA1F2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </span>
              </p>
              {/* <p className="text-gray-300 text-sm mt-1">
                Crypto’s Top 5 Mentions — 24H!
              </p> */}
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <motion.div
                className="relative w-full max-w-sm mx-auto mb-12"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  type: "tween"
                }}
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  contain: 'layout style paint',
                  willChange: 'transform',
                }}
              >
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div
                  className="relative z-10"
                  style={{
                    transform: 'translateZ(0)',
                    contain: 'layout style paint',
                  }}
                >
                  <DragDropCards cards={[
                    // First 5: YouTube (API-driven)
                    ...topInfluencers,
                    // Next 5: Telegram (hardcoded)
                    {
                      name: "CryptoWhispers",
                      platform: "Telegram",
                      score: 96,
                      rank: 1,
                      roi2025: { "24h": "+15.2%", "7d": "+28.6%", "30d": "+56.3%", "180d": "+148.7%" },
                      avatar: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "TokenTornado",
                      platform: "Telegram",
                      score: 93,
                      rank: 2,
                      roi2025: { "24h": "+13.1%", "7d": "+25.4%", "30d": "+51.8%", "180d": "+137.9%" },
                      avatar: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "DiamondSignals",
                      platform: "Telegram",
                      score: 90,
                      rank: 3,
                      roi2025: { "24h": "+11.7%", "7d": "+22.8%", "30d": "+46.5%", "180d": "+124.6%" },
                      avatar: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "MoonMasterPro",
                      platform: "Telegram",
                      score: 88,
                      rank: 4,
                      roi2025: { "24h": "+10.4%", "7d": "+20.1%", "30d": "+42.8%", "180d": "+115.8%" },
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "GemHunterElite",
                      platform: "Telegram",
                      score: 86,
                      rank: 5,
                      roi2025: { "24h": "+9.2%", "7d": "+18.4%", "30d": "+37.9%", "180d": "+104.2%" },
                      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                    },
                    // Last 5: Twitter (hardcoded)
                    {
                      name: "CryptoVortex",
                      platform: "Twitter",
                      score: 92,
                      rank: 1,
                      roi2025: { "24h": "+12.5%", "7d": "+23.9%", "30d": "+48.7%", "180d": "+129.4%" },
                      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "BlockBullionaire",
                      platform: "Twitter",
                      score: 89,
                      rank: 2,
                      roi2025: { "24h": "+10.8%", "7d": "+21.3%", "30d": "+43.6%", "180d": "+117.5%" },
                      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "DeFiDynamo",
                      platform: "Twitter",
                      score: 87,
                      rank: 3,
                      roi2025: { "24h": "+9.6%", "7d": "+18.7%", "30d": "+38.4%", "180d": "+105.2%" },
                      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "SatoshiSage",
                      platform: "Twitter",
                      score: 85,
                      rank: 4,
                      roi2025: { "24h": "+8.1%", "7d": "+16.4%", "30d": "+33.8%", "180d": "+92.4%" },
                      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
                    },
                    {
                      name: "AltcoinAce",
                      platform: "Twitter",
                      score: 83,
                      rank: 5,
                      roi2025: { "24h": "+7.3%", "7d": "+14.9%", "30d": "+30.2%", "180d": "+83.7%" },
                      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face"
                    }
                  ]} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* What's Trending - YouTube and Telegram Tables */}
      <section id="trending" className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              What&apos;s Trending
            </span>
          </h2>
          <h2 className="text-white-300 text-2xl font-bold mb-3">Top 5 Mentioned Coins in 24H</h2>
        </motion.div>

        {/* Display Purpose Text */}
        <p className="text-center text-gray-400 text-sm italic mb-4 mt-1">
          The coins are listed for display purpose
        </p>

        {/* Animated Text Container */}
        <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl">
          {/* Continuous Left-to-Right Scrolling Text */}
          <div className="absolute inset-0 flex items-center">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{
                x: ["-100vw", "100vw"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Repeat the text multiple times for continuous scroll */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-8 mx-8">
                  {[
                    {
                      _id: "685b9c8bb1df39ab7fca57c0",
                      source_id: "bitcoin",
                      symbol: "btc",
                      name: "bitcoin",
                      image_large: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca6502",
                      source_id: "ethereum",
                      symbol: "eth",
                      name: "ethereum",
                      image_large: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8a1b",
                      source_id: "tether",
                      symbol: "usdt",
                      name: "tether",
                      image_large: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca81ab",
                      source_id: "ripple",
                      symbol: "xrp",
                      name: "xrp",
                      image_large: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca5763",
                      source_id: "binancecoin",
                      symbol: "bnb",
                      name: "bnb",
                      image_large: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8590",
                      source_id: "solana",
                      symbol: "sol",
                      name: "solana",
                      image_large: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8d8e",
                      source_id: "usd-coin",
                      symbol: "usdc",
                      name: "usdc",
                      image_large: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8c2b",
                      source_id: "tron",
                      symbol: "trx",
                      name: "tron",
                      image_large: "https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca6227",
                      source_id: "dogecoin",
                      symbol: "doge",
                      name: "dogecoin",
                      image_large: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8746",
                      source_id: "staked-ether",
                      symbol: "steth",
                      name: "lido staked ether",
                      image_large: "https://coin-images.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca5b51",
                      source_id: "cardano",
                      symbol: "ada",
                      name: "cardano",
                      image_large: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png?1696502090",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca90cb",
                      source_id: "wrapped-bitcoin",
                      symbol: "wbtc",
                      name: "wrapped bitcoin",
                      image_large: "https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca6c8c",
                      source_id: "hyperliquid",
                      symbol: "hype",
                      name: "hyperliquid",
                      image_large: "https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg?1729431300",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca91cf",
                      source_id: "wrapped-steth",
                      symbol: "wsteth",
                      name: "wrapped steth",
                      image_large: "https://coin-images.coingecko.com/coins/images/18834/large/wstETH.png?1696518295",
                    },
                    {
                      _id: "685b9c8bb1df39ab7fca8860",
                      source_id: "sui",
                      symbol: "sui",
                      name: "sui",
                      image_large: "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
                    },
                  ].map((coin) => (
                    <div
                      key={coin._id}
                      className="flex items-center mx-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white/30 flex items-center justify-center">
                        <img
                          src={coin.image_large}
                          alt={coin.name}
                          className="w-12 h-12 rounded-full"
                          onError={(e) => {
                            console.log('Image failed to load:', coin.name, coin.image_large);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-white font-bold text-xs">${coin.symbol.toUpperCase()}</span>`;
                          }}
                          onLoad={() => console.log('Image loaded:', coin.name)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlay Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-purple-900/60 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-purple-900/60 to-transparent"></div>
        </div>

        {/* Influencer Flash News Text */}
        <h2 className="text-center text-white text-2xl font-bold mb-3 mt-4">
          Influencer Flash News Update
        </h2>

        {/* Influencer News Scroller Container */}
        <div className="relative h-24 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl mb-4">
          {/* Continuous Left-to-Right Scrolling News */}
          <div className="absolute inset-0 flex items-center">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{
                x: ["-100vw", "100vw"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Repeat the news multiple times for continuous scroll */}
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center space-x-12 mx-12">
                  {[
                    {
                      influencer: "Crypto Lifter",
                      coin: "XRP",
                      sentiment: "Mild Bullish → Strong Bullish",
                      time: "2 mins ago"
                    },
                    {
                      influencer: "Crypto Banter Plus",
                      coin: "BNB",
                      sentiment: "Mild Bullish → Strong Bullish",
                      time: "5 mins ago"
                    },
                    {
                      influencer: "Crypto Mobi",
                      coin: "SOL",
                      sentiment: "Mild Bullish → Strong Bullish",
                      time: "8 mins ago"
                    }
                  ].map((news, newsIndex) => (
                    <div
                      key={newsIndex}
                      className="flex items-center space-x-4 bg-gradient-to-r from-purple-800/20 to-blue-800/20 px-6 py-2 rounded-xl border border-purple-400/30"
                    >
                      <span className="text-purple-400 font-bold text-sm">
                        📈 {news.influencer}
                      </span>
                      <span className="text-white font-semibold">
                        {news.coin}
                      </span>
                      <span className="text-blue-300 text-sm">
                        {news.sentiment}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {news.time}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlay Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-purple-900/60 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-900/60 to-transparent"></div>
        </div>

        {/* Top Mentioned Coins - Redesigned UI */}
        <div className="space-y-6 mt-4">
          {/* Top 3 Coins (3rd, 4th, 5th) - Horizontal Row with Drag & Drop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-white mb-2">Preview Available Data</h3>
              <p className="text-gray-300 text-lg">Get full insights with your free trial</p>
            </div>

            {/* Static Cards Row - No Scrolling */}
            {/* Desktop: Static Cards, Mobile: Continuous Scrolling */}
            <div className="relative w-full">
              {/* Desktop View - Static Cards */}
              <div className="hidden md:flex items-center justify-center gap-8 max-w-6xl mx-auto">
                {topMentionedCoins.slice(2, 5).map((coin, index) => (
                  <motion.div
                    key={`desktop-${coin.symbol}`}
                    className="relative group flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                    whileHover={{
                      scale: 1.05,
                      y: -5
                    }}
                  >
                    {/* Desktop Card */}
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 w-72 h-80 overflow-hidden">
                      {/* Blurred Background Content */}
                      <div className="absolute inset-0 p-6 filter blur-sm opacity-30">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">#{coin.rank}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-2xl mb-1">{coin.symbol}</div>
                            <div className="text-gray-300 text-sm">{coin.name}</div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 text-center w-full">
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="text-gray-300 text-xs">Total Mentions</div>
                              <div className="text-white font-bold text-lg">{coin.totalMentions}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="text-gray-300 text-xs">Influencers</div>
                              <div className="text-white font-bold text-lg">{coin.totalInfluencers}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                              <div className="text-gray-300 text-xs">Sentiment</div>
                              <div className="text-green-400 font-bold text-sm">{coin.sentiment}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rank Number - Top Left */}
                      <div className="absolute top-4 left-4 bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full px-2 py-1 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">Rank {coin.rank}</span>
                      </div>

                      {/* Lock Icon - Top Right */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                        </svg>
                      </div>

                      {/* Clear Foreground Content */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-8 pb-6">
                        {/* Coin Icon Circle */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full flex items-center justify-center mb-3 shadow-2xl">
                          <span className="text-white font-bold text-2xl">
                            {coin.symbol === 'LINK' ? '🔗' : coin.symbol === 'SOL' ? '☀️' : coin.symbol === 'XRP' ? '💰' : '₿'}
                          </span>
                        </div>

                        {/* Coin Name */}
                        <div className="text-center mb-4">
                          <div className="text-white font-bold text-xl mb-1">{coin.name}</div>
                        </div>

                        {/* Unlock Full Data Section */}
                        <div className="text-center mb-4">
                          <div className="text-purple-300 text-sm font-semibold mb-2">Unlock Full Data:</div>
                          <div className="space-y-1 text-gray-300 text-xs">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-green-400">✓</span> Total Number of Mentions
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-green-400">✓</span> Total Number of Influencers
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-green-400">✓</span> Sentiment Majority Analysis
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link href="/login">
                          <motion.button
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Start Free Trial
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile View - Continuous Scrolling with Drag */}
              <div className="md:hidden relative overflow-hidden w-full">
                <motion.div
                  className="flex items-center gap-4"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2,
                  }}
                >
                  {topMentionedCoins.slice(2, 5).map((coin, index) => (
                    <motion.div
                      key={`mobile-${coin.symbol}-${index}`}
                      className="relative group flex-shrink-0 cursor-grab active:cursor-grabbing"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
                      drag
                      dragConstraints={{
                        top: -50,
                        left: -50,
                        right: 50,
                        bottom: 50,
                      }}
                      whileDrag={{
                        scale: 1.1,
                        rotate: 5,
                        zIndex: 100,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -5
                      }}
                    >
                      {/* Card Background with Blur Effect */}
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-4 w-64 h-80 overflow-hidden">
                        {/* Blurred Background Content */}
                        <div className="absolute inset-0 p-6 filter blur-sm opacity-30">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xl">#{coin.rank}</span>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-bold text-2xl mb-1">{coin.symbol}</div>
                              <div className="text-gray-300 text-sm">{coin.name}</div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 text-center w-full">
                              <div className="bg-white/10 rounded-lg p-3">
                                <div className="text-gray-300 text-xs">Total Mentions</div>
                                <div className="text-white font-bold text-lg">{coin.totalMentions}</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-3">
                                <div className="text-gray-300 text-xs">Influencers</div>
                                <div className="text-white font-bold text-lg">{coin.totalInfluencers}</div>
                              </div>
                              <div className="bg-white/10 rounded-lg p-3">
                                <div className="text-gray-300 text-xs">Sentiment</div>
                                <div className="text-green-400 font-bold text-sm">{coin.sentiment}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rank Number - Top Left */}
                        <div className="absolute top-4 left-4 bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full px-2 py-1 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">Rank {coin.rank}</span>
                        </div>

                        {/* Clear Foreground Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-8 pb-6">
                          {/* Coin Icon Circle */}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full flex items-center justify-center mb-3 shadow-2xl">
                            <span className="text-white font-bold text-2xl">
                              {coin.symbol === 'LINK' ? '🔗' : coin.symbol === 'SOL' ? '☀️' : coin.symbol === 'XRP' ? '💰' : '₿'}
                            </span>
                          </div>

                          {/* Coin Name */}
                          <div className="text-center mb-4">
                            <div className="text-white font-bold text-xl mb-1">{coin.name}</div>
                          </div>

                          {/* Unlock Full Data Section */}
                          <div className="text-center mb-4">
                            <div className="text-purple-300 text-sm font-semibold mb-2">Unlock Full Data:</div>
                            <div className="space-y-1 text-gray-300 text-xs">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-green-400">✓</span> Total Number of Mentions
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-green-400">✓</span> Total Number of Influencers
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-green-400">✓</span> Sentiment Majority Analysis
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Link href="/login">
                            <motion.button
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Start Free Trial
                            </motion.button>
                          </Link>
                        </div>

                        {/* Lock Icon */}
                        <div className="absolute top-4 right-4 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                          </svg>
                        </div>

                        {/* Drag Indicator */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Top 2 Coins - Animated Text Box */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Top 5 Coins mentioned in 24H</h3>
            </div> */}

            {/* Animated Text Container */}
            {/* <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center">
                <motion.div
                  className="flex whitespace-nowrap"
                  animate={{
                    x: ["-100vw", "100vw"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-8 mx-8">
                      <span className="text-white text-xl font-bold">
                        🏆 To View Bitcoin and Ethereum 🏆
                      </span>
                      <Link href="/login">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-xl font-bold text-white cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all">
                          🚀 Start Free Trial
                        </span>
                      </Link>
                      <span className="text-purple-300 text-lg">
                        • • •
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-purple-900/60 to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-purple-900/60 to-transparent"></div>
            </div> */}
          </motion.div>
        </div>

      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-4">Real feedback from traders using our platform</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        <TestimonialsCarousel testimonials={testimonials} />
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="rounded-3xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Track Crypto Influencers?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-lg">
            Join thousands of traders who make informed decisions based on influencer performance data
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/login">
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-10 py-5 rounded-xl font-bold text-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </motion.button>
            </Link>

            <Link href="/influencers">
              <motion.button
                className="bg-transparent border-2 border-purple-500/50 px-10 py-5 rounded-xl font-bold text-xl hover:bg-purple-500/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Influencers
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 pt-8 border-t border-purple-500/20 text-center text-gray-500 text-sm">
        <p>© 2025 MCM. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}