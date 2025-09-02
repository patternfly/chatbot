import { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithDeepThinkingExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
    content="This example has a body description that's within the recommended limit of 2 lines:"
    deepThinking={{
      collapsedToggleText: 'Show thinking',
      expandedToggleText: 'Show thinking',
      subheading: 'Thought for 3 seconds',
      body: "Here's why I said this."
    }}
  />
);
