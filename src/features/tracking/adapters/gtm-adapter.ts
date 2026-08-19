export class GtmAdapter {
  private enabled: boolean = false;

  public initialize(enabled = true) {
    this.enabled = enabled;
  }

  // GTM mostly acts as a container. If enabled, events pushed to dataLayer by Ga4Adapter
  // will be picked up by GTM. This adapter can be used for GTM-specific config if needed.
}

export const gtmAdapter = new GtmAdapter();
