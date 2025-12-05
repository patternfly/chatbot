// ============================================================================
// Message Attachment - Container for a single message attachment
// ============================================================================
import { FunctionComponent, HTMLProps, ReactNode } from 'react';
import { css } from '@patternfly/react-styles';

/**
 * The container for a single message attachment item, typically the FileDetailsLabel component. You must wrap any attachment components in this container.
 * Use this component within MessageAttachmentsContainer when passing children to Message to customize its structure.
 */
export interface MessageAttachmentProps extends HTMLProps<HTMLDivElement> {
  /** Content to render inside a single attachment container */
  children: ReactNode;
  /** Additional classes applied to the attachment container. */
  className?: string;
}

export const MessageAttachment: FunctionComponent<MessageAttachmentProps> = ({ children, className, ...props }) => (
  <div className={css('pf-chatbot__message-attachment', className)} {...props}>
    {children}
  </div>
);

export default MessageAttachment;
