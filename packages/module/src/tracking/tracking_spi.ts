import { TrackingApi } from './tracking_api';

export enum Providers {
  None,
  Segment,
  Umami,
  Posthog,
  Console
}

export type ProviderAsString = keyof typeof Providers;

export interface BaseProps {
  verbose: boolean;
  activeProviders: [ProviderAsString];
}

export type InitProps = {
  [key: string]: string | number | boolean;
} & BaseProps;

export interface TrackingSpi extends TrackingApi {
  // Initialize the provider
  initialize: (props: InitProps) => void;
}
