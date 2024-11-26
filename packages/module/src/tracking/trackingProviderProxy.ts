import { TrackingApi } from './tracking_api';
class TrackingProviderProxy implements TrackingApi {
  providers: TrackingApi[] = [];

  constructor(providers: TrackingApi[]) {
    this.providers = providers;
  }

  trackSingleItem(eventName: string, options: string | undefined): void {
    for (const provider of this.providers) {
      provider.trackSingleItem(eventName, options);
    }
  }

  trackPageView(url: any) {
    for (const provider of this.providers) {
      provider.trackPageView(url);
    }
  }
}

export default TrackingProviderProxy;
