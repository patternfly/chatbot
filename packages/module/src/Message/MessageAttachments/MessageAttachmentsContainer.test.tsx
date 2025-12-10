import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageAttachmentsContainer from './MessageAttachmentsContainer';

test('Renders with children', () => {
  render(<MessageAttachmentsContainer>Test content</MessageAttachmentsContainer>);
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders with pf-chatbot__message-attachments-container class by default', () => {
  render(<MessageAttachmentsContainer>Test content</MessageAttachmentsContainer>);
  expect(screen.getByText('Test content')).toHaveClass('pf-chatbot__message-attachments-container', { exact: true });
});

test('Renders with custom className', () => {
  render(<MessageAttachmentsContainer className="custom-class">Test content</MessageAttachmentsContainer>);
  expect(screen.getByText('Test content')).toHaveClass('custom-class');
});

test('Spreads additional props', () => {
  render(<MessageAttachmentsContainer id="test-id">Test content</MessageAttachmentsContainer>);
  expect(screen.getByText('Test content')).toHaveAttribute('id', 'test-id');
});
