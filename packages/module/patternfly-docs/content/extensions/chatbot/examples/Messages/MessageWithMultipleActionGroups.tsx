import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithMultipleActionGroups: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="This message contains multiple action groups, each with their own selection persistence. The first group contains feedback actions with persistent selections, the second group contains utility actions with non-persistent selections, and the third has a listen action with persistent selection."
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
      content="This message contains multiple action groups with the same selection persistence applied to each group."
      actions={[
        {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') }
        },
        {
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') }
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
