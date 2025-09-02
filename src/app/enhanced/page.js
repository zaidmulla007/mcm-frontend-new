"use client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import CountUp from "react-countup";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const advancedStats = [
  { label: "AI Models Deployed", value: 7, icon: "🤖", color: "from-purple-500 to-indigo-600" },
  { label: "Real-time Analytics", value: 99.9, suffix: "%", icon: "⚡", color: "from-green-400 to-emerald-500" },
  { label: "Prediction Accuracy", value: 87.3, suffix: "%", icon: "🎯", color: "from-blue-500 to-cyan-400" },
  { label: "Market Coverage", value: 45, suffix: "K+", icon: "🌐", color: "from-orange-400 to-red-500" },
  { label: "Daily Signals", value: 2840, icon: "📡", color: "from-pink-500 to-rose-400" },
  { label: "Success Rate", value: 92.1, suffix: "%", icon: "🏆", color: "from-yellow-400 to-amber-500" },
];

const premiumFeatures = [
  {
    title: "AI-Powered Analytics",
    icon: "🧠",
    description: "Advanced machine learning algorithms analyze market sentiment and predict price movements",
    color: "from-purple-500 to-indigo-600",
    features: ["Sentiment Analysis", "Price Prediction", "Risk Assessment", "Smart Alerts"]
  },
  {
    title: "Real-time Monitoring",
    icon: "📊",
    description: "Live tracking of crypto influencers, market trends, and portfolio performance",
    color: "from-blue-500 to-cyan-400",
    features: ["Live Data Feed", "Instant Notifications", "Market Scanner", "Trend Detection"]
  },
  {
    title: "Advanced Portfolio",
    icon: "💼",
    description: "Professional-grade portfolio management with risk analysis and optimization",
    color: "from-green-400 to-emerald-500",
    features: ["Portfolio Optimization", "Risk Management", "Diversification Tips", "Performance Analytics"]
  },
  {
    title: "Social Intelligence",
    icon: "🔍",
    description: "Monitor social media trends, influencer activity, and community sentiment",
    color: "from-orange-400 to-red-500",
    features: ["Social Sentiment", "Influencer Tracking", "Trend Analysis", "Community Insights"]
  }
];

const marketData = [
  { coin: "BTC", price: "$67,542.12", change: "+4.2%", volume: "$28.4B", mcap: "$1.33T", trend: "up" },
  { coin: "ETH", price: "$3,421.75", change: "+6.8%", volume: "$15.2B", mcap: "$411.3B", trend: "up" },
  { coin: "SOL", price: "$198.43", change: "-2.1%", volume: "$4.1B", mcap: "$93.2B", trend: "down" },
  { coin: "ADA", price: "$1.08", change: "+12.4%", volume: "$1.8B", mcap: "$38.1B", trend: "up" },
];

const testimonials = [
  {
    name: "Alex Rodriguez",
    role: "Crypto Trader",
    image: "/next.svg",
    rating: 5,
    text: "This platform transformed my trading strategy. The AI insights are incredibly accurate and helped me increase my ROI by 340% this year."
  },
  {
    name: "Sarah Chen",
    role: "Investment Manager",
    image: "/window.svg",
    rating: 5,
    text: "The real-time analytics and portfolio management tools are game-changing. Best crypto intelligence platform I've used."
  },
  {
    name: "Marcus Thompson",
    role: "Blockchain Analyst",
    image: "/globe.svg",
    rating: 5,
    text: "Unparalleled market insights and social sentiment analysis. This platform gives me the edge I need in volatile markets."
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "29",
    period: "month",
    color: "from-gray-400 to-gray-600",
    features: ["Basic Analytics", "5 Watchlists", "Email Alerts", "Mobile App"],
    popular: false
  },
  {
    name: "Professional",
    price: "99",
    period: "month",
    color: "from-blue-500 to-purple-600",
    features: ["Advanced AI Analytics", "Unlimited Watchlists", "Real-time Alerts", "Portfolio Management", "API Access"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "299",
    period: "month",
    color: "from-orange-400 to-pink-600",
    features: ["All Pro Features", "White-label Solution", "Custom Integrations", "Dedicated Support", "Advanced Reporting"],
    popular: false
  }
];

const ParticleField = ({ count = 50 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      direction: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.cos(particle.direction) * 100, 0],
            y: [0, Math.sin(particle.direction) * 100, 0],
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const TradingChart = ({ data, className }) => {
  return (
    <div className={`relative ${className}`}>
      <svg width="100%" height="100" viewBox="0 0 200 100" className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,80 Q50,20 100,40 T200,30"
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 Q50,20 100,40 T200,30 L200,100 L0,100 Z"
          fill="url(#chartGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        {/* Animated data points */}
        {[25, 75, 125, 175].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={40 + Math.sin(i) * 20}
            r="3"
            fill="#3B82F6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
};

const GlowingOrb = ({ size = 400, color = "blue" }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color === 'blue' ? '#3B82F6' : color === 'purple' ? '#8B5CF6' : '#F59E0B'}, transparent)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <motion.div
          className="absolute inset-0 w-8 h-8 border-4 border-transparent rounded-full border-t-purple-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default function EnhancedPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.2]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCardHover = useCallback((index) => {
    setHoveredCard(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center">
          <LoadingSpinner />
          <motion.p
            className="text-white mt-4 text-xl"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <ParticleField count={100} />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{ y }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse opacity-20"></div>
        </motion.div>

        {/* Multiple glowing orbs */}
        <GlowingOrb size={600} color="blue" />
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <GlowingOrb size={400} color="purple" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/3"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <GlowingOrb size={300} color="orange" />
        </motion.div>

        {/* Mouse-following effect enhanced */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 10,
            y: mousePosition.y / 10,
          }}
          transition={{ type: "spring", damping: 30 }}
        />

        {/* Matrix-like effect */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,123,255,0.1),transparent_50%)] animate-pulse"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 px-6 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              MyCryptoMonitor
            </span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {["Features", "Pricing", "Analytics", "Contact"].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          <motion.button
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              AI-Powered Crypto
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Harness the power of artificial intelligence to make smarter crypto investments.
              Get real-time analytics, predictions, and insights from the most advanced platform in the market.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="border border-gray-400 px-8 py-4 rounded-lg text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: "#8B5CF6" }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            {advancedStats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1">
                    {stat.isString ? stat.value : (
                      <CountUp end={stat.value} duration={2} separator="," suffix={stat.suffix || ""} />
                    )}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Real-time Market Data */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Live Market Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time data powered by our advanced AI algorithms
            </p>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {marketData.map((coin, idx) => (
                <motion.div
                  key={coin.coin}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-white text-sm">{coin.coin}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${coin.trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {coin.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{coin.price}</div>
                  <div className="text-sm text-gray-400 mb-2">Vol: {coin.volume}</div>
                  <div className="text-sm text-gray-500">MCap: {coin.mcap}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-32 relative" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
              Next-Generation Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of crypto analytics with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {premiumFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                className="relative group perspective-1000"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50, rotateY: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                whileHover={{
                  scale: 1.02,
                  rotateX: 5,
                  rotateY: idx % 2 === 0 ? -5 : 5,
                  z: 50
                }}
                onHoverStart={() => handleCardHover(`feature-${idx}`)}
                onHoverEnd={handleCardLeave}
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 h-full relative overflow-hidden"
                  animate={hoveredCard === `feature-${idx}` ? {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)",
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"
                    animate={hoveredCard === `feature-${idx}` ? {
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: hoveredCard === `feature-${idx}` ? Infinity : 0 }}
                  />

                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10`}
                    animate={hoveredCard === `feature-${idx}` ? {
                      scale: 1.15,
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
                    } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      animate={hoveredCard === `feature-${idx}` ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                      animate={hoveredCard === `feature-${idx}` ? { x: [-64, 64] } : {}}
                      transition={{ duration: 1, repeat: hoveredCard === `feature-${idx}` ? Infinity : 0, repeatDelay: 1 }}
                    />
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-bold text-white mb-4 relative z-10"
                    animate={hoveredCard === `feature-${idx}` ? {
                      scale: 1.05,
                      textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-gray-400 mb-6 leading-relaxed relative z-10">{feature.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {feature.features.map((item, itemIdx) => (
                      <motion.div
                        key={itemIdx}
                        className="flex items-center space-x-2 text-sm text-gray-300 relative z-10"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 + itemIdx * 0.1 + 0.5 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={hoveredCard === `feature-${idx}` ? {
                            scale: [1, 1.5, 1],
                            boxShadow: ["0 0 0 rgba(34, 197, 94, 0)", "0 0 10px rgba(34, 197, 94, 0.5)", "0 0 0 rgba(34, 197, 94, 0)"]
                          } : {}}
                          transition={{ duration: 0.8, delay: itemIdx * 0.1 }}
                        />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Glowing border effect */}
                  {hoveredCard === `feature-${idx}` && (
                    <motion.div
                      className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-400">What our users say about us</p>
          </motion.div>

          <div className="relative h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Image src={testimonials[currentTestimonial].image} alt="" width={40} height={40} />
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-gray-200 mb-6 italic max-w-4xl mx-auto leading-relaxed">
                    &quot;{testimonials[currentTestimonial].text}&quot;
                  </blockquote>

                  <div className="text-white font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'bg-purple-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                onClick={() => setCurrentTestimonial(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 relative" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible pricing for traders, analysts, and institutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`relative group ${plan.popular ? 'transform scale-105' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -10 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 rounded-full text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`bg-white/5 backdrop-blur-lg rounded-3xl p-8 border ${plan.popular ? 'border-purple-500/50' : 'border-white/10'} hover:border-white/20 transition-all duration-300 h-full`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto`}>
                    💎
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl md:text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'border border-gray-600 text-white hover:bg-white/5'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of successful traders who trust our AI-powered platform
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-6 rounded-lg text-white font-semibold text-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial Today
              </motion.button>
              <motion.button
                className="border border-gray-400 px-12 py-6 rounded-lg text-white font-semibold text-xl hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: "#8B5CF6" }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  MyCryptoMonitor
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most advanced AI-powered crypto intelligence platform. Make smarter investments with real-time analytics and predictions.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Discord", "Telegram"].map((social, idx) => (
                  <motion.div
                    key={social}
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-gray-400 text-sm font-medium">{social[0]}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                {["Features", "Pricing", "API", "Documentation"].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 MyCryptoMonitor. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}