import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithMultipleActionGroups: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="This message contains multiple action groups, each with their own selection persistence. \n1. Feedback actions (thumbs up/down) with persistent selections \n2. Utility actions (copy, download) with non-persistent selections \n3. Listen action with persistent selection."
      actions={[
        {
          actions: {
            // eslint-disable-next-line no-console
            positive: { onClick: () => console.log('Good response') },
            // eslint-disable-next-line no-console
            negative: { onClick: () => console.log('Bad response') }
          },
          persistActionSelection: true
        },
        {
          actions: {
            // eslint-disable-next-line no-console
            copy: { onClick: () => console.log('Copy') },
            // eslint-disable-next-line no-console
            download: { onClick: () => console.log('Download') }
          },
          persistActionSelection: false
        },
        {
          actions: {
            // eslint-disable-next-line no-console
            listen: { onClick: () => console.log('Listen') }
          },
          persistActionSelection: true
        }
      ]}
    />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="This message contains multiple action groups, both of which persist selections."
      actions={[
        {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') }
        },
        {
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }
      ]}
      persistActionSelection={true}
    />
  </>
);
