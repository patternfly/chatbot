import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChatbotHeaderSelectorDropdown } from './ChatbotHeaderSelectorDropdown';

describe('ChatbotHeaderSelectorDropdown', () => {
  const dropdownItems = (
    <>
      <DropdownItem>Option 1</DropdownItem>
      <DropdownItem>Option 2</DropdownItem>
      <DropdownItem>Option 3</DropdownItem>
    </>
  );

  it('should render ChatbotHeaderSelectorDropdown', () => {
    render(<ChatbotHeaderSelectorDropdown value="Option 1">{dropdownItems}</ChatbotHeaderSelectorDropdown>);

    expect(screen.getByRole('button', { name: /Select model/i })).toBeTruthy();
  });

  it('should call onselect handler when a dropdown item is clicked', async () => {
    const onSelect = jest.fn();
    const { container } = render(
      <ChatbotHeaderSelectorDropdown value="Option 1" className="custom-header-selector-dropdown" onSelect={onSelect}>
        {dropdownItems}
      </ChatbotHeaderSelectorDropdown>
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Select model/i }));
    });

    await waitFor(() => {
      expect(container.querySelector('.custom-header-selector-dropdown')).toBeTruthy();

      expect(screen.getByText('Option 3'));

      fireEvent.click(screen.getByText('Option 3'));

      expect(onSelect).toHaveBeenCalled();
    });
  });
});
