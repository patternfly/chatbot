import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { AttachButton } from './AttachButton';

describe('Attach button', () => {
  it('should render button correctly', () => {
    render(<AttachButton />);
    expect(screen.getByRole('button', { name: 'Attach' })).toBeTruthy();
  });
  it('should handle isDisabled prop', () => {
    render(<AttachButton isDisabled />);
    expect(screen.getByRole('button', { name: 'Attach' })).toBeDisabled();
  });
  it('should handle spread props, including aria-label', () => {
    render(<AttachButton aria-label="test" />);
    expect(screen.getByRole('button', { name: 'test' }));
  });
  it('should handle onClick', async () => {
    const spy = jest.fn();
    render(<AttachButton onClick={spy} />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    expect(screen.getByRole('tooltip', { name: 'Attach' })).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should handle className prop', () => {
    render(<AttachButton className="test" />);
    expect(screen.getByRole('button', { name: 'Attach' })).toHaveClass('test');
  });
  it('should handle custom tooltip correctly', async () => {
    render(<AttachButton onClick={jest.fn} tooltipContent="Test" />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    expect(screen.getByRole('tooltip', { name: 'Test' })).toBeTruthy();
  });
  it('should handle tooltipProps prop', async () => {
    render(<AttachButton tooltipProps={{ id: 'test' }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    expect(screen.getByRole('tooltip', { name: 'Attach' })).toHaveAttribute('id', 'test');
  });
  // Based on this because I had no idea how to do this and was looking around: https://stackoverflow.com/a/75562651
  // See also https://developer.mozilla.org/en-US/docs/Web/API/File/File for what that file variable is doing
  it('should handle onAttachAccepted prop', async () => {
    const spy = jest.fn();
    render(<AttachButton onAttachAccepted={spy} inputTestId="input" />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    const file = new File(['test'], 'test.json');
    const input = screen.getByTestId('input') as HTMLInputElement;
    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should handle isCompact', () => {
    render(<AttachButton isCompact data-testid="button" />);
    expect(screen.getByTestId('button')).toHaveClass('pf-m-compact');
  });

  it('should set correct accept attribute on file input', async () => {
    render(<AttachButton inputTestId="input" allowedFileTypes={{ 'text/plain': ['.txt'] }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'text/plain,.txt');
  });
});
