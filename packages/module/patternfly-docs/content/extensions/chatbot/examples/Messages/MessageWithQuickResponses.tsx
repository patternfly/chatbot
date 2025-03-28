import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithQuickResponsesExample: React.FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="Did you clear your cache?"
      quickResponses={[
        { id: '1', content: 'Yes', onClick: () => alert('Clicked yes') },
        { id: '2', content: 'No', onClick: () => alert('Clicked no') }
      ]}
    />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="What browser are you noticing the issue in?"
      quickResponses={[
        { id: '1', content: 'Microsoft Edge', onClick: () => alert('Clicked Edge') },
        { id: '2', content: 'Google Chrome', onClick: () => alert('Clicked Chrome') },
        { id: '3', content: 'Mozilla Firefox', onClick: () => alert('Clicked Firefox') },
        { id: '4', content: 'Apple Safari', onClick: () => alert('Clicked Safari') },
        { id: '5', content: 'Internet Explorer', onClick: () => alert('Clicked Internet Explorer') }
      ]}
    />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="Welcome back, User! How can I help you today?"
      quickResponses={[
        { id: '1', content: 'Help me with an access issue', onClick: () => alert('Clicked id 1') },
        { id: '2', content: 'Show my critical vulnerabilities', onClick: () => alert('Clicked id 2') },
        { id: '3', content: 'Create new integrations', onClick: () => alert('Clicked id 3') },
        { id: '4', content: 'Get recommendations from an advisor', onClick: () => alert('Clicked id 4') },
        { id: '5', content: 'Something else', onClick: () => alert('Clicked id 5') }
      ]}
    />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="Did you clear your cache?"
      quickResponses={[
        { id: '1', content: 'Yes', isDisabled: true },
        { id: '2', content: 'No', onClick: () => alert('Clicked no') }
      ]}
    />
  </>
);
