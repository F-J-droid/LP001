export interface CommerceItem {
  itemId: string;
  sku?: string;
  itemName: string;
  brand?: string;
  category?: string;
  tireSize?: string;
  price: number; // in cents or decimal? As per instruction, internal domain uses cents. So this should be cents, but let's document it clearly. Wait, standard says price here can be cents, but adapters must convert to decimal. Let's make it cents.
  quantity: number;
  discount?: number;
}

export interface CommerceEvent {
  eventId: string; // crypto.randomUUID()
  currency: string; // e.g. BRL
  value: number; // total in cents
  items: CommerceItem[];
  sourceUrl?: string;
  timestamp?: number;
  orderId?: string;
  publicOrderId?: string;
}

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';
export type ConsentStatus = 'unknown' | 'granted' | 'denied';

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  _fbp?: string;
  _fbc?: string;
  landingPage?: string;
  timestamp?: number;
}

export interface TouchpointData {
  firstTouch?: AttributionData;
  lastTouch?: AttributionData;
}
