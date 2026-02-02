import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageLoading from './MessageLoading';

test('Renders with pf-chatbot__message-loading class by default', () => {
  render(<MessageLoading data-testid="test-id" />);
  expect(screen.getByTestId('test-id')).toHaveClass('pf-chatbot__message-loading', { exact: true });
});

test('Renders with pf-m-primary class when isPrimary is true', () => {
  render(<MessageLoading data-testid="test-id" isPrimary />);
  expect(screen.getByTestId('test-id')).toHaveClass('pf-chatbot__message-loading pf-m-primary');
});

test('Renders loading word when loadingWord is passed', () => {
  render(<MessageLoading loadingWord="Loading message" />);
  expect(screen.getByText('Loading message')).toBeInTheDocument();
});

test('Spreads additional props', () => {
  render(<MessageLoading data-testid="test-id" id="custom-id" />);
  expect(screen.getByTestId('test-id')).toHaveAttribute('id', 'custom-id');
});
