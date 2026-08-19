/**
 * This is a minimal implementation of a ChatBot that goes beyond the minimal toggle examples
 */
import { useState } from 'react';
import Chatbot from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotFooter from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  const handleSend = (message: string | number) => {
    // eslint-disable-next-line no-console
    console.log(message);
  };

  return (
    <>
      <Chatbot isVisible={isVisible}>
        <ChatbotContent>
          <MessageBox>
            <Message role="bot" content="Hello! Tree-shaking is working." />
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <MessageBar onSendMessage={handleSend} hasMicrophoneButton />
        </ChatbotFooter>
      </Chatbot>
      <ChatbotToggle
        tooltipLabel="Open chat"
        isChatbotVisible={false}
        onToggleChatbot={() => setIsVisible(!isVisible)}
      />
    </>
  );
}
