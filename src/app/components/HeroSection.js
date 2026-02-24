"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [countsData, setCountsData] = useState(null);
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    fetchCountsData();
  }, []);

  const fetchCountsData = async () => {
    try {
      setCountsLoading(true);
      const response = await fetch('/api/landing-counts');
      const result = await response.json();

      if (result.success && result.data) {
        setCountsData({
          totalInfluencers: result.data.totalInfluencers,
          callsTrackedTested: result.data.callsTrackedTested,
          coinsCovered: result.data.coinsCovered
        });
      }
    } catch (error) {
      console.error('Error fetching counts data:', error);
    } finally {
      setCountsLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/30 via-indigo-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-200/30 via-purple-200/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8"
        >
          <span className="bg-gradient-to-r from-cyan-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm">
            Backtested. Verified. Trusted.
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl md:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-8 max-w-5xl mx-auto leading-tight"
        >
          World&apos;s only Platform to navigate crypto investors through the noise of social media
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base md:text-lg text-gray-700 mx-auto mb-10 space-y-3 max-w-4xl"
        >
          <p className="leading-relaxed">
            <strong className="text-indigo-500">Social Media moves investors sentiment</strong>, we create accountability by turning social buzz into measurable trust
          </p>
          <p className="leading-relaxed">
            We backtest every recommendation to give a trust rating, ROI & win rate of individual social media influencers
          </p>
          <p className="leading-relaxed text-indigo-500 font-medium">
            With Transparent methodology and audit trail
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="/login?signup=true"
            className="relative group bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-12 py-4 rounded-2xl font-bold text-2xl md:text-3xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Stats Cards - 4 square tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto mb-12"
      >
        {/* Card 1 - Total Influencers */}
        <motion.div
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl bg-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 h-full hover:bg-white/95 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-xl mx-auto mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users text-cyan-700" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-2 text-center">
              {countsLoading ? 'Loading...' : `${countsData?.totalInfluencers || 0}+`}
            </div>
            <div className="text-sm text-gray-700 text-center font-bold tracking-wide">Total Influencers</div>
          </div>
        </motion.div>

        {/* Card 2 - Calls Tracked */}
        <motion.div
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl bg-white shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 h-full hover:bg-white/95 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-100 to-fuchsia-200 rounded-xl mx-auto mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-purple-700" aria-hidden="true">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
              </svg>
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-fuchsia-700 bg-clip-text text-transparent mb-2 text-center">
              {countsLoading ? 'Loading...' : `${countsData?.callsTrackedTested?.toLocaleString('en-US') || 0}+`}
            </div>
            <div className="text-sm text-gray-700 text-center font-bold tracking-wide">Calls Tracked & Tested</div>
            <div className="text-xs text-gray-600 text-center font-semibold mt-1">for 3+ years</div>
          </div>
        </motion.div>

        {/* Card 3 - Live Tracking */}
        <motion.div
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl bg-white shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/40"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 h-full hover:bg-white/95 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl mx-auto mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radio text-emerald-700" aria-hidden="true">
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M4.93 19.07a10 10 0 0 1 0-14.14"></path>
                <path d="M7.76 16.24a6 6 0 0 1 0-8.49"></path>
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-3 text-center">Live Tracking</div>
            <div className="flex items-center justify-center gap-2 text-sm">
              {/* YouTube Icon */}
              <svg className="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-lg font-extrabold text-gray-700">&bull;</span>
              {/* Telegram Icon */}
              <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              <span className="text-lg font-extrabold text-gray-700">&bull;</span>
              {/* Twitter Icon (Coming Soon - Grayed out) */}
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">(Soon)</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4 - Coins Covered */}
        <motion.div
          whileHover={{ scale: 1.05, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl bg-white shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 h-full hover:bg-white/95 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl mx-auto mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins text-orange-700" aria-hidden="true">
                <circle cx="8" cy="8" r="6"></circle>
                <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                <path d="M7 6h1v4"></path>
                <path d="m16.71 13.88.7.71-2.82 2.82"></path>
              </svg>
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-2 text-center">
              {countsLoading ? 'Loading...' : `${countsData?.coinsCovered?.toLocaleString('en-US') || 0}+`}
            </div>
            <div className="text-sm text-gray-700 text-center font-bold tracking-wide">Coins Covered</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
