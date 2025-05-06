// ============================================================================
// Chatbot Attachment Menu
// ============================================================================
import type { FunctionComponent } from 'react';

// Import PatternFly components
import {
  MenuSearch,
  MenuSearchInput,
  SearchInput,
  DropdownProps,
  Dropdown,
  DropdownToggleProps,
  DropdownPopperProps
} from '@patternfly/react-core';

export interface ExtendedDropdownPopperProps extends DropdownPopperProps {
  distance: string;
}

export interface AttachMenuProps extends DropdownProps {
  /** Items in menu */
  filteredItems: React.ReactNode;
  /** A callback for when the input value changes. */
  handleTextInputChange: (value: string) => void;
  /** Flag to indicate if menu is opened. */
  isOpen: boolean;
  /** Additional properties to pass to the Popper */
  popperProps?: ExtendedDropdownPopperProps;
  /** Callback to change the open state of the menu. Triggered by clicking outside of the menu. */
  onOpenChange: (isOpen: boolean) => void;
  /** Keys that trigger onOpenChange, defaults to tab and escape. It is highly recommended to include Escape in the array, while Tab may be omitted if the menu contains non-menu items that are focusable. */
  onOpenChangeKeys?: string[];
  /** Function callback called when user selects item. */
  onSelect?: (event?: React.MouseEvent<Element, MouseEvent>, value?: string | number) => void;
  /** Placeholder for search input */
  searchInputPlaceholder?: string;
  /** Aria label for search input */
  searchInputAriaLabel?: string;
  /** Toggle to be rendered */
  toggle: DropdownToggleProps | ((toggleRef: React.RefObject<any>) => React.ReactNode);
}

export const AttachMenu: FunctionComponent<AttachMenuProps> = ({
  className,
  filteredItems,
  handleTextInputChange,
  isOpen,
  popperProps = undefined,
  onOpenChange,
  onOpenChangeKeys,
  onSelect,
  searchInputPlaceholder,
  searchInputAriaLabel = 'Filter menu items',
  toggle,
  ...props
}: AttachMenuProps) => (
  <Dropdown
    className={`pf-chatbot__menu ${className ?? ''}`}
    isOpen={isOpen}
    onOpenChange={(isOpen) => onOpenChange(isOpen)}
    onOpenChangeKeys={onOpenChangeKeys ?? ['Esc']}
    toggle={toggle}
    popperProps={popperProps}
    onSelect={onSelect}
    {...props}
  >
    <MenuSearch>
      <MenuSearchInput>
        <SearchInput
          aria-label={searchInputAriaLabel}
          onChange={(_event, value) => handleTextInputChange(value)}
          placeholder={searchInputPlaceholder}
        />
      </MenuSearchInput>
    </MenuSearch>
    {filteredItems}
  </Dropdown>
);

export default AttachMenu;
