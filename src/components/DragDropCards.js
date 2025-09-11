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
      className="relative w-full max-w-md mx-auto h-[600px] overflow-hidden"
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
            {/* MCM Rank - Top Left */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-br from-purple-500/40 to-blue-600/40 rounded-full px-3 py-1 flex items-center justify-center">
                <span className="text-white font-bold text-xs">MCM Rank {currentCard.rank || '1'}</span>
              </div>
            </div>

            {/* Diamond Icon - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </motion.div>
            </div>

            {/* ROI with Blurred Number - Between Profile Image and Lock */}
            <div className="absolute top-52 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg">
                <span className="text-purple-300 text-sm font-semibold">ROI:</span>
                <span className="text-white text-sm font-bold filter blur-sm">{Math.round(Math.random() * 50 + 20)}</span>
              </div>
            </div>

            {/* Current Card Content */}
            <div className="text-center px-6 py-8 h-full flex flex-col relative z-10">
              {/* Channel Image Only - Positioned at top */}
              <div className="flex justify-center mb-8 relative z-30">
                {currentCard.avatar && currentCard.avatar !== "/window.svg" && currentCard.avatar !== "/next.svg" && currentCard.avatar !== "/file.svg" && currentCard.avatar !== "/globe.svg" ? (
                  <motion.div 
                    className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-lg relative"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image
                      src={currentCard.channelData?.channel_thumbnails?.high?.url || currentCard.avatar}
                      alt={currentCard.channelData?.influencer_name || currentCard.channelData?.channel_title || "Channel"}
                      width={112}
                      height={112}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg relative bg-gray-600 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-white font-bold text-lg">?</span>
                  </motion.div>
                )}
              </div>

              {/* Everything Else Blurred */}
              <div className="flex-1 relative">
                {/* Heavily Blurred Background Content */}
                <div className="filter blur-2xl opacity-30">
                  {/* Avatar Background */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 relative">
                    <span className="text-white font-bold text-sm flex items-center justify-center h-full">
                      {currentCard.rank ? `#${currentCard.rank}` : 'NEXT.'}
                    </span>
                    {/* Rank Badge */}
                    {currentCard.rank && currentCard.rank <= 3 && (
                      <div className="absolute -top-2 -right-2 text-lg">
                        {currentCard.rank === 1 ? "🥇" : currentCard.rank === 2 ? "🥈" : "🥉"}
                      </div>
                    )}
                  </div>
                  
                  {/* Name and Platform */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentCard.name ? currentCard.name.replace(/_/g, " ") : "Unknown"}
                    </h3>
                    <div className="text-purple-300 text-base font-medium flex items-center justify-center gap-2">
                      {currentCard.platform}
                      {currentCard.rank && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                          Rank #{currentCard.rank}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* MCM Score */}
                  <div className="mb-8">
                    <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                      MCM Score: {currentCard.score}
                    </div>
                  </div>

                  {/* ROI Data */}
                  <div className="bg-gradient-to-br from-[#1a1238]/80 to-[#0f0820]/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/10">
                    <h4 className="text-white font-semibold text-base mb-3">
                      ROI Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>24h: +12.5%</div>
                      <div>7d: +28.3%</div>
                      <div>30d: +45.7%</div>
                      <div>180d: +125.8%</div>
                    </div>
                  </div>
                </div>

                {/* Single Premium Overlay - No Black Background */}
                <div className="absolute inset-0 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6">
                  {/* Large Lock Icon with Pulse Animation */}
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-2xl mb-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                        "0 0 30px rgba(139, 92, 246, 0.8)",
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                    </svg>
                  </motion.div>
                  
                  {/* Premium Content Title */}
                  {/* <h4 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                    🔥 Premium Analytics
                  </h4> */}
                  
                  {/* Premium Features List */}
                  <div className="text-center mb-6">
                    <div className="text-purple-300 text-sm font-semibold mb-3">Unlock Full Data:</div>
                    <div className="space-y-2 text-gray-300 text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-400">✓</span> Influencer Name & Platform
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-400">✓</span> Platform Rank & MCM Score
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-400">✓</span> Real-time ROI Performance
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-400">✓</span> Historical Win Rates
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated CTA Button */}
                  <Link href="/login">
                    <motion.button
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-white shadow-2xl text-base flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 4px 20px rgba(139, 92, 246, 0.3)",
                          "0 4px 30px rgba(139, 92, 246, 0.6)",
                          "0 4px 20px rgba(139, 92, 246, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
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