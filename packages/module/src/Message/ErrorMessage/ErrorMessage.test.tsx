import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from './ErrorMessage';

test('Renders with title', () => {
  render(<ErrorMessage title="Error occurred" />);

  expect(screen.getByText('Error occurred')).toBeVisible();
});

test('Renders with children', () => {
  render(<ErrorMessage title="Error occurred">This is the error message body</ErrorMessage>);

  expect(screen.getByText('This is the error message body')).toBeVisible();
});

test('Renders with action links', () => {
  const actionLinks = (
    <a href="#retry" data-testid="retry-link">
      Retry action link
    </a>
  );
  render(<ErrorMessage title="Error occurred" actionLinks={actionLinks} />);

  expect(screen.getByText('Retry action link')).toBeVisible();
});

test('Renders with custom className', () => {
  render(<ErrorMessage title="Error occurred" className="custom-error-class" />);

  expect(screen.getByText('Error occurred').parentElement).toHaveClass('custom-error-class');
});

test('Renders with spread props', () => {
  render(<ErrorMessage title="Error occurred" id="test-error-id" />);

  expect(screen.getByText('Error occurred').parentElement).toHaveAttribute('id', 'test-error-id');
});
