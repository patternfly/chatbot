import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi } from './tracking_api';
import TrackingProviderProxy from './trackingProviderProxy';
import { ConsoleTrackingProvider } from './console_tracking_provider';
import { SegmentTrackingProvider } from './segment_tracking_provider';
import { PosthogTrackingProvider } from './posthog_tracking_provider';
import { UmamiTrackingProvider } from './umami_tracking_provider';

export const getTrackingProviders = (initProps: InitProps): TrackingApi => {
  const providers: TrackingSpi[] = [];
  providers.push(new ConsoleTrackingProvider()); // TODO noop- provider?
  providers.push(new SegmentTrackingProvider());
  providers.push(new PosthogTrackingProvider());
  providers.push(new UmamiTrackingProvider());
  // TODO dynamically find and register providers

  // Initialize them
  for (const provider of providers) {
    provider.initialize(initProps);
  }

  return new TrackingProviderProxy(providers);
};

export default getTrackingProviders;
