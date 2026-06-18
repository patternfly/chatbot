import type { FunctionComponent, Ref } from 'react';
import { useState } from 'react';

import {
  Tooltip,
  TooltipProps,
  Dropdown,
  DropdownProps,
  MenuToggle,
  MenuToggleElement,
  Icon,
  MenuToggleProps
} from '@patternfly/react-core';
import EllipsisIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import RhUiEllipsisHorizontalFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-ellipsis-horizontal-fill-icon';

export interface ChatbotHeaderOptionsDropdownProps extends Omit<DropdownProps, 'toggle'> {
  /** Content to be displayed in the chatbot header */
  children: React.ReactNode;
  /** Custom classname for the header component */
  className?: string;
  /** Props spread to the PF Tooltip component wrapping the display mode dropdown */
  tooltipProps?: TooltipProps;
  /** Aria label for menu toggle */
  menuToggleAriaLabel?: string;
  /** Sets menu to compact styling. */
  isCompact?: boolean;
  /** Additional props passed to toggle */
  toggleProps?: MenuToggleProps;
}

export const ChatbotHeaderOptionsDropdown: FunctionComponent<ChatbotHeaderOptionsDropdownProps> = ({
  className,
  children,
  onSelect,
  tooltipProps,
  menuToggleAriaLabel = 'Chatbot options',
  isCompact,
  toggleProps,
  ...props
}: ChatbotHeaderOptionsDropdownProps) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <Tooltip
      className="pf-chatbot__tooltip"
      content="Chatbot options"
      position="bottom"
      // prevents VO announcements of both aria label and tooltip
      aria="none"
      {...tooltipProps}
    >
      <MenuToggle
        className={`pf-chatbot__button--toggle-options ${isCompact ? 'pf-m-compact' : ''}`}
        variant="plain"
        aria-label={menuToggleAriaLabel}
        ref={toggleRef}
        icon={
          <Icon size={isCompact ? 'lg' : 'xl'} isInline>
            <RhUiEllipsisHorizontalFillIcon />
          </Icon>
        }
        isExpanded={isOptionsMenuOpen}
        onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
        size={isCompact ? 'sm' : undefined}
        {...toggleProps}
      />
    </Tooltip>
  );

  return (
    <Dropdown
      className={`pf-chatbot__options ${className ?? ''}`}
      isOpen={isOptionsMenuOpen}
      onSelect={(e, value) => {
        onSelect && onSelect(e, value);
        setIsOptionsMenuOpen(false);
      }}
      onOpenChange={(isOpen) => setIsOptionsMenuOpen(isOpen)}
      popperProps={{ position: 'right', preventOverflow: true, appendTo: 'inline' }}
      shouldFocusToggleOnSelect
      shouldFocusFirstItemOnOpen
      toggle={toggle}
      {...props}
    >
      {children}
    </Dropdown>
  );
};

export default ChatbotHeaderOptionsDropdown;
