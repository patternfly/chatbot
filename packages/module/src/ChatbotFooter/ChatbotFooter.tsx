// ============================================================================
// Chatbot Footer
// ============================================================================

// Global footer component
// Supports:
// - Message bar
// - Footnote
// - Footnote popover

import type { HTMLProps, FunctionComponent } from 'react';

import { Divider } from '@patternfly/react-core';

export interface ChatbotFooterProps extends HTMLProps<HTMLDivElement> {
  /** Children for the footer - supports MessageBar and FootNote components*/
  children?: React.ReactNode;
  /** Custom classname for the footer component */
  className?: string;
  /** Sets footer to compact styling. */
  isCompact?: boolean;
  /** Sets background color to primary */
  isPrimary?: boolean;
}

export const ChatbotFooter: FunctionComponent<ChatbotFooterProps> = ({
  children,
  className,
  isCompact,
  isPrimary,
  ...props
}: ChatbotFooterProps) => (
  <div
    className={`pf-chatbot__footer ${isCompact ? 'pf-m-compact' : ''} ${isPrimary ? 'pf-m-primary' : ''} ${className ?? ''}`}
    {...props}
  >
    <Divider />
    <div className="pf-chatbot__footer-container">{children}</div>
  </div>
);

export default ChatbotFooter;
