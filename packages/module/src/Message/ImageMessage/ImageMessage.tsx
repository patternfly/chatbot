// ============================================================================
// Chatbot Main - Message - Content - Image
// ============================================================================

import React from 'react';
import { ExtraProps } from 'react-markdown';

const ImageMessage = ({ children, ...props }: JSX.IntrinsicElements['img'] & ExtraProps) => (
  <img className="pf-chatbot__message-image" {...props}>
    {children}
  </img>
);

export default ImageMessage;
