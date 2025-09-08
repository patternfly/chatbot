import type { Ref, FunctionComponent } from 'react';
import { forwardRef } from 'react';

import { Button, ButtonProps, Icon, Tooltip, TooltipProps } from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';

export interface ChatbotHeaderMenuProps extends ButtonProps {
  /** Callback function to attach to menu toggle on top right of chatbot header. */
  onMenuToggle: () => void;
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
  /** Sets menu to compact styling. */
  isCompact?: boolean;
}

const ChatbotHeaderMenuBase: FunctionComponent<ChatbotHeaderMenuProps> = ({
  className,
  onMenuToggle,
  tooltipProps,
  menuAriaLabel = 'Chat history menu',
  innerRef,
  tooltipContent = 'Chat history menu',
  isCompact,
  ...props
}: ChatbotHeaderMenuProps) => (
  <div className={`pf-chatbot__menu ${className}`}>
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
        onClick={onMenuToggle}
        aria-label={menuAriaLabel}
        ref={innerRef}
        icon={
          <Icon size={isCompact ? 'lg' : 'xl'} isInline>
            <BarsIcon />
          </Icon>
        }
        size={isCompact ? 'sm' : undefined}
        {...props}
      />
    </Tooltip>
  </div>
);

export const ChatbotHeaderMenu = forwardRef((props: ChatbotHeaderMenuProps, ref: Ref<HTMLButtonElement>) => (
  <ChatbotHeaderMenuBase innerRef={ref} {...props} />
));
