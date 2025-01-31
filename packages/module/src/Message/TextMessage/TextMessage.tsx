// ============================================================================
// Chatbot Main - Message - Content - Text
// ============================================================================

import React from 'react';
import { ExtraProps } from 'react-markdown';
import { Content, ContentProps } from '@patternfly/react-core';

const TextMessage = ({ component, children, ...props }: ContentProps & ExtraProps) => (
  <span className="pf-chatbot__message-text">
    <Content component={component} {...props}>
      {children}
    </Content>
  </span>
);

export default TextMessage;
