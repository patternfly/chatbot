// ============================================================================
// Chatbot Main - Messages - Jump to Top
// ============================================================================
import type { FunctionComponent } from 'react';

// Import PatternFly components
import { Button, Tooltip, Icon, TooltipProps, ButtonProps } from '@patternfly/react-core';

import { ArrowUpIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-up-icon';
import { ArrowDownIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-down-icon';

export interface JumpButtonProps {
  /** Position of the Jump Button(top/bottom) */
  position: 'top' | 'bottom';
  /** Callback for the onClick event */
  onClick: () => void;
  /** Flag to change the visibilty of the button */
  isHidden?: boolean;
  /** Additional props passed to jump buttons */
  jumpButtonProps?: ButtonProps;
  /** Additional props passed to tooltip */
  jumpButtonTooltipProps?: TooltipProps;
}

const JumpButton: FunctionComponent<JumpButtonProps> = ({
  position,
  isHidden,
  onClick,
  jumpButtonProps,
  jumpButtonTooltipProps
}: JumpButtonProps) =>
  isHidden ? null : (
    <Tooltip
      id={`pf-chatbot__tooltip--jump-${position}`}
      content={`Back to ${position}`}
      position="top"
      {...jumpButtonTooltipProps}
    >
      <Button
        variant="plain"
        className={`pf-chatbot__jump pf-chatbot__jump--${position}`}
        aria-label={`Back to ${position}`}
        onClick={onClick}
        tabIndex={2}
        {...jumpButtonProps}
      >
        <Icon iconSize="lg" isInline>
          {position === 'top' ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Icon>
      </Button>
    </Tooltip>
  );

export default JumpButton;
