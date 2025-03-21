import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi, TrackingEventProperties } from './tracking_api';

export class ConsoleTrackingProvider implements TrackingSpi, TrackingApi {
  private verbose = false;
  trackPageView(url: string | undefined) {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('ConsoleProvider pageView ', url);
    }
  }

  initialize(props: InitProps): void {
    this.verbose = props.verbose;
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('ConsoleProvider initialize');
    }
  }

  identify(userID: string, userProperties: TrackingEventProperties = {}): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('ConsoleProvider identify ', userID, userProperties);
    }
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.log('ConsoleProvider: ' + item, properties);
    }
  }
}
