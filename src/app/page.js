"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CountUp from "react-countup";
import Link from "next/link";

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
            <Link href="/influencers">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition">
                Explore Influencers
              </button>
            </Link>
            <div className="relative inline-block">
              <button
                disabled
                className="bg-[#232042] px-6 py-3 rounded-lg font-semibold border border-purple-500 opacity-60 cursor-not-allowed"
              >
                Try Portfolio Simulator
              </button>
              <span className="absolute -top-2 -right-2 bg-purple-600 text-xs px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>

          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/globe.svg" alt="Crypto" width={260} height={260} className="drop-shadow-2xl" />
        </div>
      </section>

      {/* Live Stats */}
      <section className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 px-4 mb-12">
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

        {/* Get Started Button */}
        <motion.div
          className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-md cursor-pointer hover:scale-105 transition"
          custom={stats.length}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          style={{
            height: "50px",
            marginTop: "25px",
            borderRadius: "30px"
          }}
        >
          <Link href="/login" className="w-full h-full flex flex-col items-center justify-center">
            <button className="text-2xl font-bold text-to-green-recomendations1">
              Get Started
            </button>
          </Link>
        </motion.div>
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
          <motion.div
            className="bg-white flex flex-col items-center justify-center shadow-md cursor-pointer transition opacity-100 rounded-[30px] mt-[38px]"
            style={{ height: "50px", transform: "none" }}
            custom={stats.length}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={cardVariants}
          >
            <Link
              href="/login"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <button className="text-2xl font-bold text-to-green-recomendations1">
                Get Started
              </button>
            </Link>
          </motion.div>
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
        <motion.div
          className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-md cursor-pointer hover:scale-105 transition"
          custom={stats.length}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardVariants}
          style={{
            height: "50px",
            marginTop: "25px",
            borderRadius: "30px"
          }}
        >
          <Link href="/login" className="w-full h-full flex flex-col items-center justify-center">
            <button className="text-2xl font-bold text-to-green-recomendations1">
              Get Started
            </button>
          </Link>
        </motion.div>
      </section>

      {/* YouTube Channels Section */}
    {/* YouTube Channels Section */}
<section className="max-w-6xl mx-auto px-4 mt-16">
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
      YouTube Channels
    </h2>
    
    {/* Mobile View */}
    <div className="md:hidden space-y-12">
      {[
        { id: '1hour', title: '1 Hour', color: 'bg-purple-500' },
        { id: '24hours', title: '24 Hours', color: 'bg-blue-500' },
        { id: '7days', title: '7 Days', color: 'bg-green-500' },
        { id: '30days', title: '30 Days', color: 'bg-yellow-500' },
        { id: '60days', title: '60 Days', color: 'bg-orange-500' },
        { id: '90days', title: '90 Days', color: 'bg-red-500' },
        { id: '180days', title: '180 Days', color: 'bg-pink-500' },
        { id: '1year', title: '1 Year', color: 'bg-indigo-500' },
      ].map((period, idx) => (
        <div key={idx} className="flex flex-col items-center">
          {/* Time Period Header */}
          <div className={`${period.color} text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md mb-4`}>
            {period.title}
          </div>
          
          {/* Vertical Line */}
          <div className="w-0.5 h-8 bg-gray-300 mb-4"></div>
          
          {/* Channels */}
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {[
              { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
              { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
              { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
            ].map((channel, channelIdx) => (
              <a
                key={channelIdx}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:transform hover:scale-110 transition-transform"
              >
                <img src={channel.image} alt={channel.name} className="w-12 h-12 rounded-full shadow-md" />
                <span className="text-xs mt-1 text-center text-gray-700 w-16 break-words">{channel.name}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Desktop View */}
    <div className="hidden md:block space-y-24">
      {/* First Row - 3 time periods */}
      <div className="relative">
        <div className="flex justify-around mb-16">
          {[
            { id: '1hour', title: '1 Hour', color: 'bg-purple-500' },
            { id: '24hours', title: '24 Hours', color: 'bg-blue-500' },
            { id: '7days', title: '7 Days', color: 'bg-green-500' },
          ].map((period, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`${period.color} text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md`}>
                {period.title}
              </div>
              {/* Vertical Line */}
              <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
              {/* Horizontal branches */}
              <div className="relative w-40">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-300"></div>
                <div className="absolute top-4 left-8 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 right-8 w-0.5 h-12 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Channels for first row */}
        <div className="flex justify-around">
          {[
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            },
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            },
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            }
          ].map((period, periodIdx) => (
            <div key={periodIdx} className="relative w-40 flex justify-between">
              {period.channels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:transform hover:scale-110 transition-transform"
                >
                  <img src={channel.image} alt={channel.name} className="w-12 h-12 rounded-full shadow-md" />
                  <span className="text-[10px] mt-1 text-center text-gray-700 w-16 break-words">{channel.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Second Row - 3 time periods */}
      <div className="relative">
        <div className="flex justify-around mb-16">
          {[
            { id: '30days', title: '30 Days', color: 'bg-yellow-500' },
            { id: '60days', title: '60 Days', color: 'bg-orange-500' },
            { id: '90days', title: '90 Days', color: 'bg-red-500' },
          ].map((period, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`${period.color} text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md`}>
                {period.title}
              </div>
              {/* Vertical Line */}
              <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
              {/* Horizontal branches */}
              <div className="relative w-40">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-300"></div>
                <div className="absolute top-4 left-8 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 right-8 w-0.5 h-12 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Channels for second row */}
        <div className="flex justify-around">
          {[
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            },
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            },
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            }
          ].map((period, periodIdx) => (
            <div key={periodIdx} className="relative w-40 flex justify-between">
              {period.channels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:transform hover:scale-110 transition-transform"
                >
                  <img src={channel.image} alt={channel.name} className="w-12 h-12 rounded-full shadow-md" />
                  <span className="text-[10px] mt-1 text-center text-gray-700 w-16 break-words">{channel.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Third Row - 2 time periods */}
      <div className="relative">
        <div className="flex justify-center space-x-32 mb-16">
          {[
            { id: '180days', title: '180 Days', color: 'bg-pink-500' },
            { id: '1year', title: '1 Year', color: 'bg-indigo-500' },
          ].map((period, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`${period.color} text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md`}>
                {period.title}
              </div>
              {/* Vertical Line */}
              <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
              {/* Horizontal branches */}
              <div className="relative w-40">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-300"></div>
                <div className="absolute top-4 left-8 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute top-4 right-8 w-0.5 h-12 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
        {/* Channels for third row */}
        <div className="flex justify-center space-x-32">
          {[
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            },
            {
              channels: [
                { name: 'Intellipaat', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/user/intellipaat' },
                { name: 'Programming with Mosh', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/programmingwithmosh' },
                { name: 'Harvard Medical School', image: 'https://via.placeholder.com/50', url: 'https://www.youtube.com/c/HarvardMedicalSchool' }
              ]
            }
          ].map((period, periodIdx) => (
            <div key={periodIdx} className="relative w-40 flex justify-between">
              {period.channels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center hover:transform hover:scale-110 transition-transform"
                >
                  <img src={channel.image} alt={channel.name} className="w-12 h-12 rounded-full shadow-md" />
                  <span className="text-[10px] mt-1 text-center text-gray-700 w-16 break-words">{channel.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}