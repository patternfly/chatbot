import { TrackingApi, TrackingEventProperties } from './tracking_api';

interface BaseProps {
  verbose: boolean;
}

export type InitProps = {
  [key: string]: string | number | boolean;
} & BaseProps;

export interface TrackingSpi extends TrackingApi {
  // Return a key in InitProps to check if the provided should be enabled
  getKey: () => string;
  // Initialize the provider
  initialize: (props: InitProps) => void;
  // Track a single item
  trackSingleItem: (item: string, properties?: TrackingEventProperties) => void;
}
