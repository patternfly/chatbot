// ============================================================================
// Chatbot Main - Message Divider
// ============================================================================
import type { FunctionComponent } from 'react';
import { Divider, Label } from '@patternfly/react-core';

export interface MessageDividerProps {
  /** Variant of the divider */
  variant?: 'inset' | 'fullWidth';
  /** Content of the message divider */
  content?: string;
}

const MessageDivider: FunctionComponent<MessageDividerProps> = ({
  variant = 'inset',
  content = new Date().toLocaleDateString(),
  ...props
}: MessageDividerProps) => {
  if (variant === 'inset') {
    return (
      <div className="pf-chatbot__message-divider pf-m-divider pf-m-wrap" {...props}>
        <Divider />
        <Label variant="outline">{content}</Label>
      </div>
    );
  }

  return (
    <div className="pf-chatbot__message-divider pf-m-block pf-m-wrap" {...props}>
      <Label>{content}</Label>
    </div>
  );
};

export default MessageDivider;
