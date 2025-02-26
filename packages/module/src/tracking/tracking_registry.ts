import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi } from './tracking_api';
import TrackingProviderProxy from './trackingProviderProxy';
import { ConsoleTrackingProvider } from './console_tracking_provider';
import { SegmentTrackingProvider } from './segment_tracking_provider';
import { PosthogTrackingProvider } from './posthog_tracking_provider';
import { UmamiTrackingProvider } from './umami_tracking_provider';

export const getTrackingProviders = (initProps: InitProps): TrackingApi => {
  const providers: TrackingSpi[] = [];
  providers.push(new SegmentTrackingProvider());
  providers.push(new PosthogTrackingProvider());
  providers.push(new UmamiTrackingProvider());

  // TODO dynamically find and register providers

  // Initialize them
  const enabledProviders: TrackingSpi[] = [];
  for (const provider of providers) {
    const key = provider.getKey();
    if (Object.keys(initProps).indexOf(key) > -1) {
      provider.initialize(initProps);
      enabledProviders.push(provider);
    }
  }
  // Add the console provider
  const consoleTrackingProvider = new ConsoleTrackingProvider();
  enabledProviders.push(consoleTrackingProvider); // TODO noop- provider?

  return new TrackingProviderProxy(enabledProviders);
};

export default getTrackingProviders;
