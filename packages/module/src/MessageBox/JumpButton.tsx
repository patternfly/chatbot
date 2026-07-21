// ============================================================================
// Chatbot Main - Messages - Jump to Top
// ============================================================================
import type { FunctionComponent } from 'react';
import { Button, Tooltip, Icon, TooltipProps, ButtonProps } from '@patternfly/react-core';
import { RhMicronsArrowDownIcon, RhMicronsArrowUpIcon } from '@patternfly/react-icons';

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
        {...jumpButtonProps}
      >
        <Icon iconSize="lg" isInline>
          {position === 'top' ? <RhMicronsArrowUpIcon /> : <RhMicronsArrowDownIcon />}
        </Icon>
      </Button>
    </Tooltip>
  );

export default JumpButton;
