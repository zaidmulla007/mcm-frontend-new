"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import CountUp from "react-countup";
import Link from "next/link";
import { useState, useEffect } from "react";

const stats = [
  { label: "Influencers Tracked", value: 1245, icon: "👥" },
  { label: "Crypto Picks Analyzed", value: 8320, icon: "📊" },
  { label: "Avg ROI", value: 14.2, suffix: "%", icon: "📈" },
  { label: "Videos Processed", value: 19500, icon: "🎬" },
  { label: "Time Span", value: "2019–2025", isString: true, icon: "📅" },
];

const features = [
  { title: "Influencer Profiles", icon: "/file.svg", description: "Detailed analytics and performance metrics" },
  { title: "ROI Tracking", icon: "/window.svg", description: "Real-time return on investment calculations" },
  { title: "Leaderboard", icon: "/globe.svg", description: "Top performers ranked by accuracy" },
  { title: "Crypto Pages", icon: "/next.svg", description: "Comprehensive coin analysis" },
];

const trendingInfluencers = [
  {
    name: "CryptoKing",
    avatar: "/window.svg",
    recentPick: { coin: "ETH", date: "2024-06-01" },
    roi: { "7D": "8.2%", "30D": "15.1%", "90D": "32.4%" },
    winRate: "67%",
    accuracy: 87,
  },
  {
    name: "BlockQueen",
    avatar: "/globe.svg",
    recentPick: { coin: "BTC", date: "2024-06-02" },
    roi: { "7D": "5.7%", "30D": "12.3%", "90D": "28.9%" },
    winRate: "72%",
    accuracy: 92,
  },
];

const featuredCryptos = [
  {
    coin: "ETH",
    mentions: 120,
    roi: "18.4%",
    price: "$3,421.75",
    change: "+2.4%",
  },
  {
    coin: "BTC",
    mentions: 98,
    roi: "15.2%",
    price: "$68,432.10",
    change: "+1.2%",
  },
  {
    coin: "SOL",
    mentions: 75,
    roi: "22.1%",
    price: "$142.56",
    change: "+5.7%",
  },
];

// Different channels for each time period
const channelsByPeriod = {
  '1hour': [
    { name: 'Alex Thompson', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Sarah Chen', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Michael Ross', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '24hours': [
    { name: 'Emma Wilson', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'David Kim', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Lisa Garcia', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '7days': [
    { name: 'James Miller', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Rachel Davis', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Tom Anderson', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '30days': [
    { name: 'Anna Brown', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Ryan Clark', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Maya Patel', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '60days': [
    { name: 'Chris Johnson', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Sofia Rodriguez', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Daniel Lee', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '90days': [
    { name: 'Jessica Moore', image: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Kevin Wu', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Olivia Martin', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '180days': [
    { name: 'Brandon Taylor', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Chloe Adams', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Nathan White', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face', url: '#' }
  ],
  '1year': [
    { name: 'Grace Liu', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Marcus Green', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face', url: '#' },
    { name: 'Zoe Parker', image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=50&h=50&fit=crop&crop=face', url: '#' }
  ]
};

const timePeriods = [
  { id: '1hour', title: '1 Hour', color: 'from-purple-500 to-purple-700' },
  { id: '24hours', title: '24 Hours', color: 'from-blue-500 to-blue-700' },
  { id: '7days', title: '7 Days', color: 'from-green-500 to-green-700' },
  { id: '30days', title: '30 Days', color: 'from-yellow-500 to-yellow-700' },
  { id: '60days', title: '60 Days', color: 'from-orange-500 to-orange-700' },
  { id: '90days', title: '90 Days', color: 'from-red-500 to-red-700' },
  { id: '180days', title: '180 Days', color: 'from-pink-500 to-pink-700' },
  { id: '1year', title: '1 Year', color: 'from-indigo-500 to-indigo-700' },
];

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

// Enhanced Tree component for each time period
const TimePeriodTree = ({ period, channels, index }) => {
  return (
    <motion.div 
      className="flex flex-col items-center relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Time Period Header */}
      <motion.div 
        className={`bg-gradient-to-r ${period.color} text-white px-10 py-5 rounded-xl font-bold text-xl shadow-xl mb-12 z-10`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {period.title}
      </motion.div>
      
      {/* Vertical line from header to horizontal line */}
      <motion.div 
        className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1.5 h-20 bg-gradient-to-b from-purple-500 to-transparent"
        initial={{ height: 0 }}
        whileInView={{ height: "5rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
      ></motion.div>
      
      {/* Horizontal line */}
      <motion.div 
        className="absolute top-44 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
      ></motion.div>
      
      {/* Channels container */}
      <div className="relative w-full mt-28 flex justify-between px-4">
        {channels.map((channel, idx) => {
          // Calculate position for each channel (left, center, right)
          const position = idx === 0 ? 'left-0' : idx === 1 ? 'left-1/2 transform -translate-x-1/2' : 'right-0';
          
          return (
            <div key={idx} className={`flex flex-col items-center absolute ${position} w-32`}>
              {/* Vertical line to channel */}
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1.5 h-16 bg-gradient-to-b from-purple-500 to-transparent"
                initial={{ height: 0 }}
                whileInView={{ height: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 + idx * 0.1 }}
              ></motion.div>
              
              {/* Channel */}
              <motion.a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center mt-16"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.4 + idx * 0.1 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full shadow-xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-blue-900/50"
                  whileHover={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.7)" }}
                >
                  <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
                </motion.div>
                <motion.span 
                  className="text-base mt-4 text-center text-gray-300 w-full break-words font-medium"
                  whileHover={{ color: "#c4b5fd" }}
                >
                  {channel.name}
                </motion.span>
              </motion.a>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  // Group time periods into three groups
  const timePeriodGroups = [
    timePeriods.slice(0, 3), // 1 Hour, 24 Hours, 7 Days
    timePeriods.slice(3, 6), // 30 Days, 60 Days, 90 Days
    timePeriods.slice(6, 8)  // 180 Days, 1 Year
  ];
  
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
      <section className="max-w-7xl mx-auto pt-20 pb-16 px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Are Crypto Influencers
                </span>
                <br />
                <span className="text-white">Making You Money?</span>
              </h1>
            </motion.div>
            
            <motion.p
              className="text-lg text-gray-300 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover the real impact of crypto influencers. Track their picks, analyze ROI, and simulate your own portfolio based on their recommendations.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/influencers">
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={glowVariants}
                  animate="glow"
                >
                  Explore Influencers
                  <span>→</span>
                </motion.button>
              </Link>
              
              <div className="relative inline-block">
                <button
                  disabled
                  className="bg-[#232042] px-8 py-4 rounded-xl font-bold text-lg border border-purple-500/30 opacity-70 cursor-not-allowed flex items-center gap-2"
                >
                  Try Portfolio Simulator
                </button>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-xs px-3 py-1 rounded-full font-bold">
                  Coming Soon
                </span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center">
            <motion.div
              variants={floatVariants}
              animate="float"
              className="relative"
            >
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl"></div>
              <Image src="/globe.svg" alt="Crypto" width={300} height={300} className="drop-shadow-2xl relative z-10" />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Live Stats */}
      <section className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">Platform Statistics</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-[#232042] to-[#1a1731] rounded-2xl p-6 flex flex-col items-center shadow-xl border border-purple-500/10"
              custom={i}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.6 }}
              variants={cardVariants}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {stat.isString ? (
                  stat.value
                ) : (
                  <CountUp end={stat.value} duration={1.5} suffix={stat.suffix || ""} />
                )}
              </span>
              <span className="text-sm text-gray-400 mt-2 text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Key Features Preview */}
      <section className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">Key Features</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-gradient-to-br from-[#232042] to-[#1a1731] rounded-2xl p-6 flex flex-col items-center text-center shadow-xl border border-purple-500/10"
              custom={i}
              initial="hidden"
              whileInView="visible"
              whileHover={{ 
                y: -10,
                borderColor: "rgba(139, 92, 246, 0.5)",
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true, amount: 0.6 }}
              variants={cardVariants}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                <Image src={feature.icon} alt={feature.title} width={30} height={30} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Trending Influencers & Featured Cryptos */}
      <section className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Trending Influencers */}
          <div>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-2">Trending Influencers</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </motion.div>
            
            <div className="space-y-4">
              {trendingInfluencers.map((inf, i) => (
                <motion.div
                  key={inf.name}
                  className="bg-gradient-to-br from-[#232042] to-[#1a1731] rounded-2xl p-5 flex items-center gap-4 shadow-xl border border-purple-500/10"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ 
                    y: -5,
                    borderColor: "rgba(139, 92, 246, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true, amount: 0.6 }}
                  variants={cardVariants}
                >
                  <div className="relative">
                    <Image src={inf.avatar} alt={inf.name} width={60} height={60} className="rounded-full bg-[#19162b] border-2 border-purple-500/30" />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">
                      #{i + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-lg">{inf.name}</div>
                      <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                        {inf.winRate} Win Rate
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-2">
                      Recent: <span className="text-purple-400">{inf.recentPick.coin}</span> ({inf.recentPick.date})
                    </div>
                    
                    <div className="flex gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">7D:</span>
                        <span className="text-green-400 font-medium">{inf.roi["7D"]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">30D:</span>
                        <span className="text-green-400 font-medium">{inf.roi["30D"]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">90D:</span>
                        <span className="text-green-400 font-medium">{inf.roi["90D"]}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-blue-400 font-medium">{inf.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${inf.accuracy}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Featured Cryptos */}
          <div>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-2">Featured Cryptos</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </motion.div>
            
            <div className="space-y-4">
              {featuredCryptos.map((coin, i) => (
                <motion.div
                  key={coin.coin}
                  className="bg-gradient-to-br from-[#232042] to-[#1a1731] rounded-2xl p-5 flex items-center gap-4 shadow-xl border border-purple-500/10"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ 
                    y: -5,
                    borderColor: "rgba(139, 92, 246, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true, amount: 0.6 }}
                  variants={cardVariants}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center font-bold text-xl border border-purple-500/30">
                    {coin.coin}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-lg">{coin.coin}</div>
                      <div className={`text-sm px-2 py-1 rounded-full font-medium ${coin.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {coin.change}
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold my-1">{coin.price}</div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="text-gray-400">
                        Mentions: <span className="text-purple-400 font-medium">{coin.mentions}</span>
                      </div>
                      <div className="text-gray-400">
                        ROI: <span className="text-green-400 font-medium">{coin.roi}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* YouTube Channels Section */}
      <section className="max-w-7xl mx-auto px-4 mt-16 mb-32 relative z-10">
        <motion.h2 
          className="text-5xl font-bold text-center mb-20 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          YouTube Channels
        </motion.h2>
        
        {/* Mobile View */}
        <div className="md:hidden space-y-16">
          {timePeriods.map((period, idx) => (
            <motion.div 
              key={idx} 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Time Period Header */}
              <motion.div 
                className={`bg-gradient-to-r ${period.color} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg mb-8`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {period.title}
              </motion.div>
              
              {/* Channels - Exactly 3 per period */}
              <div className="flex flex-wrap justify-center gap-16 w-full">
                {channelsByPeriod[period.id].map((channel, channelIdx) => (
                  <motion.a
                    key={channelIdx}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + channelIdx * 0.05 + 0.2 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full shadow-lg overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-blue-900/50"
                      whileHover={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
                    >
                      <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.span 
                      className="text-sm mt-3 text-center text-gray-300 w-28 break-words font-medium"
                      whileHover={{ color: "#c4b5fd" }}
                    >
                      {channel.name}
                    </motion.span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:block">
          {timePeriodGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={`mb-32 ${groupIndex < timePeriodGroups.length - 1 ? 'pb-24 border-b border-purple-500/20' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
                {group.map((period, idx) => (
                  <TimePeriodTree 
                    key={period.id}
                    period={period}
                    channels={channelsByPeriod[period.id]}
                    index={groupIndex * 3 + idx}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
        <motion.div
          className="rounded-3xl p-12 md:p-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Track Crypto Influencers?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
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
        <p>© 2024 Crypto Influence Tracker. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}