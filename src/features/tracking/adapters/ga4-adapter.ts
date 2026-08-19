import { CommerceEvent } from '../types';
import { Ga4StandardEvents, InternalEventName } from '../events/event-registry';
import { centsToDecimal } from '../utils/money-helpers';

type Ga4Window = Window & typeof globalThis & { gtag?: (...args: unknown[]) => void; dataLayer?: { push: (obj: unknown) => void } };

export class Ga4Adapter {
  private enabled: boolean = false;

  public initialize(enabled = true) {
    this.enabled = enabled;
  }

  private mapItems(eventData: CommerceEvent) {
    return eventData.items.map(item => ({
      item_id: item.sku || item.itemId,
      item_name: item.itemName,
      item_brand: item.brand,
      item_category: item.category,
      price: centsToDecimal(item.price),
      quantity: item.quantity,
      discount: item.discount ? centsToDecimal(item.discount) : undefined,
    }));
  }

  public trackEvent(eventName: InternalEventName, eventData?: CommerceEvent) {
    if (!this.enabled || typeof window === 'undefined') return;

    const ga4Event = Ga4StandardEvents[eventName];
    if (!ga4Event) return;

    const payload: Record<string, unknown> = {};

    if (eventData) {
      if (eventData.currency) payload.currency = eventData.currency;
      if (eventData.value !== undefined) payload.value = centsToDecimal(eventData.value);
      if (eventData.items && eventData.items.length > 0) {
        payload.items = this.mapItems(eventData);
      }
      if (eventName === 'PURCHASE' && eventData.publicOrderId) {
        payload.transaction_id = eventData.publicOrderId;
      }
    }

    try {
      const w = window as Ga4Window;
      if (w.gtag) {
        w.gtag('event', ga4Event, payload);
      } else if (w.dataLayer) {
        w.dataLayer.push({ event: ga4Event, ecommerce: payload });
      }
    } catch (err) {
      console.warn('[GA4] Failed to track event', ga4Event, err);
    }
  }
}

export const ga4Adapter = new Ga4Adapter();
