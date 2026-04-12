/**
 * Yahoo Finance Service
 * Uses the public Yahoo Finance v8 API (no key needed for basic quote).
 * Falls back to RapidAPI key for search if configured.
 *
 * Endpoints used:
 *   Quote:  https://query1.finance.yahoo.com/v8/finance/chart/{ticker}
 *   Search: https://query1.finance.yahoo.com/v1/finance/search?q={query}
 */

/**
 * Yahoo Finance Service - Fixed for Currency and UK Pence (GBX)
 */
import axios from 'axios';
import { logger } from '../lib/logger.js';
import { cacheGet, cacheSet, TTL } from '../lib/redis.js';

const YF_BASE = 'https://query1.finance.yahoo.com';

const yfClient = axios.create({
  baseURL: YF_BASE,
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobalWealthTracker/1.0)' },
});

export async function searchYahoo(query) {
  const cacheKey = `yf:search:${query.toLowerCase()}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const response = await yfClient.get('/v1/finance/search', {
    params: { q: query, quotesCount: 20, newsCount: 0, enableFuzzyQuery: true },
  });

  const quotes = response.data?.quotes || [];

  const relevant = quotes
    .filter(q => ['EQUITY', 'ETF', 'MUTUALFUND'].includes(q.quoteType))
    .map(q => ({
      id: `GL-${q.symbol}`,
      region: 'GLOBAL',
      ticker: q.symbol,
      name: q.longname || q.shortname,
      amc: q.exchDisp || q.exchange || 'Global',
      category: q.quoteType,
      exchange: q.exchange,
      currency: q.currency === 'GBX' ? 'GBP' : (q.currency || 'USD'),
    }));

  await cacheSet(cacheKey, relevant, TTL.SEARCH);
  return relevant;
}

export async function getYahooQuote(ticker) {
  const cacheKey = `yf:quote:${ticker}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const response = await yfClient.get(`/v8/finance/chart/${ticker}`, {
    params: { interval: '1d', range: '1d' },
  });

  const result = response.data?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ticker ${ticker}`);

  const meta = result.meta;
  let price = meta.regularMarketPrice ?? meta.previousClose;
  let currency = (meta.currency || 'USD').toUpperCase();

  // FIX: Handle London Stock Exchange "Pence" (GBX)
  if (currency === 'GBX') {
    price = price / 100;
    currency = 'GBP';
  }

  const quote = {
    ticker,
    price: price,
    currency: currency,
    exchangeName: meta.exchangeName,
    navDate: new Date().toISOString().split('T')[0],
  };

  await cacheSet(cacheKey, quote, TTL.NAV);
  return quote;
}

/**
 * ADDED: This function was missing from the export, 
 * which caused the navSync job to fail.
 */
export async function getBatchQuotes(tickers) {
  const results = await Promise.allSettled(tickers.map(t => getYahooQuote(t)));
  const map = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      map[tickers[i]] = r.value;
    } else {
      logger.warn(`Quote failed for ${tickers[i]}: ${r.reason?.message}`);
    }
  });
  return map;
}
