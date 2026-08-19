import { CommerceEvent } from '../types';
import { MetaStandardEvents, InternalEventName } from '../events/event-registry';
import { centsToDecimal } from '../utils/money-helpers';

type MetaWindow = Window & typeof globalThis & { fbq?: (...args: unknown[]) => void };

export class MetaPixelAdapter {
  private enabled: boolean = false;

  public initialize(pixelId?: string, enabled = true) {
    this.enabled = enabled && !!pixelId;
    if (!this.enabled) return;
    if (typeof window === 'undefined') return;
    if ((window as MetaWindow).fbq) return; // already initialized

    // The script loading itself should be handled via next/script in layout,
    // but the initialization logic sits here:
    // window.fbq('init', pixelId); 
    // Usually done in standard meta snippet.
  }

  public trackStandardEvent(eventName: InternalEventName, eventData?: CommerceEvent) {
    if (!this.enabled || typeof window === 'undefined' || !(window as MetaWindow).fbq) return;

    const metaEvent = MetaStandardEvents[eventName];
    if (!metaEvent) return;

    const payload: Record<string, unknown> = {};
    const options: { eventID?: string } = {};

    if (eventData) {
      if (eventData.currency) payload.currency = eventData.currency;
      if (eventData.value !== undefined) payload.value = centsToDecimal(eventData.value);
      
      if (eventData.items && eventData.items.length > 0) {
        payload.content_ids = eventData.items.map(i => i.sku || i.itemId);
        payload.content_type = 'product';
        if (eventName === 'PURCHASE') {
          payload.num_items = eventData.items.reduce((acc, curr) => acc + curr.quantity, 0);
        }
      }

      if (eventData.eventId) {
        options.eventID = eventData.eventId;
      }
    }

    try {
      const w = window as MetaWindow;
      if (w.fbq && Object.keys(options).length > 0) {
        w.fbq('track', metaEvent, payload, options);
      } else if (w.fbq) {
        w.fbq('track', metaEvent, payload);
      }
    } catch (err) {
      console.warn('[MetaPixel] Failed to track event', metaEvent, err);
    }
  }

  public trackCustomEvent(eventName: string, data?: Record<string, unknown>) {
    if (!this.enabled || typeof window === 'undefined' || !(window as MetaWindow).fbq) return;
    try {
      (window as MetaWindow).fbq?.('trackCustom', eventName, data);
    } catch (err) {
      console.warn('[MetaPixel] Failed to track custom event', eventName, err);
    }
  }
}

export const metaPixelAdapter = new MetaPixelAdapter();
