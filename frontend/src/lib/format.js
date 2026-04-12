export function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// lib/format.js
export function fmtCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
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
