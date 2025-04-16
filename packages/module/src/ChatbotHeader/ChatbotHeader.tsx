import React from 'react';

import { Divider } from '@patternfly/react-core';

export interface ChatbotHeaderProps extends React.HTMLProps<HTMLDivElement> {
  /** Content to be displayed in the chatbot header */
  children: React.ReactNode;
  /** Custom classname for the header component */
  className?: string;
}

export const ChatbotHeader: React.FunctionComponent<ChatbotHeaderProps> = ({
  className,
  children
}: ChatbotHeaderProps) => (
  <div className="pf-chatbot__header-container">
    <div className={`pf-chatbot__header${className ? ` ${className}` : ''}`}>{children}</div>
    <Divider className="pf-chatbot__header__divider" />
  </div>
);

export default ChatbotHeader;
