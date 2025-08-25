// ============================================================================
// Chatbot Main - Message - Content - Superscript (like for footnotes)
// ============================================================================

import { ExtraProps } from 'react-markdown';

const SuperscriptMessage = ({ children }: JSX.IntrinsicElements['sup'] & ExtraProps) => (
  <span className="pf-chatbot__message-superscript">
    <sup>{children}</sup>
  </span>
);

export default SuperscriptMessage;
