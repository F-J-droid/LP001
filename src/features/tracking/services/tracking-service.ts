import { CommerceEvent, CommerceItem } from '../types';
import { InternalEventName } from '../events/event-registry';
import { metaPixelAdapter } from '../adapters/meta-pixel-adapter';
import { ga4Adapter } from '../adapters/ga4-adapter';
import { sendMetaCapiEvent } from './meta-capi-service';
import { AttributionService } from '../attribution/attribution-service';
import { consentService } from '../consent/consent-service';
import { TrackingSettings } from '@/features/admin/settings/schemas/settings.schema';

export class TrackingService {
  private settings: TrackingSettings | null = null;
  private isInitialized = false;

  public initialize(settings: TrackingSettings) {
    this.settings = settings;
    
    // Check consent before enabling marketing/analytics
    const marketingConsent = consentService.hasConsent('marketing');
    const analyticsConsent = consentService.hasConsent('analytics');

    if (marketingConsent) {
      metaPixelAdapter.initialize(settings.meta?.pixelId, settings.meta?.enabled);
    }
    
    if (analyticsConsent) {
      ga4Adapter.initialize(settings.ga4?.enabled);
    }
    
    this.isInitialized = true;
  }

  private dispatchEvent(eventName: InternalEventName, eventData?: CommerceEvent) {
    if (!this.isInitialized) return;
    
    const marketingConsent = consentService.hasConsent('marketing');
    const analyticsConsent = consentService.hasConsent('analytics');

    // 1. Meta Pixel
    if (marketingConsent && this.settings?.meta?.enabled) {
      metaPixelAdapter.trackStandardEvent(eventName, eventData);
    }

    // 2. GA4
    if (analyticsConsent && this.settings?.ga4?.enabled) {
      ga4Adapter.trackEvent(eventName, eventData);
    }

    // 3. Meta CAPI (Server-Side)
    if (marketingConsent && this.settings?.meta?.enabled && this.settings?.meta?.capiEnabled && eventData) {
      // Only critical events to CAPI
      const capiEvents: InternalEventName[] = ['VIEW_ITEM', 'ADD_TO_CART', 'BEGIN_CHECKOUT', 'ADD_PAYMENT_INFO', 'PURCHASE'];
      
      if (capiEvents.includes(eventName)) {
        const attribution = AttributionService.getAttribution();
        const userData: Record<string, unknown> = {};
        
        if (attribution?.lastTouch) {
          if (attribution.lastTouch._fbp) userData.fbp = attribution.lastTouch._fbp;
          if (attribution.lastTouch._fbc) userData.fbc = attribution.lastTouch._fbc;
        }

        // Send non-blocking
        sendMetaCapiEvent({
          eventName,
          eventData,
          pixelId: this.settings.meta.pixelId!,
          testEventCode: this.settings.meta.testEventCode,
          userData,
          sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }).catch(() => {});
      }
    }
  }

  public trackPageView() {
    this.dispatchEvent('PAGE_VIEW');
  }

  public trackViewItemList(items: CommerceItem[]) {
    this.dispatchEvent('VIEW_ITEM_LIST', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: 0,
      items
    });
  }

  public trackViewItem(item: CommerceItem) {
    this.dispatchEvent('VIEW_ITEM', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: item.price,
      items: [item]
    });
  }

  public trackAddToCart(item: CommerceItem, quantity: number, value: number) {
    this.dispatchEvent('ADD_TO_CART', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: value,
      items: [{ ...item, quantity }]
    });
  }

  public trackBeginCheckout(items: CommerceItem[], totalValue: number) {
    this.dispatchEvent('BEGIN_CHECKOUT', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: totalValue,
      items
    });
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackAddShippingInfo(items: CommerceItem[], totalValue: number, _shippingTier: string) {
    this.dispatchEvent('ADD_SHIPPING_INFO', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: totalValue,
      items
      // missing: pass shipping_tier to adapter if needed, GA4 supports it.
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public trackAddPaymentInfo(items: CommerceItem[], totalValue: number, _paymentType: string) {
    this.dispatchEvent('ADD_PAYMENT_INFO', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: totalValue,
      items
      // missing: payment_type
    });
  }

  public trackPurchase(items: CommerceItem[], totalValue: number, transactionId: string) {
    this.dispatchEvent('PURCHASE', {
      eventId: crypto.randomUUID(),
      currency: 'BRL',
      value: totalValue,
      items,
      publicOrderId: transactionId
    });
  }
}

export const trackingService = new TrackingService();
