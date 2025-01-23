import { AnalyticsBrowser } from '@segment/analytics-next';

import { TrackingApi, TrackingEventProperties } from './tracking_api';
import { InitProps, TrackingSpi } from './tracking_spi';

export class SegmentTrackingProvider implements TrackingSpi, TrackingApi {
  private analytics: AnalyticsBrowser | undefined;
  getKey(): string {
    return 'segmentKey';
  }

  initialize(props: InitProps): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider initialize');
    const segmentKey = props.segmentKey as string;

    this.analytics = AnalyticsBrowser.load(
      {
        writeKey: segmentKey,
        cdnURL: 'https://console.redhat.com/connections/cdn'
      },

      {
        integrations: {
          'Segment.io': {
            apiHost: 'console.redhat.com/connections/api/v1',
            protocol: 'https'
          }
        }
      }
    );
  }

  identify(userID: string): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider userID: ' + userID);
    if (this.analytics) {
      this.analytics.identify(userID);
    }
  }

  trackPageView(url: string | undefined): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider url', url);
    if (this.analytics) {
      if (url) {
        this.analytics.page(url);
      } else {
        this.analytics.page(); // Uses window.url
      }
    }
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider: trackSingleItem' + item, properties);
    if (this.analytics) {
      this.analytics.track(item, { properties });
    }
  }
}
