// ============================================================================
// Chatbot Main - Message Divider
// ============================================================================
import type { FunctionComponent } from 'react';

export interface MessageDividerProps {
  /** Variant of the divider */
  variant?: 'date' | 'announcement';
  /** Content of the message divider */
  content?: string;
}

const MessageDivider: FunctionComponent<MessageDividerProps> = ({
  variant = 'date',
  content = new Date().toLocaleDateString(),
  ...props
}: MessageDividerProps) => {
  if (variant === 'date') {
    return (
      <div className="pf-chatbot__message-divider" {...props}>
        <div className="pf-chatbot__message-divider--date">
          <div className="pf-chatbot__message-divider-content">
            <div className="pf-chatbot__message-divider-text">{content}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-chatbot__message-divider pf-chatbot__message-divider--announcement" {...props}>
      <div className="pf-chatbot__message-divider-content">
        <div className="pf-chatbot__message-divider-text">{content}</div>
      </div>
    </div>
  );
};

export default MessageDivider;
