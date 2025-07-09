import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageDivider from './MessageDivider';

describe('MessageDivider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render default correctly with variant = date and content = new Date().toLocaleDateString()', () => {
    render(<MessageDivider data-testid="message-divider" />);
    expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByTestId('message-divider').children[0]).toHaveClass('pf-chatbot__message-divider--date');
  });
  it('should render date variant correctly', () => {
    render(<MessageDivider variant="date" content="test" data-testid="message-divider" />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByTestId('message-divider').children[0]).toHaveClass('pf-chatbot__message-divider--date');
  });
  it('should render announcement variant correctly', () => {
    render(<MessageDivider variant="announcement" content="test" data-testid="message-divider" />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByTestId('message-divider')).toHaveClass('pf-chatbot__message-divider--announcement');
  });
});
