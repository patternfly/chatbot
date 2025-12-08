import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ResponseActionsGroups from './ResponseActionsGroups';

test('Renders with children', () => {
  render(<ResponseActionsGroups>Test content</ResponseActionsGroups>);
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders with pf-chatbot__response-actions-groups class by default', () => {
  render(<ResponseActionsGroups>Test content</ResponseActionsGroups>);
  expect(screen.getByText('Test content')).toHaveClass('pf-chatbot__response-actions-groups', { exact: true });
});

test('Renders with custom className', () => {
  render(<ResponseActionsGroups className="custom-class">Test content</ResponseActionsGroups>);
  expect(screen.getByText('Test content')).toHaveClass('custom-class');
});

test('Spreads additional props', () => {
  render(<ResponseActionsGroups id="test-id">Test content</ResponseActionsGroups>);
  expect(screen.getByText('Test content')).toHaveAttribute('id', 'test-id');
});
