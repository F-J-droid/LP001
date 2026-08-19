import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ConsentService', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_TRACKING_DEV_BYPASS;
  });

  it('should default to unknown for marketing and analytics', async () => {
    const { consentService } = await import('../consent/consent-service');
    expect(consentService.getConsent('marketing')).toBe('unknown');
    expect(consentService.getConsent('analytics')).toBe('unknown');
    expect(consentService.hasConsent('marketing')).toBe(false);
  });

  it('should be overridden by dev bypass if enabled', async () => {
    process.env.NEXT_PUBLIC_TRACKING_DEV_BYPASS = 'true';
    const { consentService } = await import('../consent/consent-service');
    expect(consentService.getConsent('marketing')).toBe('granted');
    expect(consentService.getConsent('analytics')).toBe('granted');
    expect(consentService.hasConsent('marketing')).toBe(true);
  });

  it('necessary category should always be granted', async () => {
    const { consentService } = await import('../consent/consent-service');
    expect(consentService.getConsent('necessary')).toBe('granted');
  });
});
