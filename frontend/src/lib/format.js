/**
 * Universal Currency Formatter
 * Uses en-GB locale for better support of £, €, and $ formatting.
 */
export function fmtCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—';
  
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    return `${currency} ${value}`;
  }
}

/**
 * Specifically for Indian Rupee formatting
 */
export function fmtINR(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Specifically for USD formatting 
 * (Added to fix the PortfolioPage.jsx build error)
 */
export function fmtUSD(n) {
  return fmtCurrency(n, 'USD');
}

/**
 * Formats units/shares (e.g., 10.123)
 */
export function fmtUnits(n) {
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

/**
 * Formats percentages
 */
export function fmtPct(n, withSign = true) {
  const s = Number(n).toFixed(2) + '%';
  return withSign && n > 0 ? '+' + s : s;
}

/**
 * Formats dates
 */
export function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * Approximate combined net worth calculation
 */
export function approxUSD(holdings, inrToUsd = 0.012) {
  return holdings.reduce((sum, h) => {
    const val = h.currentValue || 0;
    return sum + (h.currency === 'INR' ? val * inrToUsd : val);
  }, 0);
}
