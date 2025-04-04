import { InitProps, TrackingSpi } from './tracking_spi';
import { TrackingApi, TrackingEventProperties } from './tracking_api';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    umami: any;
  }
}

// Items in a queue.
// We need to queue up requests until the script is fully loaded
interface queueT {
  what: 'i' | 't' | 'p'; // identify, track, pageview
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export class UmamiTrackingProvider implements TrackingSpi, TrackingApi {
  private verbose = false;
  private websiteId: string | undefined;
  private queue: queueT[] = [];

  initialize(props: InitProps): void {
    this.verbose = props.verbose;
    this.log('UmamiProvider initialize');

    this.websiteId = props.umamiKey as string;
    const hostUrl = props.umamiHostUrl as string;

    const script = document.createElement('script');
    script.src = hostUrl + '/script.js';
    script.async = true;
    script.defer = true;

    // Configure Umami properties
    script.setAttribute('data-website-id', this.websiteId);
    script.setAttribute('data-host-url', hostUrl);
    script.setAttribute('data-auto-track', 'false');
    script.setAttribute('data-exclude-search', 'false');

    // Now get from config, which may override some of the above.
    const UMAMI_PREFIX = 'umami-';
    for (const prop in props) {
      if (prop.startsWith(UMAMI_PREFIX)) {
        const att = 'data-' + prop.substring(UMAMI_PREFIX.length);
        const val = props[prop];
        script.setAttribute(att, String(val));
      }
    }
    script.onload = () => {
      this.log('UmamiProvider script loaded');
      this.flushQueue();
    };

    document.body.appendChild(script);
  }

  identify(userID: string, userProperties: TrackingEventProperties = {}): void {
    this.log('UmamiProvider userID: ' + userID + ' => ' + JSON.stringify(userProperties));
    if (window.umami) {
      window.umami.identify({ userID, userProperties });
    } else {
      this.queue.push({ what: 'i', name: userID, payload: userProperties });
    }
  }

  trackPageView(url: string | undefined): void {
    this.log('UmamiProvider url ' + url);
    if (window.umami) {
      window.umami.track({ url, website: this.websiteId });
    } else {
      this.queue.push({ what: 'p', name: String(url) });
    }
  }

  trackSingleItem(item: string, properties?: TrackingEventProperties): void {
    this.log('UmamiProvider: trackSingleItem ' + item + JSON.stringify(properties));
    if (window.umami) {
      window.umami.track(item, properties);
    } else {
      this.queue.push({ what: 't', name: item, payload: properties });
    }
  }

  flushQueue(): void {
    for (const item of this.queue) {
      this.log('Queue flush ' + JSON.stringify(item));
      switch (item.what) {
        case 'i':
          this.identify(item.name, item.payload);
          break;
        case 't':
          this.trackSingleItem(item.name, item.payload);
          break;
        case 'p':
          this.trackPageView(item.name);
          break;
      }
    }
  }

  log(msg: string): void {
    if (this.verbose) {
      // eslint-disable-next-line no-console
      console.debug('UmamiProvider: ', msg);
    }
  }
}
