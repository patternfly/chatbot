import { InitProps, Providers, TrackingSpi } from './tracking_spi';
import { TrackingApi } from './tracking_api';
import TrackingProviderProxy from './trackingProviderProxy';
import { ConsoleTrackingProvider } from './console_tracking_provider';
import { SegmentTrackingProvider } from './segment_tracking_provider';
import { PosthogTrackingProvider } from './posthog_tracking_provider';
import { UmamiTrackingProvider } from './umami_tracking_provider';

export const getTrackingProviders = (initProps: InitProps): TrackingApi => {
  const providers: TrackingSpi[] = [];

  if (initProps.activeProviders) {
    let tmpProps: string[] = initProps.activeProviders;

    // Theoretically we get an array of provider names, but it could also be a CSV string...
    if (!Array.isArray(initProps.activeProviders)) {
      const tmpString = initProps.activeProviders as string;
      if (tmpString && tmpString.indexOf(',') !== -1) {
        tmpProps = tmpString.split(',');
      } else {
        tmpProps = [tmpString];
      }
    }

    tmpProps.forEach((provider) => {
      switch (Providers[provider]) {
        case Providers.Segment:
          providers.push(new SegmentTrackingProvider());
          break;
        case Providers.Umami:
          providers.push(new UmamiTrackingProvider());
          break;
        case Providers.Posthog:
          providers.push(new PosthogTrackingProvider());
          break;
        case Providers.Console:
          providers.push(new ConsoleTrackingProvider());
          break;
        case Providers.None: // Do nothing, just a placeholder
          break;
        default:
          if (providers.length > 1) {
            if (initProps.verbose) {
              // eslint-disable-next-line no-console
              console.error("Unknown provider '" + provider);
            }
          }
          break;
      }
    });
  }

  // Initialize them
  for (const provider of providers) {
    try {
      provider.initialize(initProps);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return new TrackingProviderProxy(providers);
};

export default getTrackingProviders;
