"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaYoutube, FaTelegramPlane, FaCertificate } from "react-icons/fa";

// Helper function to clean up message format
const cleanMessageFormat = (content) => {
    if (!content) return content;

    let cleaned = content.replace(/(\w+)\s+has moved (down|up) by\s+(\d+\.?\d*%)/gi, (match, coin, direction, percentage) => {
        const percentValue = parseFloat(percentage);
        if (percentValue === 0 || percentValue === 0.0 || percentValue === 0.00) {
            return `${coin}: Minor movement`;
        }
        return `${coin}: ${percentage}`;
    });

    cleaned = cleaned.replace(/(^|·\s*)([A-Z]{2,10})\s+(\d+\.?\d*%\s+[↑↓])/g, '$1$2: $3');
    cleaned = cleaned.replace(/\s+in\s+2\s+hours/gi, ' in last 2 Hrs');
    cleaned = cleaned.replace(/\s+in\s+last\s+6\s+hours/gi, ' in last 6 Hrs');
    cleaned = cleaned.replace(/in\s+last\s+2\s+Hrs,/gi, 'in last 2 Hrs');
    cleaned = cleaned.replace(/(TG:\s+\d+\s+New\s+Posts?)\s+(in\s+last\s+6\s+Hrs)/gi, '$2 $1');

    return cleaned;
};

export default function TrendingCoinScroller({ notifications }) {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);
    const [animationDuration, setAnimationDuration] = useState(null);

    // Process notifications into scroller content
    const scrollerContent = useMemo(() => {
        if (!notifications) return "";

        if (notifications.scroller) {
            return cleanMessageFormat(notifications.scroller);
        } else if (notifications.hourly_alerts_summary) {
            return cleanMessageFormat(notifications.hourly_alerts_summary);
        }
        return "";
    }, [notifications]);

    // Measure content width and set animation duration proportionally
    useEffect(() => {
        // Reset duration so we re-measure when content changes
        setAnimationDuration(null);

        // Wait for next frame so DOM has rendered the content
        const raf = requestAnimationFrame(() => {
            if (scrollRef.current) {
                const contentItem = scrollRef.current.querySelector('.scroller-content-item');
                if (contentItem) {
                    const width = contentItem.scrollWidth;
                    // ~18px/s speed
                    const duration = Math.max(60, width / 18);
                    setAnimationDuration(duration);
                }
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [scrollerContent]);

    const formatNewStyle = (text) => {
        const entries = text.split('·').filter(entry => entry.trim());

        return entries.map((entry, idx) => {
            let trimmedEntry = entry.trim();
            if (!trimmedEntry) return null;

            const isNewMention = trimmedEntry.includes('🆕');
            trimmedEntry = trimmedEntry.replace('🆕', '').trim();

            const colonIndex = trimmedEntry.indexOf(':');
            if (colonIndex === -1) return null;

            const symbol = trimmedEntry.substring(0, colonIndex).trim();
            let restOfText = trimmedEntry.substring(colonIndex + 1).trim();

            let twoHrPercent = null;
            let is2HrUp = false;
            const twoHrMatch = restOfText.match(/In\s+last\s+2\s+hrs:\s*(\d+\.?\d*)%\s*([↑↓])/i);
            if (twoHrMatch) {
                twoHrPercent = twoHrMatch[1] + '%';
                is2HrUp = twoHrMatch[2] === '↑';
            }

            let sixHrPercent = null;
            let is6HrUp = false;
            let hasFireEmoji = false;
            const sixHrMatch = restOfText.match(/In\s+last\s+6\s+hrs:\s*(🔥\s*)?(\d+\.?\d*)%\s*([↑↓])/i);
            if (sixHrMatch) {
                hasFireEmoji = !!sixHrMatch[1];
                sixHrPercent = sixHrMatch[2] + '%';
                is6HrUp = sixHrMatch[3] === '↑';
            }

            const ytMatch = restOfText.match(/YT:\s*(\d+)/i);
            const tgMatch = restOfText.match(/TG:\s*(\d+)/i);

            const hasYT = restOfText.includes('YT:');
            const hasTG = restOfText.includes('TG:');

            return (
                <span key={idx} className="inline-flex items-center whitespace-nowrap gap-1">
                    {isNewMention && (
                        <div className="relative inline-flex items-center justify-center h-6 w-6">
                            <FaCertificate className="text-blue-500 w-full h-full drop-shadow-sm" />
                            <span className="absolute text-[10px] font-bold text-white uppercase tracking-tighter">N</span>
                        </div>
                    )}
                    <span className="font-bold">{symbol}:</span>
                    {twoHrPercent && (
                        <>
                            <span>In last 2 hrs:</span>
                            <span className="font-semibold">{twoHrPercent}</span>
                            <span className={is2HrUp ? 'text-green-600 font-bold text-lg' : 'text-red-600 font-bold text-lg'}>
                                {is2HrUp ? '↑' : '↓'}
                            </span>
                        </>
                    )}
                    {sixHrPercent && (
                        <>
                            <span>,</span>
                            <span>In last 6 hrs:</span>
                            {hasFireEmoji && <span>🔥</span>}
                            <span className="font-semibold">{sixHrPercent}</span>
                            <span className={is6HrUp ? 'text-green-600 font-bold text-lg' : 'text-red-600 font-bold text-lg'}>
                                {is6HrUp ? '↑' : '↓'}
                            </span>
                        </>
                    )}
                    {(hasYT || hasTG) && (
                        <>
                            <span>with</span>
                            {hasYT && (
                                <>
                                    <FaYoutube className="text-red-600 text-xl" />
                                    <span>:</span>
                                    <span className="font-semibold">{ytMatch ? ytMatch[1] : '0'} new Posts</span>
                                </>
                            )}
                            {hasYT && hasTG && <span>,</span>}
                            {hasTG && (
                                <>
                                    <FaTelegramPlane className="text-blue-500 text-xl" />
                                    <span>:</span>
                                    <span className="font-semibold">{tgMatch ? tgMatch[1] : '0'} new Posts</span>
                                </>
                            )}
                        </>
                    )}
                    <span className="text-black font-bold text-3xl px-3">•</span>
                </span>
            );
        }).filter(Boolean);
    };

    if (!scrollerContent) {
        return null;
    }

    const renderedContent = (
        <span className="text-gray-700 font-medium text-base px-2 py-2 inline-flex items-center gap-1">
            {formatNewStyle(scrollerContent)}
        </span>
    );

    return (
        <div className="w-full">
            <div className="relative rounded-lg">
                <div className="bg-white rounded-lg overflow-hidden relative">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-100">
                        <div
                            className="relative overflow-hidden"
                            ref={scrollRef}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <div
                                className={`inline-flex items-center ${animationDuration ? 'scroller-track' : ''}`}
                                style={{
                                    animationDuration: animationDuration ? `${animationDuration}s` : undefined,
                                    animationPlayState: isPaused ? 'paused' : 'running',
                                }}
                            >
                                {/* Two identical copies for seamless CSS loop */}
                                <div className="scroller-content-item inline-flex items-center shrink-0">
                                    {renderedContent}
                                    {renderedContent}
                                    {renderedContent}
                                </div>
                                <div className="inline-flex items-center shrink-0">
                                    {renderedContent}
                                    {renderedContent}
                                    {renderedContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .scroller-track {
                    animation: scroll-left linear infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
