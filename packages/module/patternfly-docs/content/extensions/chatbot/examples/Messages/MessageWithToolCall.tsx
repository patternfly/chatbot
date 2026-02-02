import { FunctionComponent, useState } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { Checkbox, Flex, FlexItem } from '@patternfly/react-core';

export const MessageWithToolCallExample: FunctionComponent = () => {
  const [toolCallsAreLoading, setToolCallsAreLoading] = useState(false);
  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXl' }}>
      <Checkbox
        label="Tool calls are loading"
        id="tool-calls-are-loading"
        isChecked={toolCallsAreLoading}
        onChange={() => {
          setToolCallsAreLoading(!toolCallsAreLoading);
        }}
      />
      <FlexItem>
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This example has a static tool call title:"
          toolCall={{
            titleText: "Calling 'awesome_tool'",
            loadingText: "Loading 'awesome_tool'",
            isLoading: toolCallsAreLoading
          }}
        />
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This example has an expandable tool call title, with an additional description:"
          toolCall={{
            titleText: "Calling 'awesome_tool_expansion'",
            expandableContent: 'This is the expandable content for the tool call.',
            isLoading: toolCallsAreLoading,
            loadingText: "Loading 'awesome_tool_expansion'"
          }}
        />
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This example has an expandable tool call that is expanded by default:"
          toolCall={{
            isDefaultExpanded: true,
            titleText: "Calling 'awesome_tool_expansion'",
            expandableContent: 'This is the expandable content for the tool call.',
            isLoading: toolCallsAreLoading,
            loadingText: "Loading 'awesome_tool_expansion'"
          }}
        />
      </FlexItem>
    </Flex>
  );
};
