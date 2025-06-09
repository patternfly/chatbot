import { useState, useRef, FunctionComponent } from 'react';

import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import { FormGroup, Radio } from '@patternfly/react-core';

export const ChatbotWelcomeInteractionDemo: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const isVisible = true;
  const displayMode = ChatbotDisplayMode.default;

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string) => {
    setIsSendButtonDisabled(true);
    const newMessages: MessageProps[] = [];
    // We can't use structuredClone since messages contains functions, but we can't mutate
    // items that are going into state or the UI won't update correctly
    messages.forEach((message) => newMessages.push(message));
    // It's important to set a timestamp prop since the Message components re-render.
    // The timestamps re-render with them.
    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    });
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      isLoading: true,
      avatar: patternflyAvatar,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      // We can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        isLoading: false,
        avatar: patternflyAvatar,
        timestamp: date.toLocaleString(),
        actions: {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }
      });
      setMessages(loadedMessages);
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    }, 5000);
  };

  return (
    <>
      <FormGroup role="radiogroup" isInline fieldId="basic-form-radio-group" label="Position">
        <Radio
          isChecked={position === 'top'}
          onChange={() => setPosition('top')}
          name="basic-inline-radio"
          label="Top"
          id="top"
        />
        <Radio
          isChecked={position === 'bottom'}
          onChange={() => setPosition('bottom')}
          name="basic-inline-radio"
          label="Bottom"
          id="bottom"
        />
      </FormGroup>
      <Chatbot displayMode={displayMode} isVisible={isVisible}>
        <ChatbotContent>
          {/* Update the announcement prop on MessageBox whenever a new message is sent
        so that users of assistive devices receive sufficient context  */}
          <MessageBox announcement={announcement} position={position}>
            {messages.length === 0 && (
              <ChatbotWelcomePrompt title="Hi, ChatBot User!" description="How can I help you today?" />
            )}
            {/* This code block enables scrolling to the top of the last message.
          You can instead choose to move the div with scrollToBottomRef on it below 
          the map of messages, so that users are forced to scroll to the bottom.
          If you are using streaming, you will want to take a different approach; 
          see: https://github.com/patternfly/chatbot/issues/201#issuecomment-2400725173 */}
            {messages.map((message, index) => {
              if (index === messages.length - 1) {
                return (
                  <>
                    <div ref={scrollToBottomRef}></div>
                    <Message key={message.id} {...message} />
                  </>
                );
              }
              return <Message key={message.id} {...message} />;
            })}
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <MessageBar onSendMessage={handleSend} hasMicrophoneButton isSendButtonDisabled={isSendButtonDisabled} />
        </ChatbotFooter>
      </Chatbot>
    </>
  );
};
