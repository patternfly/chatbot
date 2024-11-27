export interface TrackingApi {
  identify: (userID: string) => void;

  trackPageView: (url: string | undefined) => void;

  trackSingleItem: (eventName: string, options: string | undefined) => void;
}
