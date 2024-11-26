import { TrackingSpi } from './tracking_spi';
import { TrackingApi } from './tracking_api';

export class ConsoleTrackingProvider implements TrackingSpi, TrackingApi {
  trackPageView(url: any) {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider', url);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerProvider(): void {}

  initialize(): void {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider initialize');
  }

  trackSingleItem(item: string, options: string | undefined): void {
    // eslint-disable-next-line no-console
    console.log('ConsoleProvider: ' + item, options);
  }
}
