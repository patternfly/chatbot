// ============================================================================
// Chatbot Main - Message Divider
// ============================================================================
import type { FunctionComponent } from 'react';

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
      <div className="pf-chatbot__message-divider" {...props}>
        <div className="pf-chatbot__message-divider--inset">
          <div className="pf-chatbot__message-divider-content">
            <div className="pf-chatbot__message-divider-text">{content}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-chatbot__message-divider pf-chatbot__message-divider--full-width" {...props}>
      <div className="pf-chatbot__message-divider-content">
        <div className="pf-chatbot__message-divider-text">{content}</div>
      </div>
    </div>
  );
};

export default MessageDivider;
