// ============================================================================
// Message And Actions - Container for message content and actions
// ============================================================================
import { FunctionComponent, HTMLProps, ReactNode } from 'react';
import { css } from '@patternfly/react-styles';

/**
 * The container that wraps the primary message content and inline actions, such as ToolCall, ToolResponse, DeepThinking, ResponseActions, etc.
 * Attachments should not be rendered inside this container.
 * Use this component when passing children to Message to customize its structure.
 */
export interface MessageAndActionsProps extends HTMLProps<HTMLDivElement> {
  /** Content to render inside the message and actions container. */
  children: ReactNode;
  /** Additional classes applied to the message and actions container. */
  className?: string;
}

export const MessageAndActions: FunctionComponent<MessageAndActionsProps> = ({ children, className, ...props }) => (
  <div className={css('pf-chatbot__message-and-actions', className)} {...props}>
    {children}
  </div>
);

export default MessageAndActions;
