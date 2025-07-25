import { fireEvent, render, screen } from '@testing-library/react';
import { ChatbotHeaderNewChatButton } from './ChatbotHeaderNewChatButton';
import '@testing-library/jest-dom';

describe('ChatbotHeaderNewChatButton', () => {
  it('should render ChatbotHeaderNewChatButton', () => {
    const { container } = render(
      <ChatbotHeaderNewChatButton className="custom-header-new-chat-button" onClick={jest.fn()} />
    );

    expect(container.querySelector('.custom-header-new-chat-button')).toBeTruthy();
  });

  it('should call onClick handler when new chat button is pressed', () => {
    const onClick = jest.fn();
    render(<ChatbotHeaderNewChatButton className="custom-header-new-chat-button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'New chat' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('should render button with isCompact', () => {
    render(<ChatbotHeaderNewChatButton data-testid="new-chat-button" onClick={jest.fn()} isCompact />);
    expect(screen.getByTestId('new-chat-button')).toHaveClass('pf-m-compact');
  });
});
