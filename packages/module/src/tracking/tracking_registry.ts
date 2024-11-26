import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi } from './tracking_api';
import TrackingProviderProxy from './trackingProviderProxy';
import { ConsoleTrackingProvider } from './console_tracking_provider';
import { SegmentTrackingProvider } from './segment_tracking_provider';

export const getTrackingProviders = (initProps: InitProps): TrackingApi => {
  const providers: TrackingSpi[] = [];
  providers.push(new ConsoleTrackingProvider()); // TODO noop- provider?
  providers.push(new SegmentTrackingProvider());
  // TODO dynamically find and register others

  // Initialize them
  for (const provider of providers) {
    provider.initialize(initProps);
  }

  return new TrackingProviderProxy(providers);
};

export default getTrackingProviders;
