export function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


/**
 * Formats a number as a currency string.
 * Supports INR, USD, GBP, EUR, etc.
 */
export function fmtCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—';

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    return `${currency} ${value}`;
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
