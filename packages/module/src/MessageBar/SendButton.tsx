// ============================================================================
// Chatbot Footer - Message Bar - Send
// ============================================================================
import type { FunctionComponent } from 'react';

// Import PatternFly components
import { Button, ButtonProps, Tooltip, TooltipProps } from '@patternfly/react-core';

import { PaperPlaneIcon } from '@patternfly/react-icons/dist/esm/icons/paper-plane-icon';

export interface SendButtonProps extends ButtonProps {
  /** Callback for when button is clicked */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Class Name for SendButton */
  className?: string;
  /** Props to control the PF Tooltip component */
  tooltipProps?: Omit<TooltipProps, 'content'>;
  /** English text "Send" used in the tooltip */
  tooltipContent?: string;
  /** Whether send button has compact styling */
  isCompact?: boolean;
}

export const SendButton: FunctionComponent<SendButtonProps> = ({
  className,
  onClick,
  tooltipProps,
  tooltipContent = 'Send',
  isCompact,
  ...props
}: SendButtonProps) => (
  <Tooltip
    id="pf-chatbot__tooltip--send"
    content={tooltipContent}
    position={tooltipProps?.position || 'top'}
    entryDelay={tooltipProps?.entryDelay || 0}
    exitDelay={tooltipProps?.exitDelay || 0}
    distance={tooltipProps?.distance || 8}
    animationDuration={tooltipProps?.animationDuration || 0}
    // prevents VO announcements of both aria label and tooltip
    aria="none"
    {...tooltipProps}
  >
    <Button
      variant="plain"
      isCircle
      className={`pf-chatbot__message-bar-button pf-chatbot__button--send ${isCompact ? 'pf-m-compact' : ''} ${className ?? ''}`}
      aria-label={props['aria-label'] || 'Send'}
      onClick={onClick}
      size={isCompact ? 'sm' : 'lg'}
      {...props}
    >
      <PaperPlaneIcon />
    </Button>
  </Tooltip>
);

export default SendButton;
