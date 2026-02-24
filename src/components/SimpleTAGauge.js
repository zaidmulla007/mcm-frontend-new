import React, { memo } from 'react';
import GaugeComponent from 'react-gauge-component';

/**
 * SimpleTAGauge - Updated to use GaugeComponent with Red-Green Gradient
 * Matches the visual style of Social Media Sentiment gauge.
 *
 * Accepts taData prop from API: { total_counts: { buy, sell, neutral }, recommendation }
 */
function SimpleTAGauge({ taData = null }) {
  // Extract buy/sell/neutral counts from taData
  const counts = taData?.total_counts || {};
  const buy = counts.buy ?? counts.BUY ?? 0;
  const sell = counts.sell ?? counts.SELL ?? 0;
  const neutral = counts.neutral ?? counts.NEUTRAL ?? 0;
  const total = buy + sell + neutral;

  // If no data, show N/A
  if (total === 0) {
    return (
      <span className="text-xs text-gray-400">N/A</span>
    );
  }

  // Calculate score (0 to 100) from buy/sell/neutral counts
  // buy% = buy/total, sell% = sell/total
  // Score: 0 = all sell (bearish), 50 = equal (neutral), 100 = all buy (bullish)
  const buyPercent = (buy / total) * 100;
  const sellPercent = (sell / total) * 100;
  const score = ((buyPercent - sellPercent + 100) / 2);

  // Derive display text from same score so needle and text always match
  let displayText;
  if (score >= 55) {
    displayText = "Bullish";
  } else if (score <= 45) {
    displayText = "Bearish";
  } else {
    displayText = "Neutral";
  }

  // Get text style based on content
  const getTextStyle = (text) => {
    if (!text) return { color: 'text-gray-500' };

    const textLower = text.toLowerCase();
    if (textLower.includes('strong buy') || textLower.includes('bullish')) {
      return { color: 'text-green-700 font-bold' };
    } else if (textLower.includes('buy')) {
      return { color: 'text-green-600' };
    } else if (textLower.includes('strong sell') || textLower.includes('bearish')) {
      return { color: 'text-red-700 font-bold' };
    } else if (textLower.includes('sell')) {
      return { color: 'text-red-600' };
    } else {
      return { color: 'text-gray-500' };
    }
  };

  const textStyle = getTextStyle(displayText);

  return (
    <div className="flex items-center justify-center">
      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="ta-gauge-size">
          <GaugeComponent
            type="radial"
            style={{ width: '100%', height: '100%' }}
            value={score}
            labels={{
              valueLabel: { hide: true },
              tickLabels: {
                ticks: [
                  { value: 20 },
                  { value: 50 },
                  { value: 80 },
                  { value: 100 }
                ]
              }
            }}
            arc={{
              colorArray: ['#CE1F1F', '#00FF15'], // Red to Green
              nbSubArcs: 90,
              padding: 0.01,
              width: 0.4
            }}
            pointer={{
              animationDelay: 0,
              strokeWidth: 7
            }}
          />
        </div>
        {/* Signal display below gauge */}
        {displayText && (
          <div className={`text-[10px] font-semibold text-center mt-1 ${textStyle.color}`}>
            {displayText}
          </div>
        )}
      </div>
      <style jsx>{`
        .ta-gauge-size {
          width: 50px;
          height: 50px;
        }
        @media (min-width: 1441px) {
          .ta-gauge-size {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(SimpleTAGauge);
