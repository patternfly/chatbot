import { AnalyticsBrowser } from '@segment/analytics-next';

import { TrackingApi } from './tracking_api';
import { InitProps, TrackingSpi } from "./tracking_spi";


export class SegmentTrackingProvider implements TrackingSpi, TrackingApi {
  private analytics: AnalyticsBrowser | undefined;
  trackPageView(url: any): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider url', url);
    if (this.analytics) {
      this.analytics.page(url);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerProvider(): void {}

  initialize(props: InitProps): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider initialize');
    const segmentKey = 'qylQB4US91okwS4xtHIxtnka9FFHcC7g'; // TODO add your key here

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

  trackSingleItem(item: string, options: string | undefined): void {
    // eslint-disable-next-line no-console
    console.log('SegmentProvider: trackSingleItem' + item, options);
    if (this.analytics) {
      this.analytics.track(item, { options });
    }
  }
}
