// ============================================================================
// Code Modal - Chatbot Modal with Code Editor
// ============================================================================
import React from 'react';

// Import PatternFly components
import { Modal, ModalProps } from '@patternfly/react-core';
import { ChatbotDisplayMode } from '../Chatbot';

export interface ChatbotModalProps extends Omit<ModalProps, 'ref'> {
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Additional className applied to modal */
  className?: string;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
}

export const ChatbotModal: React.FunctionComponent<ChatbotModalProps> = ({
  children,
  displayMode = ChatbotDisplayMode.default,
  className,
  isOpen,
  isCompact,
  ...props
}: ChatbotModalProps) => {
  const modal = (
    <Modal
      isOpen={isOpen}
      ouiaId="ChatbotModal"
      aria-labelledby="chatbot-modal-title"
      aria-describedby="chatbot-modal"
      className={`pf-chatbot__chatbot-modal pf-chatbot__chatbot-modal--${displayMode} ${isCompact ? 'pf-chatbot__chatbot-modal-compact' : ''} ${className}`}
      backdropClassName="pf-chatbot__chatbot-modal-backdrop"
      {...props}
    >
      {children}
    </Modal>
  );

  if ((displayMode === ChatbotDisplayMode.fullscreen || displayMode === ChatbotDisplayMode.embedded) && isOpen) {
    return <div className="pf-v6-c-backdrop pf-chatbot__backdrop">{modal}</div>;
  }
  return modal;
};

export default ChatbotModal;
