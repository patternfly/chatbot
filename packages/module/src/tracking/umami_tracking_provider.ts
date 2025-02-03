import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi, TrackingEventProperties } from './tracking_api';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    umami: any;
  }
}

export class UmamiTrackingProvider implements TrackingSpi, TrackingApi {
  getKey(): string {
    return 'umamiKey';
  }

  initialize(props: InitProps): void {
    // eslint-disable-next-line no-console
    console.log('UmamiProvider initialize');
    const umamiKey = props.umamiKey as string;
    const hostUrl = props.umamiHostUrl as string;

    const script = document.createElement('script');
    script.src = hostUrl + '/script.js';
    script.async = true;
    script.defer = true;

    // Configure Umami properties
    script.setAttribute('data-website-id', umamiKey);
    script.setAttribute('data-domains', 'localhost'); // TODO ?
    script.setAttribute('data-auto-track', 'false');
    script.setAttribute('data-host-url', hostUrl); // TODO ?
    script.setAttribute('data-exclude-search', 'false'); // TODO ?

    document.body.appendChild(script);
  }

  identify(userID: string): void {
    // eslint-disable-next-line no-console
    console.log('UmamiProvider userID: ' + userID);
    window.umami?.identify({ userID });
  }

  trackPageView(url: string | undefined): void {
    // eslint-disable-next-line no-console
    console.log('UmamiProvider url', url);
    window.umami?.track({ url });
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    // eslint-disable-next-line no-console
    console.log('UmamiProvider: trackSingleItem' + item, properties);
    window.umami?.track(item, properties);
  }
}
