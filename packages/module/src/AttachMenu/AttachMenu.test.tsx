import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownGroup, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import '@testing-library/jest-dom';
import AttachMenu, { AttachMenuProps } from './AttachMenu';

const renderAttachMenu = (props: Partial<AttachMenuProps> = {}) =>
  render(
    <AttachMenu
      isOpen
      onOpenChange={jest.fn()}
      toggle={(toggleRef) => (
        <MenuToggle ref={toggleRef} isExpanded>
          Attach
        </MenuToggle>
      )}
      filteredItems={
        <DropdownGroup label="Resources">
          <DropdownList>
            <DropdownItem value="logs" description="Recent log entries">
              Logs
            </DropdownItem>
            <DropdownItem value="events">Events</DropdownItem>
          </DropdownList>
        </DropdownGroup>
      }
      {...props}
    />
  );

describe('AttachMenu', () => {
  it('renders supplied groups, items, and descriptions without an optional search input', async () => {
    renderAttachMenu();

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Resources' })).toBeVisible());
    expect(screen.getByRole('menuitem', { name: /Logs/ })).toBeVisible();
    expect(screen.getByText('Recent log entries')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Events' })).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('does not show menu content when closed', () => {
    renderAttachMenu({ isOpen: false });

    expect(screen.getByRole('button', { name: 'Attach' })).toBeVisible();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('preserves the component class and forwards custom classes and menu props', () => {
    renderAttachMenu({ className: 'custom-attach-menu', 'aria-label': 'Attachment resources', id: 'attach-menu' });

    const menu = screen.getByLabelText('Attachment resources');
    expect(menu).toHaveClass('pf-chatbot__menu', 'custom-attach-menu');
    expect(menu).toHaveAttribute('id', 'attach-menu');
  });

  it('renders optional search and forwards input changes', async () => {
    const user = userEvent.setup();
    const handleTextInputChange = jest.fn();
    renderAttachMenu({ handleTextInputChange, searchInputPlaceholder: 'Search resources...' });

    const input = screen.getByRole('textbox', { name: 'Filter menu items' });
    expect(input).toHaveAttribute('placeholder', 'Search resources...');

    await user.type(input, 'logs');

    expect(handleTextInputChange).toHaveBeenLastCalledWith('logs');
  });

  it('forwards custom search labels and props', () => {
    renderAttachMenu({
      handleTextInputChange: jest.fn(),
      searchInputAriaLabel: 'Search attachment resources',
      searchInputProps: { isDisabled: true },
      menuSearchProps: { className: 'custom-menu-search' },
      menuSearchInputProps: { className: 'custom-menu-search-input' }
    });

    const input = screen.getByRole('textbox', { name: 'Search attachment resources' });
    expect(input).toBeDisabled();
    expect(input.closest('.custom-menu-search')).toBeInTheDocument();
    expect(input.closest('.custom-menu-search-input')).toBeInTheDocument();
  });

  it('forwards the selected item value', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    renderAttachMenu({ onSelect });

    await user.click(screen.getByRole('menuitem', { name: 'Events' }));

    expect(onSelect).toHaveBeenCalledWith(expect.anything(), 'events');
  });

  it('requests closure on the configured Escape key', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    renderAttachMenu({ onOpenChange, onOpenChangeKeys: ['Escape'], handleTextInputChange: jest.fn() });

    await user.click(screen.getByRole('textbox', { name: 'Filter menu items' }));
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
