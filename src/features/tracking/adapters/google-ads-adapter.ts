export class GoogleAdsAdapter {
  private enabled: boolean = false;

  public initialize(enabled = true) {
    this.enabled = enabled;
  }

  // Google Ads conversion tracking logic will reside here.
  // Purchase conversions will be implemented when backend webhooks are in place.
}

export const googleAdsAdapter = new GoogleAdsAdapter();
