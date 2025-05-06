import { FunctionComponent } from 'react';
import { ChatbotFooter, ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';

export const ChatbotFooterExample: FunctionComponent = () => {
  const handleSend = (message) => alert(message);

  return (
    <ChatbotFooter>
      <MessageBar onSendMessage={handleSend} hasMicrophoneButton hasAttachButton />
      <ChatbotFootnote label="ChatBot uses AI. Check for mistakes." />
    </ChatbotFooter>
  );
};
