"use client";
import { useState, useEffect, useRef } from "react";

// Maximum streams per WebSocket connection (Binance limit)
const MAX_STREAMS = 1024;

/**
 * Helper function to batch an array into chunks of specified size
 * @param {Array} arr - Array to batch
 * @param {number} size - Size of each batch
 * @returns {Array} Array of batches
 */
function batchArray(arr, size) {
  const batches = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

export const useTop10LivePrice = () => {
  const [coinData, setCoinData] = useState([]);
  const [prices, setPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [bidAskData, setBidAskData] = useState({});
  const [volumeData, setVolumeData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [validUSDTPairs, setValidUSDTPairs] = useState(new Set());
  const wsRefsArray = useRef([]);

  // Fetch top 10 coins from Binance and validate USDT pairs (SOLUTION from AppOld.js)
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Step 1: Fetch exchangeInfo to get all valid USDT pairs (AppOld.js line 53-60)
        const resInfo = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const exchangeInfo = await resInfo.json();

        const usdtPairs = new Set();
        exchangeInfo.symbols.forEach(s => {
          if (s.quoteAsset === "USDT" && s.status === "TRADING") {
            usdtPairs.add(s.symbol);
          }
        });

        setValidUSDTPairs(usdtPairs);
        console.log(`✅ Binance: Loaded ${usdtPairs.size} valid USDT trading pairs`);

        // Step 2: Fetch top 10 USDT pairs by volume from Binance (AppOld.js line 63-64)
        const binanceRes = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const binanceData = await binanceRes.json();

        // Filter only USDT pairs that exist in our valid pairs set
        const top10Coins = binanceData
          .filter((coin) => usdtPairs.has(coin.symbol)) // Only valid USDT pairs
          .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
          .slice(0, 10)
          .map((coin) => coin.symbol.replace("USDT", "").toLowerCase());

        // Step 3: Fetch additional data from your backend
        const symbols = top10Coins.join(",");
        const res = await fetch(`/api/top10-coins?symbols=${symbols}`);
        const data = await res.json();

        if (data.success) {
          setCoinData(data.coins);
        } else {
          throw new Error("Failed to fetch coins");
        }
      } catch (err) {
        console.error("Failed to fetch coin data:", err);
        // Fallback data
        setCoinData([
          { symbol: "BTC", name: "Bitcoin", price: 0, image: "", priceChange24h: 0 },
          { symbol: "ETH", name: "Ethereum", price: 0, image: "", priceChange24h: 0 },
          { symbol: "BNB", name: "BNB", price: 0, image: "", priceChange24h: 0 },
          { symbol: "XRP", name: "XRP", price: 0, image: "", priceChange24h: 0 },
          { symbol: "ADA", name: "Cardano", price: 0, image: "", priceChange24h: 0 },
          { symbol: "DOGE", name: "Dogecoin", price: 0, image: "", priceChange24h: 0 },
          { symbol: "SOL", name: "Solana", price: 0, image: "", priceChange24h: 0 },
          { symbol: "DOT", name: "Polkadot", price: 0, image: "", priceChange24h: 0 },
          { symbol: "MATIC", name: "Polygon", price: 0, image: "", priceChange24h: 0 },
          { symbol: "LTC", name: "Litecoin", price: 0, image: "", priceChange24h: 0 },
        ]);
      }
    };

    fetchCoinData();
  }, []);

  // Connect WebSocket for live prices with batching support (based on AppOld.js implementation)
  useEffect(() => {
    // Wait until we have both coin data and valid USDT pairs
    if (coinData.length === 0 || validUSDTPairs.size === 0) return;

    // Close all previous WebSocket connections
    wsRefsArray.current.forEach(ws => {
      if (ws) ws.close();
    });
    wsRefsArray.current = [];

    // Prepare symbols with USDT suffix and filter ONLY valid ones (AppOld.js line 64)
    const requestedSymbols = coinData.map((c) => `${c.symbol.toUpperCase()}USDT`);
    const validSymbols = requestedSymbols.filter(symbol => validUSDTPairs.has(symbol));

    // Log invalid symbols for debugging
    const invalidSymbols = requestedSymbols.filter(symbol => !validUSDTPairs.has(symbol));
    if (invalidSymbols.length > 0) {
      console.warn(`⚠️ Top10: ${invalidSymbols.length} symbols don't have USDT pairs on Binance:`,
        invalidSymbols.join(", ")
      );
    }

    if (validSymbols.length === 0) {
      console.warn("⚠️ No valid USDT pairs to subscribe to");
      return;
    }

    // SOLUTION: Fetch initial prices from REST API before WebSocket (AppOld.js line 63-72)
    const fetchInitialPrices = async () => {
      try {
        console.log(`🔄 Fetching initial prices for symbols:`, validSymbols);
        const resPrice = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const allTicker = await resPrice.json();

        console.log(`📊 Received ${allTicker.length} tickers from Binance`);

        // Filter to only our valid symbols
        const initialPrices = {};
        const initialPriceChanges = {};
        const initialBidAsk = {};
        const initialVolume = {};

        allTicker.forEach(ticker => {
          if (validSymbols.includes(ticker.symbol)) {
            initialPrices[ticker.symbol] = parseFloat(ticker.lastPrice);
            initialPriceChanges[ticker.symbol] = parseFloat(ticker.priceChangePercent);
            initialBidAsk[ticker.symbol] = {
              bidPrice: parseFloat(ticker.bidPrice),
              bidQty: parseFloat(ticker.bidQty),
              askPrice: parseFloat(ticker.askPrice),
              askQty: parseFloat(ticker.askQty),
            };
            initialVolume[ticker.symbol] = {
              volume: parseFloat(ticker.volume),
              quoteVolume: parseFloat(ticker.quoteVolume),
              priceChange: parseFloat(ticker.priceChange),
              priceChangePercent: parseFloat(ticker.priceChangePercent),
            };
          }
        });

        console.log(`💰 Initial prices loaded:`, initialPrices);
        console.log(`📈 Initial price changes loaded:`, initialPriceChanges);

        // Set initial state before WebSocket connects
        setPrices(initialPrices);
        setPriceChanges(initialPriceChanges);
        setBidAskData(initialBidAsk);
        setVolumeData(initialVolume);

        console.log(`✅ Loaded initial prices for ${Object.keys(initialPrices).length} coins from REST API`);
      } catch (error) {
        console.error("❌ Failed to fetch initial prices:", error);
      }
    };

    fetchInitialPrices();

    const symbolsLower = validSymbols.map(s => s.toLowerCase());

    // Batch symbols into groups of MAX_STREAMS (1024)
    const batches = batchArray(symbolsLower, MAX_STREAMS);

    console.log(`✅ Connecting WebSocket (Top10) for ${validSymbols.length}/${requestedSymbols.length} valid USDT pairs in ${batches.length} batch(es)`);

    // Create a WebSocket connection for each batch
    batches.forEach((batch, batchIndex) => {
      const streams = batch.map(s => `${s}@ticker`).join("/");
      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      wsRefsArray.current.push(ws);

      ws.onopen = () => {
        console.log(`📡 Binance WebSocket (Top10) batch ${batchIndex + 1}/${batches.length} connected (${batch.length} streams)`);
        setIsConnected(true);
      };

      ws.onclose = () => {
        console.log(`🔌 Binance WebSocket (Top10) batch ${batchIndex + 1} disconnected`);
        // Only set disconnected if ALL connections are closed
        const allClosed = wsRefsArray.current.every(socket => socket.readyState === WebSocket.CLOSED);
        if (allClosed) {
          setIsConnected(false);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ Binance WebSocket (Top10) batch ${batchIndex + 1} error:`, error);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg?.data?.s && msg?.data?.c) {
            const symbol = msg.data.s;

            // Only process USDT pairs (extra safety check)
            if (!symbol.endsWith('USDT')) {
              return;
            }

            // Update prices state
            setPrices((prev) => ({
              ...prev,
              [symbol]: parseFloat(msg.data.c),
            }));

            // Update price changes state
            setPriceChanges((prev) => ({
              ...prev,
              [symbol]: parseFloat(msg.data.P),
            }));

            // Capture bid/ask prices and quantities
            setBidAskData((prev) => ({
              ...prev,
              [symbol]: {
                bidPrice: msg.data.b ? parseFloat(msg.data.b) : null,
                bidQty: msg.data.B ? parseFloat(msg.data.B) : null,
                askPrice: msg.data.a ? parseFloat(msg.data.a) : null,
                askQty: msg.data.A ? parseFloat(msg.data.A) : null,
              }
            }));

            // Capture volume and price change data
            setVolumeData((prev) => ({
              ...prev,
              [symbol]: {
                volume: msg.data.v ? parseFloat(msg.data.v) : null, // 24h volume
                quoteVolume: msg.data.q ? parseFloat(msg.data.q) : null, // 24h quote volume
                priceChange: msg.data.p ? parseFloat(msg.data.p) : null, // 24h price change
                priceChangePercent: msg.data.P ? parseFloat(msg.data.P) : null, // 24h price change %
              }
            }));
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };
    });

    // Cleanup function - close all WebSocket connections on unmount
    return () => {
      wsRefsArray.current.forEach(ws => {
        if (ws) ws.close();
      });
    };
  }, [coinData, validUSDTPairs]);

  // Compose live top 10 data with images and names
  const top10Data = coinData.map((coin) => {
    const symbolKey = `${coin.symbol.toUpperCase()}USDT`;
    const livePrice = prices[symbolKey];
    const livePriceChange = priceChanges[symbolKey];

    return {
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      price: livePrice || coin.price || "-",
      priceChange24h: livePriceChange || coin.priceChange24h || 0,
    };
  });

  // Return the actual data including bid/ask data and volume data
  return { top10Data, isConnected, bidAskData, volumeData };
};
