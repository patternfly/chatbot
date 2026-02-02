import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageAttachmentItem from './MessageAttachmentItem';

test('Renders with children', () => {
  render(<MessageAttachmentItem>Test content</MessageAttachmentItem>);
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders with pf-chatbot__message-attachment class by default', () => {
  render(<MessageAttachmentItem>Test content</MessageAttachmentItem>);
  expect(screen.getByText('Test content')).toHaveClass('pf-chatbot__message-attachment', { exact: true });
});

test('Renders with custom className', () => {
  render(<MessageAttachmentItem className="custom-class">Test content</MessageAttachmentItem>);
  expect(screen.getByText('Test content')).toHaveClass('custom-class');
});

test('Spreads additional props', () => {
  render(<MessageAttachmentItem id="test-id">Test content</MessageAttachmentItem>);
  expect(screen.getByText('Test content')).toHaveAttribute('id', 'test-id');
});
