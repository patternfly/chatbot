// ============================================================================
// Terms of Use Modal - Chatbot Modal Extension
// ============================================================================
import React from 'react';
import { Button, Content, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@patternfly/react-core';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal from '../ChatbotModal/ChatbotModal';

export interface TermsOfUseProps extends ModalProps {
  /** Class applied to modal */
  className?: string;
  /** Action assigned to primary modal button */
  onPrimaryAction?: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Action assigned to secondary modal button */
  onSecondaryAction: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Name of primary modal button */
  primaryActionBtn?: string;
  /** Name of secondary modal button */
  secondaryActionBtn?: string;
  /** Function that handles modal toggle */
  handleModalToggle: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Whether modal is open */
  isModalOpen: boolean;
  /** Title of modal */
  title?: string;
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Optional image displayed in header */
  image?: string;
  /** Alt text for optional image displayed in header */
  altText?: string;
  /** Ref applied to modal */
  innerRef?: React.Ref<HTMLDivElement>;
  /** OuiaID applied to modal */
  ouiaId?: string;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
}

export const TermsOfUseBase: React.FunctionComponent<TermsOfUseProps> = ({
  handleModalToggle,
  isModalOpen,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionBtn = 'Accept',
  secondaryActionBtn = 'Decline',
  title = 'Terms of use',
  image,
  altText,
  displayMode = ChatbotDisplayMode.default,
  className,
  children,
  innerRef,
  ouiaId = 'TermsOfUse',
  isCompact,
  ...props
}: TermsOfUseProps) => {
  const handlePrimaryAction = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onPrimaryAction && onPrimaryAction(_event);
  };

  const handleSecondaryAction = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    onSecondaryAction(_event);
  };

  const modal = (
    <ChatbotModal
      isOpen={isModalOpen}
      ouiaId={ouiaId}
      aria-labelledby="terms-of-use-title"
      aria-describedby="terms-of-use-modal"
      className={`pf-chatbot__terms-of-use-modal pf-chatbot__terms-of-use-modal--${displayMode} ${isCompact ? 'pf-chatbot__terms-of-use--compact' : ''} ${className ? className : ''}`}
      displayMode={displayMode}
      {...props}
    >
      {/* This is a workaround since the PatternFly modal doesn't have ref forwarding */}
      <section className={`pf-chatbot__terms-of-use--section`} aria-label={title} tabIndex={-1} ref={innerRef}>
        <ModalHeader className="pf-chatbot__terms-of-use--modal-header">
          <div className="pf-chatbot__terms-of-use--header">
            {!isCompact && image && altText && (
              <img src={image} className="pf-chatbot__terms-of-use--image" alt={altText} />
            )}
            <h1 className="pf-chatbot__terms-of-use--title">{title}</h1>
          </div>
        </ModalHeader>
        <ModalBody className="pf-chatbot__terms-of-use--modal-body">
          <Content>{children}</Content>
        </ModalBody>
        <ModalFooter className="pf-chatbot__terms-of-use--footer">
          <Button
            isBlock
            key="terms-of-use-modal-primary"
            variant="primary"
            onClick={handlePrimaryAction}
            form="terms-of-use-form"
            size="lg"
          >
            {primaryActionBtn}
          </Button>
          <Button
            isBlock
            key="terms-of-use-modal-secondary"
            variant="secondary"
            onClick={handleSecondaryAction}
            size="lg"
          >
            {secondaryActionBtn}
          </Button>
        </ModalFooter>
      </section>
    </ChatbotModal>
  );

  return modal;
};

const TermsOfUse = React.forwardRef((props: TermsOfUseProps, ref: React.Ref<HTMLDivElement>) => (
  <TermsOfUseBase innerRef={ref} {...props} />
));

export default TermsOfUse;
