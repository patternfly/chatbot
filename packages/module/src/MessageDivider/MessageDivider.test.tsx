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
    expect(screen.getByTestId('message-divider')).toHaveClass('pf-m-divider');
  });
  it('should render inset variant correctly', () => {
    render(<MessageDivider variant="inset" content="test" data-testid="message-divider" />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByTestId('message-divider')).toHaveClass('pf-m-divider');
  });
  it('should render fullWidth variant correctly', () => {
    render(<MessageDivider variant="fullWidth" content="test" data-testid="message-divider" />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByTestId('message-divider')).toHaveClass('pf-m-block');
  });
});
