import { TrackingApi } from './tracking_api';

export interface TrackingSpi extends TrackingApi {
  // register our tracking provider
  registerProvider: () => void;
  initialize: () => void;
  trackSingleItem: (item: string, options?: string) => void;
}
