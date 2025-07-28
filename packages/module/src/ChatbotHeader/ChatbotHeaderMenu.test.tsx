import { fireEvent, render, screen } from '@testing-library/react';
import { ChatbotHeaderMenu } from './ChatbotHeaderMenu';
import '@testing-library/jest-dom';

describe('ChatbotHeaderMenu', () => {
  it('should render ChatbotHeaderMenu with custom class', () => {
    const { container } = render(<ChatbotHeaderMenu className="custom-header-menu" onMenuToggle={jest.fn()} />);

    expect(container.querySelector('.custom-header-menu')).toBeTruthy();
  });

  it('should call onMenuToggle when ChatbotHeaderMenu button is clicked', () => {
    const onMenuToggle = jest.fn();
    render(<ChatbotHeaderMenu className="custom-header-menu" onMenuToggle={onMenuToggle} />);
    fireEvent.click(screen.getByRole('button', { name: 'Chat history menu' }));

    expect(onMenuToggle).toHaveBeenCalled();
  });

  it('should handle isCompact', () => {
    render(
      <ChatbotHeaderMenu className="custom-header-menu" onMenuToggle={jest.fn()} isCompact data-testid="button" />
    );
    expect(screen.getByTestId('button')).toHaveClass('pf-m-compact');
  });
});
