import React from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';

export const UserMessageExample: React.FunctionComponent = () => {
  const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

Here is an inline code - \`() => void\`

Here is an ordered list: 

1. Item 1
2. Item 3
3. Item 4

Here is an unordered list:

* Item 1
* Item 2
* Item 3`;

  return (
    <>
      <Message
        name="User"
        role="user"
        content="This is a user message with an updated timestamp."
        timestamp="1 hour ago"
        avatar={userAvatar}
      />
      <Message name="User" role="user" content={markdown} avatar={userAvatar} />
      <Message
        name="User"
        role="user"
        content="This is a user message with `avatarProps` set to add a border."
        avatar={userAvatar}
        avatarProps={{ isBordered: true }}
      />
    </>
  );
};
