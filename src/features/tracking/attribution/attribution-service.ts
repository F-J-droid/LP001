import { AttributionData, TouchpointData } from '../types';

const ATTRIBUTION_COOKIE_NAME = 'tp_attr_data';
const ATTRIBUTION_TTL_DAYS = 90;

export class AttributionService {
  private static setCookie(name: string, value: string, days: number) {
    if (typeof window === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    // Since client needs to read it to append, it cannot be HttpOnly
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax${process.env.NODE_ENV === 'production' ? ';Secure' : ''}`;
  }

  private static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  private static getFbp(): string | undefined {
    return this.getCookie('_fbp') || undefined;
  }

  private static getFbc(): string | undefined {
    return this.getCookie('_fbc') || undefined;
  }

  public static captureFromUrl(urlStr: string) {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(urlStr);
      const params = url.searchParams;

      const hasAttributionParams = params.has('utm_source') || params.has('fbclid') || params.has('gclid');
      
      if (!hasAttributionParams) return;

      const currentData: AttributionData = {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_content: params.get('utm_content') || undefined,
        utm_term: params.get('utm_term') || undefined,
        fbclid: params.get('fbclid') || undefined,
        gclid: params.get('gclid') || undefined,
        _fbp: this.getFbp(),
        _fbc: this.getFbc() || (params.has('fbclid') ? `fb.1.${Date.now()}.${params.get('fbclid')}` : undefined),
        landingPage: url.pathname + url.search,
        timestamp: Date.now()
      };

      const existingStr = this.getCookie(ATTRIBUTION_COOKIE_NAME);
      let touchpoints: TouchpointData = {};

      if (existingStr) {
        try {
          touchpoints = JSON.parse(existingStr);
        } catch {
          touchpoints = {};
        }
      }

      // First touch is never overwritten
      if (!touchpoints.firstTouch) {
        touchpoints.firstTouch = currentData;
      }

      // Last touch is always overwritten on new campaign visit
      touchpoints.lastTouch = currentData;

      this.setCookie(ATTRIBUTION_COOKIE_NAME, JSON.stringify(touchpoints), ATTRIBUTION_TTL_DAYS);
    } catch (err) {
      console.warn('[Tracking] Failed to parse URL for attribution', err);
    }
  }

  public static getAttribution(): TouchpointData | null {
    const existingStr = this.getCookie(ATTRIBUTION_COOKIE_NAME);
    if (!existingStr) return null;
    try {
      const parsed = JSON.parse(existingStr) as TouchpointData;
      
      // Attempt to enrich with fresh fbp/fbc if missing or outdated in lastTouch
      if (parsed.lastTouch) {
        parsed.lastTouch._fbp = this.getFbp() || parsed.lastTouch._fbp;
        parsed.lastTouch._fbc = this.getFbc() || parsed.lastTouch._fbc;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}
