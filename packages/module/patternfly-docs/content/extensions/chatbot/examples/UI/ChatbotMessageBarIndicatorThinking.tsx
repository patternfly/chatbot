import { FunctionComponent, useState } from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';

export const ChatbotMessageBarIndicatorThinking: FunctionComponent = () => {
  const [isThinking, setIsThinking] = useState(false);
  const handleSend = (_message: string | number) => {
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
    }, 10000);
  };

  return <MessageBar onSendMessage={handleSend} hasAiIndicator isThinking={isThinking} />;
};
