// ============================================================================
// Message Attachments Container - Container for message attachments
// ============================================================================
import { FunctionComponent, HTMLProps, ReactNode } from 'react';
import { css } from '@patternfly/react-styles';

/**
 * The container to wrap MessageAttachment components. You must wrap any MessageAttachment components in this container.
 * Use this component when passing children to Message to customize its structure.
 */
export interface MessageAttachmentsContainerProps extends HTMLProps<HTMLDivElement> {
  /** Content to render inside the attachments container */
  children: ReactNode;
  /** Additional classes applied to the attachments container. */
  className?: string;
}

export const MessageAttachmentsContainer: FunctionComponent<MessageAttachmentsContainerProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={css('pf-chatbot__message-attachments-container', className)} {...props}>
    {children}
  </div>
);

export default MessageAttachmentsContainer;
