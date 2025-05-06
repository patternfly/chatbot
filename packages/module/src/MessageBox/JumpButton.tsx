// ============================================================================
// Chatbot Main - Messages - Jump to Top
// ============================================================================
import type { FunctionComponent } from 'react';

// Import PatternFly components
import { Button, Tooltip, Icon } from '@patternfly/react-core';

import { ArrowUpIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-up-icon';
import { ArrowDownIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-down-icon';

export interface JumpButtonProps {
  /** Position of the Jump Button(top/bottom) */
  position: 'top' | 'bottom';
  /** Callback for the onClick event */
  onClick: () => void;
  /** Flag to change the visibilty of the button */
  isHidden?: boolean;
}

const JumpButton: FunctionComponent<JumpButtonProps> = ({ position, isHidden, onClick }: JumpButtonProps) =>
  isHidden ? null : (
    <Tooltip id={`pf-chatbot__tooltip--jump-${position}`} content={`Back to ${position}`} position="top">
      <Button
        variant="plain"
        className={`pf-chatbot__jump pf-chatbot__jump--${position}`}
        aria-label={`Jump ${position}`}
        onClick={onClick}
      >
        <Icon iconSize="lg" isInline>
          {position === 'top' ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Icon>
      </Button>
    </Tooltip>
  );

export default JumpButton;
