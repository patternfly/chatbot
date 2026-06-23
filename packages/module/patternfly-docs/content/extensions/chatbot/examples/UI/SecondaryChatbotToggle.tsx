import { FunctionComponent, useState } from 'react';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';

export const SecondaryChatbotToggle: FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(false);

  return (
    <ChatbotToggle
      tooltipLabel="Virtual assistant"
      isChatbotVisible={chatbotVisible}
      onToggleChatbot={() => setChatbotVisible(!chatbotVisible)}
      colorVariant="secondary"
    />
  );
};
