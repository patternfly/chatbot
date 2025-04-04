import { AnalyticsBrowser } from '@segment/analytics-next';

import { TrackingApi, TrackingEventProperties } from './tracking_api';
import { InitProps, TrackingSpi } from './tracking_spi';

export class SegmentTrackingProvider implements TrackingSpi, TrackingApi {
  private analytics: AnalyticsBrowser | undefined;
  private verbose = false;

  initialize(props: InitProps): void {
    this.verbose = props.verbose;
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('SegmentProvider initialize');
    }
    const segmentKey = props.segmentKey as string;

    // We need to create an object here, as ts lint is unhappy otherwise
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrations = props.segmentIntegrations as any;

    this.analytics = AnalyticsBrowser.load(
      {
        writeKey: segmentKey,
        cdnURL: props.segmentCdn as string
      },

      {
        integrations: {
          ...integrations
        }
      }
    );
  }

  identify(userID: string, userProperties: TrackingEventProperties = {}): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('SegmentProvider userID: ' + userID);
    }
    if (this.analytics) {
      this.analytics.identify(userID, userProperties);
    }
  }

  trackPageView(url: string | undefined): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('SegmentProvider url ', url);
    }
    if (this.analytics) {
      if (url) {
        this.analytics.page(url);
      } else {
        this.analytics.page(); // Uses window.url
      }
    }
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('SegmentProvider: trackSingleItem ' + item, properties);
    }
    if (this.analytics) {
      this.analytics.track(item, { properties });
    }
  }
}
