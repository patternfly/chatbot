import type { Ref, FunctionComponent } from 'react';
import { forwardRef } from 'react';

import { Button, ButtonProps, Icon, Tooltip, TooltipProps } from '@patternfly/react-core';
import { PenToSquareIcon } from '@patternfly/react-icons/dist/esm/icons/pen-to-square-icon';

export interface ChatbotHeaderNewChatButtonProps extends ButtonProps {
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

const ChatbotHeaderNewChatButtonBase: FunctionComponent<ChatbotHeaderNewChatButtonProps> = ({
  className,
  onClick,
  tooltipProps,
  menuAriaLabel = 'New chat',
  innerRef,
  tooltipContent = 'New chat',
  isCompact,
  ...props
}: ChatbotHeaderNewChatButtonProps) => (
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
            <PenToSquareIcon />
          </Icon>
        }
        size={isCompact ? 'sm' : undefined}
        {...props}
      />
    </Tooltip>
  </div>
);

export const ChatbotHeaderNewChatButton = forwardRef(
  (props: ChatbotHeaderNewChatButtonProps, ref: Ref<HTMLButtonElement>) => (
    <ChatbotHeaderNewChatButtonBase innerRef={ref} {...props} />
  )
);
