import { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithMarkdownDeepThinkingExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
    content="This example shows how to use Markdown formatting in deep thinking content. Note the use of shouldRetainStyles to maintain proper formatting:"
    deepThinking={{
      shouldRetainStyles: true,
      toggleContent: 'Show thinking',
      subheading: '> Thought for 3 seconds',
      isSubheadingMarkdown: true,
      body: `I considered **multiple approaches** to answer your question:

1. *Direct response* - Quick but less comprehensive
2. *Research-based* - Thorough but time-consuming
3. **Balanced approach** - Combines speed and accuracy

I chose option 3 because it provides the best user experience.`,
      isBodyMarkdown: true
    }}
  />
);
