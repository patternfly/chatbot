// ============================================================================
// Chatbot
// ============================================================================
import type { Ref, FunctionComponent } from 'react';

import { forwardRef } from 'react';

export interface ChatbotProps {
  /** Content to be displayed in the chatbot */
  children: React.ReactNode;
  /** Display Mode for the Chatbot */
  displayMode?: ChatbotDisplayMode;
  /** Visibility flag for the chatbot */
  isVisible?: boolean;
  /** Custom classname for the Chatbot component */
  className?: string;
  /** Ref applied to chatbot  */
  innerRef?: React.Ref<HTMLDivElement>;
  /** Custom aria label applied to focusable container */
  ariaLabel?: string;
  /** Density of information within the ChatBot */
  isCompact?: boolean;
}

export enum ChatbotDisplayMode {
  default = 'default',
  embedded = 'embedded',
  docked = 'docked',
  fullscreen = 'fullscreen',
  drawer = 'drawer'
}

const ChatbotBase: FunctionComponent<ChatbotProps> = ({
  children,
  displayMode = ChatbotDisplayMode.default,
  isVisible = true,
  className,
  innerRef,
  ariaLabel,
  isCompact,
  ...props
}: ChatbotProps) => (
  <div
    className={`pf-chatbot pf-chatbot--${displayMode} ${!isVisible ? 'pf-chatbot--hidden' : 'pf-chatbot--visible'}  ${isCompact ? 'pf-m-compact' : ''} ${className ?? ''}`}
    {...props}
  >
    {/* Ref is intended for use with skip to chatbot links, etc. */}
    {isVisible ? (
      <section
        aria-label={ariaLabel ?? 'Chatbot'}
        className={`pf-chatbot-container pf-chatbot-container--${displayMode} ${!isVisible ? 'pf-chatbot-container--hidden' : ''}`}
        tabIndex={-1}
        ref={innerRef}
      >
        {children}
      </section>
    ) : undefined}
  </div>
);

const Chatbot = forwardRef((props: ChatbotProps, ref: Ref<HTMLDivElement>) => (
  <ChatbotBase innerRef={ref} {...props} />
));

export default Chatbot;
