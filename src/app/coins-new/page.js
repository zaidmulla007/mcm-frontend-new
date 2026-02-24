"use client";
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { FaYoutube, FaTelegramPlane, FaCertificate, FaBell, FaEye, FaTimes, FaDownload } from "react-icons/fa";
import { useCoinsLivePrice } from "@/hooks/useCoinsLivePrice";
import { useTimezone } from "../contexts/TimezoneContext";
import SimpleTAGauge from "@/components/SimpleTAGauge";
import GaugeComponent from "react-gauge-component";
import TrendingCoinScroller from "../components/TrendingCoinScroller";

// ─── Memoized Components (defined OUTSIDE to avoid re-creation on every render) ───

// Mini Gauge Component for Bullish/Bearish - Using same style as SimpleTAGauge
const MiniGauge = memo(({ bullishPercent, bearishPercent }) => {
  const total = bullishPercent + bearishPercent;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="gauge-size" style={{ opacity: 0.45, filter: 'grayscale(100%)' }}>
          <GaugeComponent
            type="radial"
            style={{ width: '100%', height: '100%' }}
            value={50}
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
              colorArray: ['#9CA3AF', '#9CA3AF'],
              nbSubArcs: 90,
              padding: 0.01,
              width: 0.4
            }}
            pointer={{
              animationDelay: 0,
              animationDuration: 0,
              strokeWidth: 7
            }}
          />
        </div>
        <div className="text-[10px] font-semibold text-center mt-1 text-gray-400">
          Neutral
        </div>
      </div>
    );
  }

  const score = bullishPercent;

  let sentimentText = "Neutral";
  let sentimentColor = "text-gray-500";

  if (score >= 60) {
    sentimentText = "Bullish";
    sentimentColor = "text-green-600 font-semibold";
  } else if (score <= 40) {
    sentimentText = "Bearish";
    sentimentColor = "text-red-600 font-semibold";
  }

  return (
    <div className="flex flex-col items-center">
      <div className="gauge-size">
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
            colorArray: ['#CE1F1F', '#00FF15'],
            nbSubArcs: 90,
            padding: 0.01,
            width: 0.4
          }}
          pointer={{
            animationDelay: 0,
            animationDuration: 0,
            strokeWidth: 7
          }}
        />
      </div>
      <div className={`text-[10px] font-semibold text-center mt-1 ${sentimentColor}`}>
        {sentimentText}
      </div>
    </div>
  );
});
MiniGauge.displayName = 'MiniGauge';

// Fundamental Gauge - extracted for memoization
const FundamentalGauge = memo(({ label, score }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] font-medium text-gray-600 mb-1">{label}</span>
      {score !== undefined && score !== null ? (
        <>
          <div className="gauge-size">
            <GaugeComponent
              type="radial"
              style={{ width: '100%', height: '100%' }}
              value={score * 10}
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
                colorArray: ['#CE1F1F', '#F59E0B', '#00FF15'],
                nbSubArcs: 90,
                padding: 0.01,
                width: 0.4
              }}
              pointer={{
                animationDelay: 0,
                animationDuration: 0,
                strokeWidth: 7
              }}
            />
          </div>
          <span className="text-[10px] font-semibold text-gray-700 mt-1">
            {score}/10
          </span>
        </>
      ) : (
        <span className="text-xs text-gray-400 mt-4">N/A</span>
      )}
    </div>
  );
});
FundamentalGauge.displayName = 'FundamentalGauge';

// CoinRow - entire table row extracted as memo component
const CoinRow = memo(({ coin, router, isNewCoin, hasReport, conclusion, loadingReport, setLoadingReport, setSummaryModal, livePrice, livePriceChange }) => {
  const timeframes = ["6hrs", "24hrs", "7days", "30days"];
  const timeframeLabels = ["6hrs", "24hrs", "7days", "30days"];

  // Format live price for tooltip
  const formatPrice = (price) => {
    if (price === "N/A" || price === undefined || price === null) return null;
    const num = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(num)) return null;
    if (num >= 1) return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${num.toFixed(6)}`;
  };

  const formattedPrice = formatPrice(livePrice);
  const changePercent = livePriceChange !== null && livePriceChange !== undefined ? livePriceChange : null;
  const changeSign = changePercent !== null ? (changePercent >= 0 ? '+' : '') : '';

  // Check if all TA_data is null (no live price available)
  const allTANull = !coin.timeframeData?.["6hrs"]?.TA_data && !coin.timeframeData?.["24hrs"]?.TA_data && !coin.timeframeData?.["7days"]?.TA_data;

  return (
    <tr className="group hover:bg-gradient-to-r hover:from-indigo-50/60 hover:via-purple-50/50 hover:to-fuchsia-50/60 transition-all duration-300">
      {/* Coins Column */}
      <td className="px-4 py-4 group-hover:bg-white/50 transition-all duration-300 align-middle border-r border-b border-gray-200">
        <div className="flex flex-col items-center gap-2">
          {coin.image_small && (
            <div className="relative group/coin">
              <img
                src={coin.image_small}
                alt={coin.symbol}
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                onClick={() => router.push(`/coins-list/${coin.source_id}`)}
              />
              {isNewCoin && (
                <div className="absolute -top-1 -left-2 group/newcoin cursor-pointer">
                  <div className="relative inline-flex items-center justify-center h-4 w-4">
                    <FaCertificate className="text-blue-500 w-full h-full drop-shadow-sm" />
                    <span className="absolute text-[8px] font-bold text-white">N</span>
                  </div>
                </div>
              )}
              {/* Live price tooltip on hover */}
              {formattedPrice && (
                <div className="invisible group-hover/coin:visible absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded-md shadow-xl whitespace-nowrap z-50">
                  <div className="font-semibold">{formattedPrice}</div>
                  {changePercent !== null && (
                    <div className={`text-center ${changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {changeSign}{changePercent.toFixed(2)}%
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="text-center">
            <div className="text-xs font-bold text-gray-900">
              {coin.symbol?.toUpperCase()}
            </div>
            <div className="text-[10px] text-gray-500">
              {coin.coin_name?.charAt(0).toUpperCase() + coin.coin_name?.slice(1)}
            </div>
            {coin.mem_coin && (
              <div className="text-[9px] font-semibold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5 mt-1">
                Meme
              </div>
            )}
          </div>
        </div>
      </td>

      {/* No. of Posts Column - Gauges with Post Counts */}
      <td className="px-4 pt-8 pb-4 group-hover:bg-white/50 transition-all duration-300 align-top border-r border-b border-gray-200">
        <div className="flex items-start justify-center gap-7">
          {timeframes.map((tf, tfIndex) => {
            const data = coin.timeframeData[tf] || {};
            const ytPosts = data.yt_mentions || 0;
            const tgPosts = data.tg_mentions || 0;
            const totalPosts = ytPosts + tgPosts;
            const bullish = data.bullish_percent || 0;
            const bearish = data.bearish_percent || 0;

            return (
              <div key={tf} className="flex flex-col items-center">
                <span className="text-[9px] font-medium text-gray-600 mb-1">{timeframeLabels[tfIndex]}</span>
                <div className="relative group/gauge cursor-pointer">
                  <MiniGauge
                    bullishPercent={bullish}
                    bearishPercent={bearish}
                  />
                  <div className="invisible group-hover/gauge:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1.5 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999] flex flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      <FaYoutube className="text-red-500 text-[8px]" />
                      <span className="text-green-600">Bullish: {data.yt_bullish_count || 0}</span>
                      {' | '}
                      <span className="text-red-600">Bearish: {data.yt_bearish_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaTelegramPlane className="text-blue-500 text-[8px]" />
                      <span className="text-green-600">Bullish: {data.tg_bullish_count || 0}</span>
                      {' | '}
                      <span className="text-red-600">Bearish: {data.tg_bearish_count || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-2 gap-0.5">
                  <span className="text-[9px] font-bold text-gray-700">{totalPosts} posts</span>
                  <div className="flex items-center gap-2 text-[8px]">
                    <span className="relative group/yt flex items-center gap-0.5 cursor-pointer">
                      <FaYoutube className="text-red-500 text-[8px]" />
                      <span className="text-gray-600">{ytPosts}</span>
                      <span className="invisible group-hover/yt:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999]">
                        <span className="text-green-600">Bullish: {data.yt_bullish_count || 0}</span>
                        {' | '}
                        <span className="text-red-600">Bearish: {data.yt_bearish_count || 0}</span>
                      </span>
                    </span>
                    <span className="relative group/tg flex items-center gap-0.5 cursor-pointer">
                      <FaTelegramPlane className="text-blue-500 text-[8px]" />
                      <span className="text-gray-600">{tgPosts}</span>
                      <span className="invisible group-hover/tg:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999]">
                        <span className="text-green-600">Bullish: {data.tg_bullish_count || 0}</span>
                        {' | '}
                        <span className="text-red-600">Bearish: {data.tg_bearish_count || 0}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </td>

      {/* Fundamental Column - Display Technology, Team, Market Fit + Overall gauges */}
      <td className="px-4 pt-8 pb-4 group-hover:bg-white/50 transition-all duration-300 align-top border-r border-b border-gray-200">
        {coin.whitepaper_analysis?.technology?.score == null && coin.whitepaper_analysis?.team?.score == null && coin.whitepaper_analysis?.market_fit?.score == null && coin.whitepaper_analysis?.fundamental_score == null ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[9px] font-semibold text-gray-600 text-center leading-relaxed">This coin's fundamental scores will be available after the next system update.</p>
          </div>
        ) : (
          <div className="flex items-start justify-center gap-4">
            <FundamentalGauge label="Technology" score={coin.whitepaper_analysis?.technology?.score} />
            <FundamentalGauge label="Team" score={coin.whitepaper_analysis?.team?.score} />
            <FundamentalGauge label="Market Fit" score={coin.whitepaper_analysis?.market_fit?.score} />
            <FundamentalGauge label="Overall" score={coin.whitepaper_analysis?.fundamental_score} />
          </div>
        )}
      </td>

      {/* Technical Analysis Column */}
      <td className="px-4 pt-8 pb-4 group-hover:bg-white/50 transition-all duration-300 align-top border-r border-b border-gray-200">
        <div className="flex items-start justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold text-gray-600 flex items-center gap-0.5">
              Short Term
              <span className="relative group/st cursor-pointer">
                <span className="text-gray-400 text-[10px]">ⓘ</span>
                <span className="invisible group-hover/st:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999]">
                  {coin.timeframeData?.["6hrs"]?.TA_data ? "1 day candles" : "Price not available from the Binance"}
                </span>
              </span>
            </span>
            {coin.timeframeData?.["6hrs"]?.TA_data ? (
              <SimpleTAGauge taData={coin.timeframeData["6hrs"].TA_data} />
            ) : (
              <MiniGauge bullishPercent={0} bearishPercent={0} />
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold text-gray-600 flex items-center gap-0.5">
              Mid Term
              <span className="relative group/mt cursor-pointer">
                <span className="text-gray-400 text-[10px]">ⓘ</span>
                <span className="invisible group-hover/mt:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999]">
                  {coin.timeframeData?.["24hrs"]?.TA_data ? "1 week candles" : "Price not available from the Binance"}
                </span>
              </span>
            </span>
            {coin.timeframeData?.["24hrs"]?.TA_data ? (
              <SimpleTAGauge taData={coin.timeframeData["24hrs"].TA_data} />
            ) : (
              <MiniGauge bullishPercent={0} bearishPercent={0} />
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold text-gray-600 flex items-center gap-0.5">
              Long Term
              <span className="relative group/lt cursor-pointer">
                <span className="text-gray-400 text-[10px]">ⓘ</span>
                <span className="invisible group-hover/lt:visible absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[8px] px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap z-[9999]">
                  {coin.timeframeData?.["7days"]?.TA_data ? "1 month candles" : "Price not available from the Binance"}
                </span>
              </span>
            </span>
            {coin.timeframeData?.["7days"]?.TA_data ? (
              <SimpleTAGauge taData={coin.timeframeData["7days"].TA_data} />
            ) : (
              <MiniGauge bullishPercent={0} bearishPercent={0} />
            )}
          </div>
        </div>
      </td>

      {/* MCM Analysis Column - View and Download Report */}
      <td className="px-4 pt-8 pb-4 text-center group-hover:bg-white/50 transition-all duration-300 align-top border-b border-gray-200">
        {allTANull && !hasReport ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[9px] font-semibold text-gray-600 text-center leading-relaxed">Live Price is not available therefore can't generate MCM Signal Report</p>
          </div>
        ) : hasReport ? (
          <div className="flex flex-col items-center gap-1.5">
            {conclusion?.summary && (
              <div className="text-[9px] font-semibold text-gray-600 text-justify leading-relaxed">
                <span>{conclusion.summary.split(/\s+/).slice(0, 40).join(' ')}... </span>
                <button
                  onClick={() => {
                    setSummaryModal({
                      coin: coin.symbol?.toUpperCase() || coin.coin_name,
                      image: coin.image_small,
                      summary: conclusion.summary,
                      risk_level: conclusion.risk_level,
                      recommendation: conclusion.recommendation
                    });
                  }}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors"
                >
                  Read more
                </button>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <button
                onClick={async () => {
                  const coinId = coin.source_id || coin.symbol;
                  setLoadingReport(`view-${coinId}`);
                  try {
                    const res = await fetch(`/api/admin/coinindex/mcmsignals?source_id=${encodeURIComponent(coinId)}`);
                    const data = await res.json();
                    if (data?.success) {
                      sessionStorage.setItem(`mcm_report_${coinId}`, JSON.stringify(data));
                    }
                  } catch (e) { /* navigate anyway */ }
                  router.push(`/document?coin=${coinId}`);
                }}
                disabled={!!loadingReport}
                title="View Report"
                className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-md hover:shadow-lg hover:scale-110 transition-all duration-300 disabled:opacity-70 disabled:scale-100"
              >
                {loadingReport === `view-${coin.source_id || coin.symbol}` ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-cyan-300 border-t-2 border-t-white"></div>
                ) : (
                  <FaEye className="text-[9px]" />
                )}
              </button>
              <button
                onClick={async () => {
                  const coinId = coin.source_id || coin.symbol;
                  setLoadingReport(`download-${coinId}`);
                  try {
                    const res = await fetch(`/api/admin/coinindex/mcmsignals?source_id=${encodeURIComponent(coinId)}`);
                    const data = await res.json();
                    if (data?.success) {
                      sessionStorage.setItem(`mcm_report_${coinId}`, JSON.stringify(data));
                    }
                  } catch (e) { /* navigate anyway */ }
                  router.push(`/document?coin=${coinId}&download=true`);
                }}
                disabled={!!loadingReport}
                title="Download Report"
                className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-md hover:shadow-lg hover:scale-110 transition-all duration-300 disabled:opacity-70 disabled:scale-100"
              >
                {loadingReport === `download-${coin.source_id || coin.symbol}` ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-cyan-300 border-t-2 border-t-white"></div>
                ) : (
                  <FaDownload className="text-[9px]" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[9px] font-semibold text-gray-600 text-justify leading-relaxed">This coin's summary will be available after the next system update.</p>
        )}
      </td>
    </tr>
  );
});
CoinRow.displayName = 'CoinRow';

// ─── Main Page Component ───

export default function CoinsNewPage() {
  const router = useRouter();
  const [coinsData, setCoinsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coinSymbols, setCoinSymbols] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [coinsWithReports, setCoinsWithReports] = useState(new Set());
  const [reportConclusions, setReportConclusions] = useState({}); // { source_id: { summary, risk_level, recommendation } }
  // const [visibleCount, setVisibleCount] = useState(4);
  const [loadingReport, setLoadingReport] = useState(null); // tracks "view-source_id" or "download-source_id"
  const [summaryModal, setSummaryModal] = useState(null); // { coin, summary, risk_level, recommendation }
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 5;

  // Use timezone context for local/UTC time switching
  const { formatDate, useLocalTime, toggleTimezone, userTimezone } = useTimezone();

  // Get city name from timezone
  const userCity = userTimezone ? userTimezone.split('/').pop().replace(/_/g, ' ') : 'Local Time';

  // Use live price hook
  const { prices, priceChanges } = useCoinsLivePrice(coinSymbols);

  // Create a live prices map
  const livePricesMap = useMemo(() => {
    const pricesMap = {};
    Object.entries(prices).forEach(([symbolKey, price]) => {
      const baseSymbol = symbolKey.replace('USDT', '');
      pricesMap[baseSymbol] = price;
    });
    return pricesMap;
  }, [prices]);

  // Create a live price changes map
  const livePriceChangesMap = useMemo(() => {
    const changesMap = {};
    Object.entries(priceChanges).forEach(([symbolKey, change]) => {
      const baseSymbol = symbolKey.replace('USDT', '');
      changesMap[baseSymbol] = change;
    });
    return changesMap;
  }, [priceChanges]);

  // Fetch both coins data and document data together
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both APIs in parallel
        const [coinsResponse, mcmSignalsResponse] = await Promise.all([
          fetch('/api/admin/strategyyoutubedata/ytandtg'),
          fetch('/api/admin/coinindex/mcmsignals?listOnly=true')
        ]);

        // Process coins data
        const coinsDataResult = await coinsResponse.json();
        setCoinsData(coinsDataResult);

        // Extract lastUpdated from the 6hrs timeframe
        const resultsByTimeframe = coinsDataResult.resultsByTimeframe || coinsDataResult;
        if (resultsByTimeframe && resultsByTimeframe["6hrs"] && resultsByTimeframe["6hrs"].dateRange) {
          const toTimeStr = resultsByTimeframe["6hrs"].dateRange.to;
          const [datePart, timePart] = toTimeStr.split(' ');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);
          const lastUpdatedTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          setLastUpdated(lastUpdatedTime);
        }

        // Process mcmsignals list data for coins with reports
        if (mcmSignalsResponse.ok) {
          const mcmSignalsData = await mcmSignalsResponse.json();
          if (mcmSignalsData.success && mcmSignalsData.results) {
            const reportsSet = new Set();
            const conclusions = {};
            mcmSignalsData.results.forEach(coin => {
              if (coin.source_id) {
                reportsSet.add(coin.source_id.toUpperCase());
              }
              if (coin.name) {
                reportsSet.add(coin.name.toUpperCase());
              }
              // Extract conclusion from pdf_report
              if (coin.source_id && coin.pdf_report?.conclusion) {
                conclusions[coin.source_id.toUpperCase()] = coin.pdf_report.conclusion;
              }
            });
            setCoinsWithReports(reportsSet);
            setReportConclusions(conclusions);
          }
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Get top 10 coins from each timeframe and merge to unique list
  const uniqueCoins = useMemo(() => {
    if (!coinsData) return [];

    const resultsByTimeframe = coinsData.resultsByTimeframe || coinsData;
    const timeframes = ["6hrs", "24hrs", "7days", "30days"];
    const allCoinsMap = new Map();

    // First pass: Collect unique coins from top 10 of each timeframe
    timeframes.forEach(timeframe => {
      if (!resultsByTimeframe || !resultsByTimeframe[timeframe]) return;

      const allCoins = resultsByTimeframe[timeframe].all_coins || [];
      const memCoins = resultsByTimeframe[timeframe].mem_coins || [];
      const combined = [...allCoins, ...memCoins];

      // Sort by total_mentions and take top 10
      combined.sort((a, b) => (b.total_mentions || 0) - (a.total_mentions || 0));
      const top10 = combined.slice(0, 10);

      // Add coins to map
      top10.forEach(coin => {
        const symbol = coin.symbol;
        if (!allCoinsMap.has(symbol)) {
          allCoinsMap.set(symbol, {
            ...coin,
            timeframeData: {}
          });
        }
      });
    });

    // Second pass: For each unique coin, collect data from ALL timeframes
    allCoinsMap.forEach((coinData, symbol) => {
      timeframes.forEach(timeframe => {
        if (!resultsByTimeframe || !resultsByTimeframe[timeframe]) return;

        const allCoins = resultsByTimeframe[timeframe].all_coins || [];
        const memCoins = resultsByTimeframe[timeframe].mem_coins || [];
        const combined = [...allCoins, ...memCoins];

        // Find this coin in the current timeframe data
        const coinInTimeframe = combined.find(c => c.symbol === symbol);

        if (coinInTimeframe) {
          // Store data for this timeframe
          coinData.timeframeData[timeframe] = {
            total_mentions: coinInTimeframe.total_mentions || 0,
            yt_mentions: coinInTimeframe.yt_total_mentions || coinInTimeframe.yt_mentions || 0,
            tg_mentions: coinInTimeframe.tg_total_mentions || coinInTimeframe.tg_mentions || 0,
            bullish_percent: coinInTimeframe.bullish_percent || 0,
            bearish_percent: coinInTimeframe.bearish_percent || 0,
            yt_bullish_count: coinInTimeframe.yt_bullish_count || 0,
            yt_bearish_count: coinInTimeframe.yt_bearish_count || 0,
            tg_bullish_count: coinInTimeframe.tg_bullish_count || 0,
            tg_bearish_count: coinInTimeframe.tg_bearish_count || 0,
            yt_tg_bullish_short_term_percent: coinInTimeframe.yt_tg_bullish_short_term_percent || 0,
            yt_tg_bearish_short_term_percent: coinInTimeframe.yt_tg_bearish_short_term_percent || 0,
            yt_tg_bullish_long_term_percent: coinInTimeframe.yt_tg_bullish_long_term_percent || 0,
            yt_tg_bearish_long_term_percent: coinInTimeframe.yt_tg_bearish_long_term_percent || 0,
            TA_data: coinInTimeframe.TA_data
          };
        } else {
          // Coin doesn't exist in this timeframe, set empty data
          coinData.timeframeData[timeframe] = {
            total_mentions: 0,
            yt_mentions: 0,
            tg_mentions: 0,
            bullish_percent: 0,
            bearish_percent: 0,
            yt_bullish_count: 0,
            yt_bearish_count: 0,
            tg_bullish_count: 0,
            tg_bearish_count: 0,
            yt_tg_bullish_short_term_percent: 0,
            yt_tg_bearish_short_term_percent: 0,
            yt_tg_bullish_long_term_percent: 0,
            yt_tg_bearish_long_term_percent: 0,
            TA_data: null
          };
        }
      });
    });

    // Sort coins by total_mentions: 6hrs first, then 24hrs, 7days, 30days as tiebreakers
    const coins = Array.from(allCoinsMap.values());
    coins.sort((a, b) => {
      const a6 = a.timeframeData["6hrs"]?.total_mentions || 0;
      const b6 = b.timeframeData["6hrs"]?.total_mentions || 0;
      if (b6 !== a6) return b6 - a6;

      const a24 = a.timeframeData["24hrs"]?.total_mentions || 0;
      const b24 = b.timeframeData["24hrs"]?.total_mentions || 0;
      if (b24 !== a24) return b24 - a24;

      const a7d = a.timeframeData["7days"]?.total_mentions || 0;
      const b7d = b.timeframeData["7days"]?.total_mentions || 0;
      if (b7d !== a7d) return b7d - a7d;

      const a30 = a.timeframeData["30days"]?.total_mentions || 0;
      const b30 = b.timeframeData["30days"]?.total_mentions || 0;
      return b30 - a30;
    });

    return coins;
  }, [coinsData]);

  // Paginate coins - 5 per page
  const totalPages = Math.ceil(uniqueCoins.length / coinsPerPage);
  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const visibleCoins = uniqueCoins.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);
    if (endPage - startPage < maxPagesToShow - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Stabilize coinSymbols - only update when actual symbols change (prevents WebSocket reconnection loops)
  const prevSymbolsRef = React.useRef('');
  useEffect(() => {
    const symbols = visibleCoins.map(coin => coin.symbol).filter(Boolean);
    const key = symbols.join(',');
    if (key !== prevSymbolsRef.current) {
      prevSymbolsRef.current = key;
      setCoinSymbols(symbols);
    }
  }, [visibleCoins]);

  // Helper function to get live price
  const getLivePrice = useCallback((symbol) => {
    if (!symbol) return "N/A";
    const upperSymbol = symbol.toUpperCase();
    const livePrice = livePricesMap[upperSymbol];
    if (livePrice && livePrice !== "-") {
      return typeof livePrice === 'number' ? livePrice : parseFloat(livePrice);
    }
    return "N/A";
  }, [livePricesMap]);

  const getLivePriceChange = useCallback((symbol) => {
    if (!symbol) return null;
    const upperSymbol = symbol.toUpperCase();
    return livePriceChangesMap[upperSymbol] || null;
  }, [livePriceChangesMap]);

  // Check if coin is new in last 6 hours
  const isNewCoin = useCallback((coin) => {
    if (!coinsData || !coinsData.notifications || !coinsData.notifications.new_coins) {
      return false;
    }
    const newCoins = coinsData.notifications.new_coins;
    return newCoins.some(newCoin =>
      newCoin.source_id === coin.source_id ||
      newCoin.symbol?.toLowerCase() === coin.symbol?.toLowerCase()
    );
  }, [coinsData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-fuchsia-50 text-gray-900 font-sans overflow-x-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="mx-auto px-4 pb-8 max-w-full overflow-x-hidden relative z-10">
        <div className="min-w-0 overflow-x-hidden">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-white/80 via-indigo-50/60 to-fuchsia-50/60 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-500/10 border-2 border-white/40">
            {/* Header Section */}
            <div className="px-6 py-4 border-b border-indigo-200/30 bg-gradient-to-r from-cyan-50/50 to-fuchsia-50/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left: Header Title */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold flex items-center gap-3 drop-shadow-sm">
                    <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent leading-normal inline-block">
                      Trending Coins
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full flex-shrink-0 mt-1 shadow-lg shadow-indigo-500/50"></div>
                </div>

                {/* Right: Timezone Switch */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {!useLocalTime && (
                      <span className="text-xs font-medium text-gray-700">UTC</span>
                    )}
                    <button
                      onClick={() => toggleTimezone()}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg ${useLocalTime ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-indigo-500/50' : 'bg-gray-300'}`}
                      role="switch"
                      aria-checked={useLocalTime}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${useLocalTime ? 'translate-x-5 shadow-indigo-300' : 'translate-x-0.5'}`} />
                    </button>
                    {useLocalTime && (
                      <span className="text-xs font-medium text-gray-700">{userCity || 'Local'}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900">
                    Update: {lastUpdated ? formatDate(lastUpdated) : "N/A"}
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Info icon with hover tooltip */}
                    <div className="relative group/info cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="invisible group-hover/info:visible absolute top-full right-0 mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-[9999]">
                        N/A: price change is not available
                      </div>
                    </div>
                    {/* New mention legend */}
                    <div className="flex items-center gap-1.5">
                      <div className="relative inline-flex items-center justify-center h-5 w-5">
                        <FaCertificate className="text-blue-500 w-full h-full drop-shadow-sm" />
                        <span className="absolute text-[8px] font-bold text-white">N</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-600">New mention in last 6 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              {/* <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6B8CAE' }}></div>
                  <FaYoutube className="text-red-600" />
                  <span>YouTube</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C1D9ED' }}></div>
                  <FaTelegramPlane className="text-blue-600" />
                  <span>Telegram</span>
                </div>
              </div> */}
              <div className="mt-4">
                <TrendingCoinScroller notifications={coinsData?.notifications} />
              </div>
            </div>

            {/* Pagination Top */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, uniqueCoins.length)}</span> of{" "}
                  <span className="font-medium">{uniqueCoins.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-b-3xl">
              <table className="w-full table-fixed border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-500 to-indigo-500">
                    {/* Coins */}
                    <th className="px-4 py-3 text-center text-xs font-bold text-white tracking-wide align-middle w-[7%] border-r border-white/20">
                      Coins
                    </th>
                    {/* No. of Posts */}
                    <th className="px-4 py-3 text-center text-xs font-bold text-white tracking-wide align-middle w-[30%] border-r border-white/20">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <span>Social Media Sentiments</span>
                          <span className="relative group/info cursor-pointer">
                            <span className="text-white/80 text-[10px]">ⓘ</span>
                            <span className="invisible group-hover/info:visible absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-[9999]">
                              Hover over YouTube or Telegram counts to see bullish and bearish calls
                            </span>
                          </span>
                        </div>
                      </div>
                    </th>
                    {/* Fundamental */}
                    <th className="px-4 py-3 text-center text-xs font-bold text-white tracking-wide align-middle w-[23%] border-r border-white/20">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <span>Coin Fundamental Analysis</span>
                          <span className="relative group/fa cursor-pointer">
                            <span className="text-white/80 text-[10px]">ⓘ</span>
                            <div className="invisible group-hover/fa:visible absolute top-full mt-1 right-0 bg-gray-800 text-white text-[9px] px-4 py-3 rounded-lg shadow-xl z-[9999] w-[320px] whitespace-normal text-left leading-relaxed space-y-2">
                              <p><span className="font-bold text-white">Technology:</span> Core technical design, security model, scalability, and how the system works and operates.</p>
                              <p><span className="font-bold text-white">Team:</span> The people and contributors building, maintaining, and improving the project, including their expertise and governance structure.</p>
                              <p><span className="font-bold text-white">Market Fit:</span> How well the product solves real market needs and its level of adoption, demand, and practical use.</p>
                              <p><span className="font-bold text-white">Overall:</span> Combined assessment of technology, team strength, and market adoption to indicate the project's total viability.</p>
                            </div>
                          </span>
                        </div>
                      </div>
                    </th>
                    {/* Technical Analysis */}
                    <th className="px-4 py-3 text-center text-xs font-bold text-white tracking-wide align-middle w-[22%] border-r border-white/20">
                      <div className="flex flex-col items-center gap-1">
                        <span>Technical Indicators</span>
                      </div>
                    </th>
                    {/* MCM Analysis */}
                    <th className="px-4 py-3 text-center text-xs font-bold text-white tracking-wide align-middle w-[18%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <span>MCM Summary</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-br from-white/80 via-indigo-50/40 to-fuchsia-50/40 backdrop-blur-sm divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 border-t-4 border-t-cyan-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-red-600 font-semibold">
                        {error}
                      </td>
                    </tr>
                  ) : uniqueCoins.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                        No coins data available
                      </td>
                    </tr>
                  ) : (
                    visibleCoins.map((coin, index) => {
                      const hasReport = coinsWithReports.has(coin.symbol?.toUpperCase()) || coinsWithReports.has(coin.source_id?.toUpperCase());
                      const conclusion = reportConclusions[coin.source_id?.toUpperCase()] || null;
                      return (
                        <CoinRow
                          key={coin.symbol || index}
                          coin={coin}
                          router={router}
                          isNewCoin={isNewCoin(coin)}
                          hasReport={hasReport}
                          conclusion={conclusion}
                          loadingReport={loadingReport}
                          setLoadingReport={setLoadingReport}
                          setSummaryModal={setSummaryModal}
                          livePrice={getLivePrice(coin.symbol)}
                          livePriceChange={getLivePriceChange(coin.symbol)}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, uniqueCoins.length)}</span> of{" "}
                  <span className="font-medium">{uniqueCoins.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Summary Modal */}
      {summaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSummaryModal(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-indigo-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {summaryModal.image && (
                  <img src={summaryModal.image} alt={summaryModal.coin} className="w-8 h-8 rounded-full border-2 border-white/50" />
                )}
                <h3 className="text-white font-bold text-lg">{summaryModal.coin} - Research Summary</h3>
              </div>
              <button
                onClick={() => setSummaryModal(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-2">Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">{summaryModal.summary}</p>
              </div>
              {summaryModal.risk_level && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-1">Risk Level</h4>
                  <p className="text-sm text-gray-600 text-justify">{summaryModal.risk_level}</p>
                </div>
              )}
              {summaryModal.recommendation && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-1">Recommendation</h4>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">{summaryModal.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Gauge Sizes */}
      <style jsx global>{`
        .gauge-size {
          width: 50px;
          height: 50px;
        }

        @media (min-width: 1441px) {
          .gauge-size {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      {/* Segmented Bar Styles */}
      <style jsx>{`
        .segmented-bar-container {
          position: relative;
          width: 100px;
          height: 8px;
          border-radius: 4px;
          overflow: visible;
        }

        .segmented-bar-background {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .segmented-bar-background-gray {
          display: block;
          width: 100px;
          height: 8px;
          background: linear-gradient(to right, #9ca3af 0%, #6b7280 33%, #4b5563 66%, #374151 100%) !important;
          border-radius: 4px;
          position: relative;
        }

        .segment {
          flex: 1;
          height: 100%;
        }

        .segment-red {
          background-color: #ef4444;
        }

        .segment-yellow {
          background-color: #f59e0b;
        }

        .segment-green {
          background-color: #10b981;
        }

        .segment-gray-light {
          background-color: #9ca3af !important;
        }

        .segment-gray-medium {
          background-color: #6b7280 !important;
        }

        .segment-gray-dark {
          background-color: #4b5563 !important;
        }

        .percentage-ball {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border-width: 2px;
          border-style: solid;
        }

        .percentage-ball-gray {
          position: absolute;
          top: -2px;
          width: 12px;
          height: 12px;
          background-color: #e5e7eb;
          border: 2px solid #9ca3af;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
