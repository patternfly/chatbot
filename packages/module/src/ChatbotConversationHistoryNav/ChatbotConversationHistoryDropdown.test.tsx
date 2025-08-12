import '@testing-library/jest-dom';
import { DropdownItem } from '@patternfly/react-core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ChatbotConversationHistoryDropdown from './ChatbotConversationHistoryDropdown';

describe('ChatbotConversationHistoryDropdown', () => {
  const onSelect = jest.fn();
  const menuItems = (
    <>
      <DropdownItem>Rename</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </>
  );

  it('should render the dropdown', () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} menuClassName="custom-class" />);
    expect(screen.queryByRole('menuitem', { name: /Conversation options/i })).toBeInTheDocument();
  });

  it('should display the dropdown menuItems', () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} />);

    const toggle = screen.queryByRole('menuitem', { name: /Conversation options/i })!;

    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);

    waitFor(() => {
      expect(screen.getByText('Rename')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('should invoke onSelect callback when menuitem is clicked', () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} onSelect={onSelect} />);
    const toggle = screen.queryByRole('menuitem', { name: /Conversation options/i })!;
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Rename'));

    expect(onSelect).toHaveBeenCalled();
  });

  it('should toggle the dropdown when menuitem is clicked', () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} onSelect={onSelect} />);
    const toggle = screen.queryByRole('menuitem', { name: /Conversation options/i })!;
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Delete'));

    expect(onSelect).toHaveBeenCalled();

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should close the dropdown when user clicks outside', () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} onSelect={onSelect} />);
    const toggle = screen.queryByRole('menuitem', { name: /Conversation options/i })!;
    fireEvent.click(toggle);

    expect(screen.queryByText('Delete')).toBeInTheDocument();
    fireEvent.click(toggle.parentElement!);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should show the tooltip when the user hovers over the toggle button', async () => {
    render(<ChatbotConversationHistoryDropdown menuItems={menuItems} label="Actions dropdown" />);
    const toggle = screen.queryByRole('menuitem', { name: /Actions dropdown/i })!;

    fireEvent(
      toggle,
      new MouseEvent('mouseenter', {
        bubbles: false,
        cancelable: false
      })
    );

    await waitFor(() => {
      expect(screen.queryByText('Actions dropdown')).toBeInTheDocument();
    });
  });
});
