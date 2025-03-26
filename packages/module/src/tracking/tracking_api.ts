export interface TrackingEventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface TrackingApi {
  identify: (userID: string, userProperties: TrackingEventProperties) => void;

  trackPageView: (url: string | undefined) => void;

  trackSingleItem: (eventName: string, properties: TrackingEventProperties | undefined) => void;
}
