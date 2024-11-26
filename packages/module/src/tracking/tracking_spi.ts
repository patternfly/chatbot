import { TrackingApi } from './tracking_api';

export interface InitProps {
  [key: string]: string | number | boolean;
}

export interface TrackingSpi extends TrackingApi {
  // register our tracking provider
  registerProvider: () => void;
  initialize: (props: InitProps) => void;
  trackSingleItem: (item: string, options?: string) => void;
}
