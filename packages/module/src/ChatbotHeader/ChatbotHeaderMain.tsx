import React from 'react';

export interface ChatbotHeaderMainProps {
  /** Custom classname for the header component */
  className?: string;
  /** Menu and/or chatbot header components */
  children: React.ReactNode;
}

export const ChatbotHeaderMain: React.FunctionComponent<ChatbotHeaderMainProps> = ({
  className,
  children
}: ChatbotHeaderMainProps) => (
  <div className={`pf-chatbot__header-main${className ? ` ${className}` : ''}`}>{children}</div>
);

export default ChatbotHeaderMain;
