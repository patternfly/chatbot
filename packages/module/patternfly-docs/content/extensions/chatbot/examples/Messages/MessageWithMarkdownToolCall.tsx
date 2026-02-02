import { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithMarkdownToolCallExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
    content="This example shows how to use Markdown formatting in tool call content. Note the use of shouldRetainStyles to maintain proper formatting:"
    toolCall={{
      shouldRetainStyles: true,
      titleText: "Calling 'data_processor'",
      expandableContent: `**Processing data** from the following sources:

- Database query results
- API responses
- *Local cache*

\`\`\`json
{
  "status": "processing",
  "items": 42
}
\`\`\``,
      isExpandableContentMarkdown: true
    }}
  />
);
