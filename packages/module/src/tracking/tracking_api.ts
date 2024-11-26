export interface TrackingApi {
  trackPageView: (url: string) => void;

  trackSingleItem: (eventName: string, options: string | undefined) => void;
}
