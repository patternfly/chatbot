// ============================================================================
// Chatbot Toggle
// ============================================================================
import type { Ref, FunctionComponent } from 'react';

import { forwardRef } from 'react';
import { Button, ButtonProps, Tooltip, TooltipProps, Icon } from '@patternfly/react-core';
import RhMicronsCaretDownIcon from '@patternfly/react-icons/dist/esm/icons/rh-microns-caret-down-icon';

export interface ChatbotToggleProps extends ButtonProps {
  /** Contents of the tooltip applied to the toggle button */
  tooltipLabel: React.ReactNode;
  /** Props spread to the PF Tooltip component */
  tooltipProps?: Omit<TooltipProps, 'content'>;
  /** Flag indicating visibility of the chatbot appended to the toggle */
  isChatbotVisible?: boolean;
  /** Callback fired when toggle button is clicked */
  onToggleChatbot?: () => void;
  /** Accessible label for the toggle button */
  toggleButtonLabel?: string;
  /** An image displayed in the chatbot toggle when it is closed */
  closedToggleIcon?: () => JSX.Element;
  /** Ref applied to toggle */
  innerRef?: React.Ref<HTMLButtonElement>;
  /** Whether toggle is a circle */
  isRound?: boolean;
  /** Class name applied to toggle */
  className?: string;
  /** Test id applied to default open icon */
  openIconTestId?: string;
  /** Color variant applied to the toggle button */
  colorVariant?: 'default' | 'secondary';
}

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="31" viewBox="0 0 33 31" fill="none">
    <g clipPath="url(#clip0_11685_20917)">
      <path
        d="M29.7 11.0714H17.6V7.75H19.525C20.2834 7.75 20.9 7.12939 20.9 6.36607V1.38393C20.9 0.620609 20.2834 0 19.525 0H13.475C12.7166 0 12.1 0.620609 12.1 1.38393V6.36607C12.1 7.12939 12.7166 7.75 13.475 7.75H15.4V11.0714H3.3C1.48027 11.0714 0 12.5613 0 14.3929V27.6786C0 29.5101 1.48027 31 3.3 31H29.7C31.5197 31 33 29.5101 33 27.6786V14.3929C33 12.5613 31.5197 11.0714 29.7 11.0714ZM14.3 2.21429H18.7V5.53571H14.3V2.21429ZM30.8 27.6786C30.8 28.2894 30.3069 28.7857 29.7 28.7857H3.3C2.6936 28.7857 2.2 28.2894 2.2 27.6786V14.3929C2.2 13.7825 2.6936 13.2857 3.3 13.2857H29.7C30.3069 13.2857 30.8 13.7825 30.8 14.3929V27.6786ZM8.525 17.7143V19.9286C8.525 20.387 8.15547 20.7589 7.7 20.7589H5.5C5.04453 20.7589 4.675 20.387 4.675 19.9286V17.7143C4.675 17.2559 5.04453 16.8839 5.5 16.8839H7.7C8.15547 16.8839 8.525 17.2559 8.525 17.7143ZM28.325 17.7143V19.9286C28.325 20.387 27.9555 20.7589 27.5 20.7589H25.3C24.8445 20.7589 24.475 20.387 24.475 19.9286V17.7143C24.475 17.2559 24.8445 16.8839 25.3 16.8839H27.5C27.9555 16.8839 28.325 17.2559 28.325 17.7143ZM20.5691 22.6683C20.8893 23.0965 20.8033 23.703 20.3779 24.0241C19.2521 24.8761 17.9115 25.3259 16.5 25.3259C15.0885 25.3259 13.7473 24.8761 12.6215 24.0241C12.1961 23.703 12.1107 23.0965 12.4298 22.6683C12.7494 22.2391 13.3536 22.1526 13.7774 22.4759C15.3576 23.6695 17.6408 23.6695 19.2221 22.4759C19.6475 22.1515 20.2512 22.2402 20.5691 22.6683Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_11685_20917">
        <rect width="33" height="31" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);

const ChatbotToggleBase: FunctionComponent<ChatbotToggleProps> = ({
  tooltipLabel,
  isChatbotVisible,
  onToggleChatbot,
  tooltipProps,
  toggleButtonLabel,
  closedToggleIcon: ClosedToggleIcon,
  innerRef,
  isRound = true,
  className,
  openIconTestId,
  colorVariant = 'default',
  ...props
}: ChatbotToggleProps) => {
  // Configure icon
  const closedIcon = ClosedToggleIcon ? <ClosedToggleIcon /> : <ChatIcon />;
  const icon = isChatbotVisible ? <RhMicronsCaretDownIcon data-testid={openIconTestId} /> : closedIcon;

  return (
    <Tooltip
      content={tooltipLabel}
      // prevents VO announcements of both aria label and tooltip
      aria="none"
      {...tooltipProps}
    >
      <Button
        className={`pf-chatbot__button ${colorVariant === 'secondary' ? 'pf-chatbot__button--secondary' : ''} ${isChatbotVisible ? 'pf-chatbot__button--active' : ''} ${isRound ? 'pf-chatbot__button--round' : ''} ${className ? className : ''}`}
        variant="plain"
        aria-label={toggleButtonLabel || `${tooltipLabel} toggle`}
        onClick={onToggleChatbot}
        aria-expanded={isChatbotVisible}
        icon={<Icon isInline>{icon}</Icon>}
        ref={innerRef}
        {...props}
      >
        {/* Notification dot placeholder */}
      </Button>
    </Tooltip>
  );
};

const ChatbotToggle = forwardRef((props: ChatbotToggleProps, ref: Ref<any>) => (
  <ChatbotToggleBase innerRef={ref} {...props} />
));

export default ChatbotToggle;
