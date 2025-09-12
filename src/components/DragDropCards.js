"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const DragDropCards = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isDragTriggered, setIsDragTriggered] = useState(false);
  const constraintsRef = useRef(null);


  const handleDragStart = (event, info) => {
    setDraggedCard(currentIndex);
    const rect = event.target.getBoundingClientRect();
    setDragOffset({
      x: info.point.x - rect.left,
      y: info.point.y - rect.top
    });
  };

  const handleDragEnd = (event, info) => {
    setDraggedCard(null);
    
    // Calculate drag distance - more sensitive threshold
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    
    // Alternative: check horizontal drag specifically
    const horizontalDrag = Math.abs(info.offset.x);
    const verticalDrag = Math.abs(info.offset.y);
    
    // If dragged far enough in any direction, move to next card
    if (dragDistance > 30 || horizontalDrag > 25 || verticalDrag > 25) {
      setIsDragTriggered(true); // Mark as drag-triggered for fast transition
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setAnimationKey(prev => prev + 1);
      
      // Reset drag trigger after a short delay
      setTimeout(() => {
        setIsDragTriggered(false);
      }, 100);
    }
  };

  // Auto-rotation every 5 seconds with smooth left-to-right animation
  useEffect(() => {
    // Don't pause on hover for now, just check drag state
    if (draggedCard !== null) {
      return;
    }
    
    const interval = setInterval(() => {
        setIsDragTriggered(false); // Ensure smooth animation for auto-rotation
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % cards.length;
        return newIndex;
      });
      setAnimationKey(prev => prev + 1); // Trigger re-animation
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [draggedCard, cards.length]); // Removed isHovered dependency temporarily

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return null;
  }


  return (
    <div 
      ref={constraintsRef}
      className="relative w-full max-w-sm mx-auto h-[620px] overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden', // Prevent layout shifts
        perspective: '1000px' // Create stacking context
      }}
    >
      {/* Smooth Left-to-Right Sliding Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${animationKey}`}
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ 
            x: 400, 
            opacity: 0,
            scale: 0.95
          }}
          animate={{ 
            x: 0, 
            opacity: 1,
            scale: draggedCard === currentIndex ? 1.05 : 1
          }}
          exit={{ 
            x: -400, 
            opacity: 0,
            scale: 0.95
          }}
          transition={{
            x: {
              type: "tween",
              duration: isDragTriggered ? 0.3 : 1.2, // Fast for drag, smooth for auto
              ease: isDragTriggered ? "easeOut" : [0.25, 0.46, 0.45, 0.94]
            },
            opacity: {
              duration: isDragTriggered ? 0.2 : 0.8, // Fast for drag, smooth for auto
              ease: "easeInOut"
            },
            scale: {
              type: "spring",
              stiffness: isDragTriggered ? 500 : 300, // Snappier for drag
              damping: isDragTriggered ? 35 : 30
            }
          }}
          whileDrag={{ 
            scale: 1.05, 
            rotate: draggedCard !== null ? 5 : 0,
            zIndex: 30
          }}
          style={{
            willChange: 'transform, opacity', // Optimize for animations - exclude background
            contain: 'layout style paint', // Contain layout effects
          }}
        >
          <div 
            className="bg-gradient-to-br from-[#3a2f5f] to-[#2a1f4a] rounded-3xl p-6 shadow-2xl border border-purple-400/20 h-full relative overflow-hidden"
            style={{
              transform: 'translateZ(0)', // Force GPU layer
              backfaceVisibility: 'hidden', // Prevent flickering
            }}
          >
            {/* Time Period - Top Left */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full px-3 py-1 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{currentCard.timePeriod || '1 hour'}</span>
              </div>
            </div>

            {/* MCM Rank - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-gradient-to-br from-orange-500/40 to-red-600/40 rounded-full px-3 py-1 flex items-center justify-center">
                <span className="text-white font-bold text-xs">MCM Rank #{currentCard.rank || '1'}</span>
              </div>
            </div>

            {/* Redesigned Card Content - Full Height */}
            <div className="px-3 py-3 h-full flex flex-col relative z-10">
              {/* Header Section - Profile & Info */}
              <div className="flex flex-col items-center mb-3">
                {/* Profile Image */}
                <div className="mb-2">
                  {currentCard.avatar && currentCard.avatar !== "/window.svg" && currentCard.avatar !== "/next.svg" && currentCard.avatar !== "/file.svg" && currentCard.avatar !== "/globe.svg" ? (
                    <motion.div 
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src={currentCard.channelData?.channel_thumbnails?.high?.url || currentCard.avatar}
                        alt={currentCard.channelData?.influencer_name || currentCard.channelData?.channel_title || "Channel"}
                        width={64}
                        height={64}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg relative bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-white font-bold text-lg">?</span>
                    </motion.div>
                  )}
                </div>

                {/* Influencer Info */}
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {currentCard.name ? currentCard.name.replace(/_/g, " ") : "Unknown"}
                  </h3>
                </div>
              </div>

              {/* Performance Data Table - Compact Layout */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-2 backdrop-blur-sm border border-white/20">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-1 mb-2 pb-1 border-b border-white/20">
                  <div className="text-white font-bold text-xs">Hits & Misses</div>
                  <div className="text-center text-white font-bold text-xs">2025</div>
                  <div className="text-center text-white font-bold text-xs">2024</div>
                  <div className="text-center text-white font-bold text-xs">2023</div>
                  <div className="text-center text-white font-bold text-xs">2022</div>
                </div>

                {/* No. of Recommendations Section */}
                <div className="mb-2">
                  <div className="grid grid-cols-5 gap-4 py-1 bg-gradient-to-r from-white/10 to-white/5 rounded mb-1">
                    <div className="text-white font-semibold text-[10px] leading-tight pr-4">
                      Recommends</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.recommendations?.total || 523}</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.recommendations?.total || 892}</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.recommendations?.total || 467}</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.recommendations?.total || 189}</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-1 bg-orange-500/20 rounded mb-1">
                    <div className="text-orange-200 text-[10px] pl-4">Moonshots</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.recommendations?.moonshots || 3}</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.recommendations?.moonshots || 18}</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.recommendations?.moonshots || 12}</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.recommendations?.moonshots || 2}</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-1 bg-blue-500/20 rounded">
                    <div className="text-blue-200 text-[10px] pl-4">Without Moonshots</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.recommendations?.withoutMoonshots || 520}</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.recommendations?.withoutMoonshots || 874}</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.recommendations?.withoutMoonshots || 455}</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.recommendations?.withoutMoonshots || 187}</div>
                  </div>
                </div>

                {/* Win/Loss Ratio Section */}
                <div className="mb-2">
                  <div className="grid grid-cols-5 gap-4 py-1 bg-gradient-to-r from-white/10 to-white/5 rounded mb-1">
                    <div className="text-white font-semibold text-[10px] leading-tight pr-4">Win/Loss Ratio</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.winLossRatio?.overall || 45}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.winLossRatio?.overall || 56}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.winLossRatio?.overall || 42}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.winLossRatio?.overall || 31}%</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-1 bg-orange-500/20 rounded mb-1">
                    <div className="text-orange-200 text-[10px] pl-4">Moonshots</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.winLossRatio?.moonshots || 100}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.winLossRatio?.moonshots || 89}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.winLossRatio?.moonshots || 92}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.winLossRatio?.moonshots || 50}%</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-1 bg-blue-500/20 rounded">
                    <div className="text-blue-200 text-[10px] pl-4">Without Moonshots</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.winLossRatio?.withoutMoonshots || 44}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.winLossRatio?.withoutMoonshots || 55}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.winLossRatio?.withoutMoonshots || 40}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.winLossRatio?.withoutMoonshots || 30}%</div>
                  </div>
                </div>

                {/* Average Return Section - Fully Visible */}
                <div className="mb-2">
                  <div className="grid grid-cols-5 gap-4 py-1 bg-gradient-to-r from-white/10 to-white/5 rounded mb-1">
                    <div className="text-white font-semibold text-[10px] leading-tight pr-4">Average Return</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.averageReturn?.overall >= 0 ? '+' : ''}{currentCard.yearlyPerformance?.[2025]?.averageReturn?.overall || 12.3}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.averageReturn?.overall >= 0 ? '+' : ''}{currentCard.yearlyPerformance?.[2024]?.averageReturn?.overall || 15.2}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.averageReturn?.overall >= 0 ? '+' : ''}{currentCard.yearlyPerformance?.[2023]?.averageReturn?.overall || 3.8}%</div>
                    <div className="text-center text-white font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.averageReturn?.overall || -5.4}%</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 py-1 bg-orange-500/20 rounded mb-1">
                    <div className="text-orange-200 text-[10px] pl-4">Moonshots</div>
                    <div className="text-center text-orange-400 font-bold text-xs">+{currentCard.yearlyPerformance?.[2025]?.averageReturn?.moonshots || 324.7}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">+{currentCard.yearlyPerformance?.[2024]?.averageReturn?.moonshots || 189.4}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">+{currentCard.yearlyPerformance?.[2023]?.averageReturn?.moonshots || 276.3}%</div>
                    <div className="text-center text-orange-400 font-bold text-xs">+{currentCard.yearlyPerformance?.[2022]?.averageReturn?.moonshots || 78.5}%</div>
                  </div>
                  <div className="grid grid-cols-5 gap-1 py-1 bg-blue-500/20 rounded mb-1">
                    <div className="text-blue-200 text-[10px] pl-2">Without Moonshots</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2025]?.averageReturn?.withoutMoonshots >= 0 ? '+' : ''}{currentCard.yearlyPerformance?.[2025]?.averageReturn?.withoutMoonshots || 8.9}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2024]?.averageReturn?.withoutMoonshots >= 0 ? '+' : ''}{currentCard.yearlyPerformance?.[2024]?.averageReturn?.withoutMoonshots || 12.1}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2023]?.averageReturn?.withoutMoonshots || -2.1}%</div>
                    <div className="text-center text-cyan-400 font-bold text-xs">{currentCard.yearlyPerformance?.[2022]?.averageReturn?.withoutMoonshots || -6.2}%</div>
                  </div>
                </div>

                {/* Start Free Trial Button - Directly After Data */}
                <div className="mt-0">
                  <Link href="/login">
                    <motion.button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-3 py-2 rounded-lg font-bold text-white shadow-lg transition-all duration-200 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Free Trial
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DragDropCards;