// ============================================================================
// Chatbot Main
// ============================================================================
import type { HTMLProps, FunctionComponent } from 'react';

export interface ChatbotContentProps extends HTMLProps<HTMLDivElement> {
  /** Content to be displayed in the chatbot */
  children: React.ReactNode;
  /** Custom classname for the ChatbotContent component */
  className?: string;
  /** Sets background color to primary */
  isPrimary?: boolean;
}

export const ChatbotContent: FunctionComponent<ChatbotContentProps> = ({
  children,
  className,
  isPrimary,
  ...props
}: ChatbotContentProps) => (
  <div className={`pf-chatbot__content ${isPrimary ? 'pf-m-primary' : ''} ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export default ChatbotContent;
