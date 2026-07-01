import { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';

export const MessageWithDeepThinkingExample: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      content="This example has a body description that's within the recommended limit of 2 lines."
      deepThinking={{
        toggleContent: 'Show thinking',
        subheading: 'Thought for 3 seconds',
        body: "Here's why I said this."
      }}
    />
    <Message
      name="Bot"
      role="bot"
      content="This example has deep thinking that is collapsed by default:"
      deepThinking={{
        isDefaultExpanded: false,
        toggleContent: 'Show thinking',
        subheading: 'Thought for 3 seconds',
        body: "Here's why I said this."
      }}
    />
    <Message
      name="Bot"
      role="bot"
      content="This example has deep thinking that is loading:"
      deepThinking={{
        isDefaultExpanded: false,
        toggleContent: 'Show thinking',
        subheading: 'Thought for 3 seconds',
        body: "Here's why I said this.",
        isLoading: true
      }}
    />
  </>
);
