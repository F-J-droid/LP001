/**
 * Conversions for tracking requirements.
 * Most external tracking APIs (GA4, Meta, Google Ads) expect monetary values
 * as decimal representations (e.g. 499.90), while our internal domain uses cents (49990).
 */
export function centsToDecimal(cents: number): number {
  if (typeof cents !== 'number' || isNaN(cents)) return 0;
  return Number((cents / 100).toFixed(2));
}
