"use client";

import HeroSection from "./components/HeroSection";
import TestimonialsSection from "./components/TestimonialsSection";
import YouTubeTelegramDataTable from "./components/YouTubeTelegramDataTable";
import InfluencerFlipbook from "./components/InfluencerFlipbook";
import CTASection from "./components/CTASection";
import YouTubeTelegramInfluencers from "./components/YouTubeTelegramInfluencers";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useTop10LivePrice } from "./livePriceTop10";
import { useTimezone } from "./contexts/TimezoneContext";
import LandingPage from "./landing-page/page";

export default function HomePage() {
  const { top10Data, isConnected } = useTop10LivePrice();
  const { useLocalTime } = useTimezone();
  const scrollingData = [...top10Data, ...top10Data];
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const x = useMotionValue(0);
  const controls = useAnimationControls();

  // Check login status - render landing page content for logged-in users
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Get the width of one loop of scrolling data
  const getLoopWidth = () => {
    if (!scrollContainerRef.current) return 0;
    const firstItem = scrollContainerRef.current.querySelector('.price-item');
    if (!firstItem) return 0;
    return firstItem.offsetWidth * scrollingData.length;
  };

  // Handle mouse wheel scroll with infinite loop
  const handleWheel = (e) => {
    e.preventDefault();
    const currentX = x.get();
    const newX = currentX - e.deltaY;
    const loopWidth = getLoopWidth();

    // Wrap around for infinite scroll
    if (newX < -loopWidth) {
      x.set(newX + loopWidth);
    } else if (newX > 0) {
      x.set(newX - loopWidth);
    } else {
      x.set(newX);
    }
  };

  // Handle drag
  const handleDrag = (event, info) => {
    const loopWidth = getLoopWidth();
    const currentX = x.get();

    // Wrap around during drag
    if (currentX < -loopWidth) {
      x.set(currentX + loopWidth);
    } else if (currentX > 0) {
      x.set(currentX - loopWidth);
    }
  };

  // Auto-scroll animation
  useEffect(() => {
    if (isPaused || isDragging) {
      controls.stop();
      return;
    }

    const loopWidth = getLoopWidth();
    if (loopWidth === 0) return;

    const animate = async () => {
      const currentX = x.get();
      await controls.start({
        x: currentX - loopWidth,
        transition: {
          duration: 60,
          ease: "linear",
        },
      });
      x.set(0);
      animate();
    };

    animate();

    return () => controls.stop();
  }, [isPaused, isDragging, scrollingData, controls, x]);

  // Show loading while checking login status
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Logged-in users see the landing page content at /
  if (isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <HeroSection />

      {/* Influencer Flipbook Section - Full Width */}
      <div className="w-full py-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="items-start mb-8 px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold drop-shadow-sm">
            <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Influencer Analytics
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full mt-5 shadow-lg shadow-indigo-500/50"></div>
        </motion.div>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <InfluencerFlipbook />
        </div>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      <div className="mx-auto px-4 py-4">
        {/* YouTube Telegram Data Table Guage Component */}
        <div className="mt-4">
          <YouTubeTelegramDataTable useLocalTime={useLocalTime} />
        </div>
        <div className="mt-7">
          <YouTubeTelegramInfluencers />
        </div>

        {/* Influencer Flash News Text */}
        <h2 className="text-center text-gray-900 text-2xl font-bold mb-0 mt-10">
          Live Prices <span className="text-gray-600 text-sm">(Source Binance)</span>

        </h2>
        <h2 className="text-center text-gray-900 text-2xl font-bold mb-3 mt-0">
          <span className="text-gray-600 text-sm">(Price change percentage in last 24 hours)</span>
        </h2>

        {/* Influencer News Scroller Container */}
        <div
          ref={scrollContainerRef}
          className="relative h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-blue-200 overflow-hidden shadow-2xl mb-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onWheel={handleWheel}
        >
          {/* Continuous Left-to-Right Scrolling News */}
          <div className="absolute inset-0 flex items-center">
            <motion.div
              drag="x"
              dragConstraints={false}
              dragElastic={0}
              dragMomentum={false}
              onDrag={handleDrag}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              style={{ x }}
              animate={controls}
              className="flex whitespace-nowrap cursor-grab active:cursor-grabbing"
            >
              {[...scrollingData, ...scrollingData, ...scrollingData, ...scrollingData].map((item, index) => (
                <div
                  key={item.symbol + index}
                  className="price-item flex items-center gap-3 px-5 py-3 mx-4 flex-shrink-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-purple-600 font-bold text-xs uppercase truncate">
                      {item.symbol}
                    </span>
                    <span className="text-gray-600 text-xs capitalize truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-900 font-bold text-sm whitespace-nowrap">
                      ${typeof item.price === 'number' ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}
                    </span>
                    <span className={`text-xs font-semibold whitespace-nowrap ${typeof item.priceChange24h === 'number'
                      ? item.priceChange24h >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                      : 'text-gray-500'
                      }`}>
                      {typeof item.priceChange24h === 'number'
                        ? `${item.priceChange24h >= 0 ? '+' : ''}${item.priceChange24h.toFixed(2)}%`
                        : '0.00%'}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlay Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-100 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-100 to-transparent pointer-events-none"></div>
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <TestimonialsSection />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <CTASection />
        </motion.div>
      </div>
    </div>
  );
}
