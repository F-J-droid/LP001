import { ConsentCategory, ConsentStatus } from '../types';

/**
 * Consent Foundation Service
 * Currently starts with a default configuration and supports a dev bypass.
 */
class ConsentService {
  private consentState: Record<ConsentCategory, ConsentStatus> = {
    necessary: 'granted', // Always granted if necessary for operation
    analytics: 'unknown',
    marketing: 'unknown',
  };

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    if (typeof window === 'undefined') return;

    // Check for explicit dev bypass
    const isDevBypass = process.env.NEXT_PUBLIC_TRACKING_DEV_BYPASS === 'true';
    if (isDevBypass) {
      this.consentState.analytics = 'granted';
      this.consentState.marketing = 'granted';
      console.warn('[Tracking] DEV_BYPASS ENABLED: Consent automatically granted for all categories.');
      return;
    }

    try {
      // Future: load from real consent cookie (e.g. CookieBot, OneTrust, etc.)
      const storedConsent = localStorage.getItem('user_consent');
      if (storedConsent) {
        const parsed = JSON.parse(storedConsent);
        if (parsed.analytics) this.consentState.analytics = parsed.analytics;
        if (parsed.marketing) this.consentState.marketing = parsed.marketing;
      }
    } catch (err) {
      console.error('[Tracking] Failed to load consent state', err);
    }
  }

  public getConsent(category: ConsentCategory): ConsentStatus {
    return this.consentState[category];
  }

  public setConsent(category: ConsentCategory, status: ConsentStatus) {
    this.consentState[category] = status;
    this.saveToStorage();
  }

  public hasConsent(category: ConsentCategory): boolean {
    return this.consentState[category] === 'granted';
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('user_consent', JSON.stringify(this.consentState));
    } catch {
      // ignore
    }
  }
}

export const consentService = new ConsentService();
