import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const ResponseActionClickedExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
    content="I updated your account with those settings. You're ready to set up your first dashboard!"
    actions={{
      // eslint-disable-next-line no-console
      positive: { onClick: () => console.log('Good response'), isClicked: true },
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
);
