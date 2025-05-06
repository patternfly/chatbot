import { FunctionComponent, useState } from 'react';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';

export const BasicDemo: FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(false);
  return (
    <ChatbotToggle
      tooltipLabel="Chatbot"
      isChatbotVisible={chatbotVisible}
      onToggleChatbot={() => setChatbotVisible(!chatbotVisible)}
    />
  );
};
