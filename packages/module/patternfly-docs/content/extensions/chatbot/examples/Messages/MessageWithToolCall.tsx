import { FunctionComponent, useState } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { Checkbox } from '@patternfly/react-core';

export const MessageWithToolCallExample: FunctionComponent = () => {
  const [toolCallsAreLoading, setToolCallsAreLoading] = useState(false);
  return (
    <>
      <Checkbox
        label="Tool calls are loading"
        id="tool-calls-are-loading"
        isChecked={toolCallsAreLoading}
        onChange={() => {
          setToolCallsAreLoading(!toolCallsAreLoading);
        }}
      />
      <br />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a body description that's within the recommended limit of 2 lines:"
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
        content="This example has a body description that's within the recommended limit of 2 lines:"
        toolCall={{
          titleText: "Calling 'awesome_tool_expansion'",
          expandableContent: 'This is the expandable content for the tool call.',
          isLoading: toolCallsAreLoading,
          loadingText: "Loading 'awesome_tool_expansion'"
        }}
      />
    </>
  );
};
