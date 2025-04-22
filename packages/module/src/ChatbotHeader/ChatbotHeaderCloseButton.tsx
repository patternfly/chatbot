import React from 'react';

import { Button, ButtonProps, Icon, Tooltip, TooltipProps } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';

export interface ChatbotHeaderCloseButtonProps extends ButtonProps {
  /** Callback function for when button is clicked */
  onClick: () => void;
  /** Custom classname for the header component */
  className?: string;
  /** Props spread to the PF Tooltip component wrapping the display mode dropdown */
  tooltipProps?: TooltipProps;
  /** Aria label for menu */
  menuAriaLabel?: string;
  /** Ref applied to menu */
  innerRef?: React.Ref<HTMLButtonElement>;
  /** Content used in tooltip */
  tooltipContent?: string;
  /** Sets button to compact styling. */
  isCompact?: boolean;
}

const ChatbotHeaderCloseButtonBase: React.FunctionComponent<ChatbotHeaderCloseButtonProps> = ({
  className,
  onClick,
  tooltipProps,
  menuAriaLabel = 'Close',
  innerRef,
  tooltipContent = 'Close',
  isCompact,
  ...props
}: ChatbotHeaderCloseButtonProps) => (
  <div className={`pf-chatbot__menu${className ? ` ${className}` : ''}`}>
    <Tooltip
      content={tooltipContent}
      position="bottom"
      // prevents VO announcements of both aria label and tooltip
      aria="none"
      {...tooltipProps}
    >
      <Button
        className={`pf-chatbot__button--toggle-menu ${isCompact ? 'pf-m-compact' : ''}`}
        variant="plain"
        onClick={onClick}
        aria-label={menuAriaLabel}
        ref={innerRef}
        icon={
          <Icon size={isCompact ? 'lg' : 'xl'} isInline>
            <CloseIcon />
          </Icon>
        }
        size={isCompact ? 'sm' : undefined}
        {...props}
      />
    </Tooltip>
  </div>
);

export const ChatbotHeaderCloseButton = React.forwardRef(
  (props: ChatbotHeaderCloseButtonProps, ref: React.Ref<HTMLButtonElement>) => (
    <ChatbotHeaderCloseButtonBase innerRef={ref} {...props} />
  )
);
