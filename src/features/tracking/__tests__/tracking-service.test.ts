import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackingService } from '../services/tracking-service';
import { metaPixelAdapter } from '../adapters/meta-pixel-adapter';
import { ga4Adapter } from '../adapters/ga4-adapter';
import { consentService } from '../consent/consent-service';

vi.mock('../adapters/meta-pixel-adapter', () => ({
  metaPixelAdapter: {
    initialize: vi.fn(),
    trackStandardEvent: vi.fn(),
    trackCustomEvent: vi.fn(),
  }
}));

vi.mock('../adapters/ga4-adapter', () => ({
  ga4Adapter: {
    initialize: vi.fn(),
    trackEvent: vi.fn(),
  }
}));

vi.mock('../services/meta-capi-service', () => ({
  sendMetaCapiEvent: vi.fn().mockResolvedValue({ success: true }),
}));

describe('TrackingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize adapters based on consent', () => {
    vi.spyOn(consentService, 'hasConsent').mockReturnValue(true);
    
    trackingService.initialize({
      meta: { enabled: true, pixelId: '123', capiEnabled: false, advancedMatchingEnabled: false },
      ga4: { enabled: true, measurementId: 'G-123' },
      gtm: { enabled: false },
      googleAds: { enabled: false, enhancedConversionsEnabled: false }
    });

    expect(metaPixelAdapter.initialize).toHaveBeenCalledWith('123', true);
    expect(ga4Adapter.initialize).toHaveBeenCalledWith(true);
  });

  it('should not initialize adapters if consent is unknown or denied', () => {
    vi.spyOn(consentService, 'hasConsent').mockReturnValue(false);
    
    trackingService.initialize({
      meta: { enabled: true, pixelId: '123', capiEnabled: false, advancedMatchingEnabled: false },
      ga4: { enabled: true, measurementId: 'G-123' },
      gtm: { enabled: false },
      googleAds: { enabled: false, enhancedConversionsEnabled: false }
    });

    expect(metaPixelAdapter.initialize).not.toHaveBeenCalled();
    expect(ga4Adapter.initialize).not.toHaveBeenCalled();
  });

  it('should not dispatch events if marketing consent is denied', () => {
    vi.spyOn(consentService, 'hasConsent').mockImplementation((cat) => cat !== 'marketing');
    
    trackingService.initialize({
      meta: { enabled: true, pixelId: '123', capiEnabled: false, advancedMatchingEnabled: false },
      ga4: { enabled: false },
      gtm: { enabled: false },
      googleAds: { enabled: false, enhancedConversionsEnabled: false }
    });

    trackingService.trackViewItem({ itemId: '1', itemName: 'Pneu', price: 100, sku: '1', brand: 'B', category: 'C', quantity: 1 });

    expect(metaPixelAdapter.trackStandardEvent).not.toHaveBeenCalled();
  });

  it('PURCHASE guard rule: ensure trackPurchase only dispatches PURCHASE', () => {
    vi.spyOn(consentService, 'hasConsent').mockReturnValue(true);
    trackingService.initialize({ 
      meta: { enabled: true, pixelId: '123', capiEnabled: false, advancedMatchingEnabled: false },
      ga4: { enabled: false },
      gtm: { enabled: false },
      googleAds: { enabled: false, enhancedConversionsEnabled: false }
    });

    trackingService.trackPurchase([], 10000, 'PED-123');

    expect(metaPixelAdapter.trackStandardEvent).toHaveBeenCalledWith('PURCHASE', expect.objectContaining({ publicOrderId: 'PED-123' }));
  });
});
