import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';

export const ResponseActionExample: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      content="I updated your account with those settings. You're ready to set up your first dashboard!"
      actions={{
        // eslint-disable-next-line no-console
        positive: { onClick: () => console.log('Good response') },
        // eslint-disable-next-line no-console
        negative: { onClick: () => console.log('Bad response') },
        // eslint-disable-next-line no-console
        copy: { onClick: () => console.log('Copy') },
        // eslint-disable-next-line no-console
        download: { onClick: () => console.log('Download') },
        // eslint-disable-next-line no-console
        listen: { onClick: () => console.log('Listen') }
      }}
    />
    <Message
      name="Bot"
      role="bot"
      showActionsOnInteraction
      content="This message has response actions visually hidden until you hover over the message via mouse, or an action would receive focus via keyboard."
      actions={{
        // eslint-disable-next-line no-console
        positive: { onClick: () => console.log('Good response') },
        // eslint-disable-next-line no-console
        negative: { onClick: () => console.log('Bad response') },
        // eslint-disable-next-line no-console
        copy: { onClick: () => console.log('Copy') },
        // eslint-disable-next-line no-console
        download: { onClick: () => console.log('Download') },
        // eslint-disable-next-line no-console
        listen: { onClick: () => console.log('Listen') }
      }}
    />
  </>
);
