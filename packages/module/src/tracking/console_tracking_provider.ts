import { TrackingSpi } from './tracking_spi';
import { TrackingApi, TrackingEventProperties } from './tracking_api';

export class ConsoleTrackingProvider implements TrackingSpi, TrackingApi {
  trackPageView(url: string | undefined) {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider pageView', url);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerProvider(): void {}

  initialize(): void {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider initialize');
  }

  identify(userID: string): void {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider identify', userID);
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider: ' + item, properties);
  }

  getKey(): string {
    return 'console';
  }
}
