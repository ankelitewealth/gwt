export function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// lib/format.js
/**
 * Formats a number as a currency string.
 * Supports multiple currencies like INR, USD, GBP, EUR.
 */
export function fmtCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      // UK/Europe often use 2 decimal places, India often use 2.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    // Fallback if currency code is invalid
    return `${currency} ${value.toFixed(2)}`;
  }
}



export function fmtUnits(n) {
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function fmtPct(n, withSign = true) {
  const s = Number(n).toFixed(2) + '%';
  return withSign && n > 0 ? '+' + s : s;
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// Approximate combined net worth in USD (India holdings converted at spot rate)
// In V2 this will use a live FX API
export function approxUSD(holdings, inrToUsd = 0.012) {
  return holdings.reduce((sum, h) => {
    const val = h.currentValue;
    return sum + (h.currency === 'INR' ? val * inrToUsd : val);
  }, 0);
}
