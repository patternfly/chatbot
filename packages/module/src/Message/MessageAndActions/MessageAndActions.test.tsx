import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageAndActions from './MessageAndActions';

test('Renders with children', () => {
  render(<MessageAndActions>Test content</MessageAndActions>);
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders with pf-chatbot__message-and-actions class by default', () => {
  render(<MessageAndActions>Test content</MessageAndActions>);
  expect(screen.getByText('Test content')).toHaveClass('pf-chatbot__message-and-actions', { exact: true });
});

test('Renders with custom className', () => {
  render(<MessageAndActions className="custom-class">Test content</MessageAndActions>);
  expect(screen.getByText('Test content')).toHaveClass('custom-class');
});

test('Spreads additional props', () => {
  render(<MessageAndActions id="test-id">Test content</MessageAndActions>);
  expect(screen.getByText('Test content')).toHaveAttribute('id', 'test-id');
});
