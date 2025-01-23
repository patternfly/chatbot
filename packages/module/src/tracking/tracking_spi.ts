import { TrackingApi, TrackingEventProperties } from './tracking_api';

export interface InitProps {
  [key: string]: string | number | boolean;
}

export interface TrackingSpi extends TrackingApi {
  // Return a key in InitProps to check if the provided should be enabled
  getKey: () => string;
  // Initialize the provider
  initialize: (props: InitProps) => void;
  // Track a single item
  trackSingleItem: (item: string, properties?: TrackingEventProperties) => void;
}
