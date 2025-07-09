import { CSSProperties, useState, Fragment, FunctionComponent, MouseEvent, Ref } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import MessageDivider from '@patternfly/chatbot/dist/dynamic/MessageDivider';

export const MessageWithDividersExample: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content={`This is a text-based message from a bot named "Bot."`}
    />
    <MessageDivider variant="date" content="1 hour ago" />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content={`This is a text-based message from "Bot," with an updated timestamp.`}
      timestamp="1 hour ago"
    />
    <MessageDivider variant="announcement" content="Agent joined the chat" />
  </>
);
