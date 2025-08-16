"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountUp from "react-countup";

const stats = [
  { label: "Influencers Tracked", value: 1245 },
  { label: "Crypto Picks Analyzed", value: 8320 },
  { label: "Avg ROI", value: 14.2, suffix: "%" },
  { label: "Videos Processed", value: 19500 },
  { label: "Time Span", value: "2019–2025", isString: true },
];

const features = [
  { title: "Influencer Profiles", icon: "/file.svg" },
  { title: "ROI Tracking", icon: "/window.svg" },
  { title: "Leaderboard", icon: "/globe.svg" },
  { title: "Crypto Pages", icon: "/next.svg" },
  { title: "Portfolio Simulator", icon: "/vercel.svg" },
];

const trendingInfluencers = [
  {
    name: "CryptoKing",
    avatar: "/window.svg",
    recentPick: { coin: "ETH", date: "2024-06-01" },
    roi: { "7D": "8.2%", "30D": "15.1%", "90D": "32.4%" },
    winRate: "67%",
  },
  {
    name: "BlockQueen",
    avatar: "/globe.svg",
    recentPick: { coin: "BTC", date: "2024-06-02" },
    roi: { "7D": "5.7%", "30D": "12.3%", "90D": "28.9%" },
    winRate: "72%",
  },
];

const featuredCryptos = [
  {
    coin: "ETH",
    mentions: 120,
    roi: "18.4%",
  },
  {
    coin: "BTC",
    mentions: 98,
    roi: "15.2%",
  },
  {
    coin: "SOL",
    mentions: 75,
    roi: "22.1%",
  },
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
    },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#19162b] text-white font-sans pb-16">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto pt-16 pb-10 px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Are Crypto Influencers Making You Money?
          </h1>
          <p className="text-lg text-gray-300 max-w-lg">
            Discover the real impact of crypto influencers. Track their picks, analyze ROI, and simulate your own portfolio based on their recommendations.
          </p>
          <div className="flex gap-4 mt-2">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition">
              Explore Influencers
            </button>
            <button className="bg-[#232042] px-6 py-3 rounded-lg font-semibold border border-purple-500 hover:bg-purple-700/30 transition">
              Try Portfolio Simulator
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/globe.svg" alt="Crypto" width={260} height={260} className="drop-shadow-2xl" />
        </div>
      </section>

      {/* Live Stats */}
      <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 px-4 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#232042] rounded-2xl p-5 flex flex-col items-center shadow-md"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={cardVariants}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {stat.isString ? (
                stat.value
              ) : (
                <CountUp end={stat.value} duration={1.2} suffix={stat.suffix || ""} />
              )}
            </span>
            <span className="text-xs text-gray-400 mt-1 text-center">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Key Features Preview */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-[#232042] rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition shadow-md cursor-pointer"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={cardVariants}
            >
              <Image src={feature.icon} alt={feature.title} width={40} height={40} className="mb-3" />
              <span className="font-medium text-center">{feature.title}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Influencers & Featured Cryptos */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        {/* Trending Influencers */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Trending Influencers</h2>
          <div className="flex flex-col gap-4">
            {trendingInfluencers.map((inf, i) => (
              <motion.div
                key={inf.name}
                className="bg-[#232042] rounded-2xl p-5 flex items-center gap-4 shadow-md"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={cardVariants}
              >
                <Image src={inf.avatar} alt={inf.name} width={48} height={48} className="rounded-full bg-[#19162b]" />
                <div className="flex-1">
                  <div className="font-semibold">{inf.name}</div>
                  <div className="text-xs text-gray-400">Recent: {inf.recentPick.coin} ({inf.recentPick.date})</div>
                  <div className="flex gap-2 mt-1 text-xs">
                    <span>ROI: <span className="text-green-400">{inf.roi["7D"]}</span> / {inf.roi["30D"]} / {inf.roi["90D"]}</span>
                    <span className="ml-2">Win Rate: <span className="text-blue-400">{inf.winRate}</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Featured Cryptos */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Featured Cryptos</h2>
          <div className="flex flex-col gap-4">
            {featuredCryptos.map((coin, i) => (
              <motion.div
                key={coin.coin}
                className="bg-[#232042] rounded-2xl p-5 flex items-center gap-4 shadow-md"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={cardVariants}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center font-bold text-xl">
                  {coin.coin}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{coin.coin}</div>
                  <div className="text-xs text-gray-400">Mentions: {coin.mentions}</div>
                  <div className="text-xs mt-1">ROI after picks: <span className="text-green-400">{coin.roi}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
