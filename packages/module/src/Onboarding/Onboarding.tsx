// ============================================================================
// Terms of Use Modal - Chatbot Modal Extension
// ============================================================================
import type { FunctionComponent, MouseEvent as ReactMouseEvent, Ref } from 'react';
import { forwardRef } from 'react';
import { Button, Content, ModalBody, ModalFooter, ModalHeader, ModalProps } from '@patternfly/react-core';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal from '../ChatbotModal/ChatbotModal';

export interface OnboardingProps extends ModalProps {
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

export const OnboardingBase: FunctionComponent<OnboardingProps> = ({
  handleModalToggle,
  isModalOpen,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionBtn = 'Continue',
  secondaryActionBtn = 'Skip',
  title = 'Onboarding',
  image,
  altText,
  displayMode = ChatbotDisplayMode.default,
  className,
  children,
  innerRef,
  ouiaId = 'Onboarding',
  isCompact,
  ...props
}: OnboardingProps) => {
  const handlePrimaryAction = (_event: ReactMouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onPrimaryAction && onPrimaryAction(_event);
  };

  const handleSecondaryAction = (_event: ReactMouseEvent | MouseEvent | KeyboardEvent) => {
    onSecondaryAction(_event);
  };

  const modal = (
    <ChatbotModal
      isOpen={isModalOpen}
      ouiaId={ouiaId}
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-modal"
      className={`pf-chatbot__onboarding-modal pf-chatbot__onboarding-modal--${displayMode} ${isCompact ? 'pf-m-compact' : ''} ${className ? className : ''}`}
      displayMode={displayMode}
      onClose={handleModalToggle}
      {...props}
    >
      {/* This is a workaround since the PatternFly modal doesn't have ref forwarding */}
      <section className={`pf-chatbot__onboarding--section`} aria-label={title} tabIndex={-1} ref={innerRef}>
        <ModalHeader className="pf-chatbot__onboarding--modal-header">
          <div className="pf-chatbot__onboarding--header">
            {!isCompact && image && altText && (
              <img src={image} className="pf-chatbot__onboarding--image" alt={altText} />
            )}
            <h1 className="pf-chatbot__onboarding--title">{title}</h1>
          </div>
        </ModalHeader>
        <ModalBody className="pf-chatbot__onboarding--modal-body">
          <Content>{children}</Content>
        </ModalBody>
        <ModalFooter className="pf-chatbot__onboarding--footer">
          <Button
            isBlock
            key="onboarding-modal-primary"
            variant="primary"
            onClick={handlePrimaryAction}
            form="onboarding-form"
            size="lg"
          >
            {primaryActionBtn}
          </Button>
          <Button
            isBlock
            key="onboarding-modal-secondary"
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

const Onboarding = forwardRef((props: OnboardingProps, ref: Ref<HTMLDivElement>) => (
  <OnboardingBase innerRef={ref} {...props} />
));

export default Onboarding;
