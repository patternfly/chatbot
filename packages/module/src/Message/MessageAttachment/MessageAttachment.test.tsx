import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageAttachment from './MessageAttachment';

test('Renders with children', () => {
  render(<MessageAttachment>Test content</MessageAttachment>);
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders with pf-chatbot__message-attachment class by default', () => {
  render(<MessageAttachment>Test content</MessageAttachment>);
  expect(screen.getByText('Test content')).toHaveClass('pf-chatbot__message-attachment', { exact: true });
});

test('Renders with custom className', () => {
  render(<MessageAttachment className="custom-class">Test content</MessageAttachment>);
  expect(screen.getByText('Test content')).toHaveClass('custom-class');
});

test('Spreads additional props', () => {
  render(<MessageAttachment id="test-id">Test content</MessageAttachment>);
  expect(screen.getByText('Test content')).toHaveAttribute('id', 'test-id');
});
