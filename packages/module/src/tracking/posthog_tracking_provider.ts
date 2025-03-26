import { posthog } from 'posthog-js';

import { TrackingApi, TrackingEventProperties } from './tracking_api';
import { InitProps, TrackingSpi } from './tracking_spi';

export class PosthogTrackingProvider implements TrackingSpi, TrackingApi {
  private verbose = false;

  initialize(props: InitProps): void {
    this.verbose = props.verbose;
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('PosthogProvider initialize');
    }
    const posthogKey = props.posthogKey as string;

    posthog.init(posthogKey, {
      // eslint-disable-next-line camelcase
      api_host: 'https://us.i.posthog.com',
      // eslint-disable-next-line camelcase
      person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    });
  }

  identify(userID: string, userProperties: TrackingEventProperties = {}): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('PosthogProvider userID: ' + userID);
    }
    posthog.identify(userID, userProperties);
  }

  trackPageView(url: string | undefined): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('PostHogProvider url ', url);
    }
    // TODO posthog seems to record that automatically.
    //  How to not clash with this here? Just leave as no-op?
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('PosthogProvider: trackSingleItem ' + item, properties);
    }
    posthog.capture(item, { properties });
  }
}
