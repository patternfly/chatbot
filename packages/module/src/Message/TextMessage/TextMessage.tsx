// ============================================================================
// Chatbot Main - Message - Content - Text
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { Content, ContentProps } from '@patternfly/react-core';

export interface TextMessageProps {
  isPrimary?: boolean;
}

const TextMessage = ({
  component,
  children,
  isPrimary,
  ...props
}: Omit<ContentProps, 'ref'> & ExtraProps & TextMessageProps) => (
  <span className={`pf-chatbot__message-text ${isPrimary ? 'pf-m-primary' : ''}`}>
    <Content component={component} {...props}>
      {children}
    </Content>
  </span>
);

export default TextMessage;
