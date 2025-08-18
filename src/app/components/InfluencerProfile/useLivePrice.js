// useLivePrice.js
import { useState, useEffect, useRef } from 'react';

export const useLivePrice = (symbols = []) => {
  const [prices, setPrices] = useState({});
  const [binanceSymbols, setBinanceSymbols] = useState(new Set());
  const wsRef = useRef(null);

  // Fetch Binance symbols
  useEffect(() => {
    const fetchBinanceSymbols = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        const data = await response.json();
        const symbolSet = new Set(
          data.symbols.filter(s => s.status === 'TRADING').map(s => s.symbol)
        );
        setBinanceSymbols(symbolSet);
      } catch (error) {
        console.error('Failed to fetch Binance symbols:', error);
      }
    };
    fetchBinanceSymbols();
  }, []);

  // Setup WebSocket for live price
  useEffect(() => {
    if (symbols.length === 0 || binanceSymbols.size === 0) return;

    const validSymbols = symbols.filter(symbol =>
      binanceSymbols.has(symbol) || binanceSymbols.has(symbol + 'USDT')
    );

    if (validSymbols.length === 0) return;

    if (wsRef.current) wsRef.current.close();

    const streams = validSymbols
      .map(symbol => {
        const binanceSymbol = binanceSymbols.has(symbol) ? symbol : symbol + 'USDT';
        return `${binanceSymbol.toLowerCase()}@ticker`;
      })
      .join('/');

    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    wsRef.current.onmessage = (event) => {
      try {
        const { data } = JSON.parse(event.data);
        if (data && data.s && data.c) {
          setPrices(prev => ({ ...prev, [data.s]: parseFloat(data.c) }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbols, binanceSymbols]);

  const getPriceData = (symbol) => {
    const livePrice = prices[symbol] || prices[symbol + 'USDT'];
    return livePrice ? { price: livePrice, isLive: true } : { price: null, isLive: false };
  };

  const formatPrice = (symbol) => {
    const priceData = getPriceData(symbol);
    if (!priceData.price) return '-';
    return `${priceData.price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })}`;
  };

  return { formatPrice, getPriceData };
};
