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

  it('should call onAttachAccepted when file type is accepted', async () => {
    const onAttachAccepted = jest.fn();
    render(
      <AttachButton
        inputTestId="input"
        allowedFileTypes={{ 'text/plain': ['.txt'] }}
        onAttachAccepted={onAttachAccepted}
      />
    );

    const file = new File(['hello'], 'example.txt', { type: 'text/plain' });
    const input = screen.getByTestId('input');

    await userEvent.upload(input, file);

    expect(onAttachAccepted).toHaveBeenCalled();
    const [attachedFile] = onAttachAccepted.mock.calls[0][0];
    expect(attachedFile).toEqual(file);
  });

  it('should not call onAttachAccepted when file type is not accepted', async () => {
    const onAttachAccepted = jest.fn();
    render(
      <AttachButton
        inputTestId="input"
        allowedFileTypes={{ 'text/plain': ['.txt'] }}
        onAttachAccepted={onAttachAccepted}
      />
    );

    const file = new File(['[]'], 'example.json', { type: 'application/json' });
    const input = screen.getByTestId('input');

    await userEvent.upload(input, file);

    expect(onAttachAccepted).not.toHaveBeenCalled();
  });

  it('should respect minSize restriction', async () => {
    const onAttachRejected = jest.fn();
    render(<AttachButton inputTestId="input" minSize={1000} onAttachRejected={onAttachRejected} />);

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const input = screen.getByTestId('input');

    await userEvent.upload(input, file);

    expect(onAttachRejected).toHaveBeenCalled();
  });

  it('should respect maxSize restriction', async () => {
    const onAttachRejected = jest.fn();
    render(<AttachButton inputTestId="input" maxSize={100} onAttachRejected={onAttachRejected} />);

    const largeContent = 'x'.repeat(200);
    const file = new File([largeContent], 'example.txt', { type: 'text/plain' });
    const input = screen.getByTestId('input');

    await userEvent.upload(input, file);

    expect(onAttachRejected).toHaveBeenCalled();
  });

  it('should respect maxFiles restriction', async () => {
    const onAttachRejected = jest.fn();
    render(<AttachButton inputTestId="input" maxFiles={1} onAttachRejected={onAttachRejected} />);

    const files = [
      new File(['Test1'], 'example1.txt', { type: 'text/plain' }),
      new File(['Test2'], 'example2.txt', { type: 'text/plain' })
    ];

    const input = screen.getByTestId('input');
    await userEvent.upload(input, files);

    expect(onAttachRejected).toHaveBeenCalled();
  });

  it('should be disabled when isAttachmentDisabled is true', async () => {
    const onFileDrop = jest.fn();
    render(<AttachButton inputTestId="input" isAttachmentDisabled={true} />);

    const file = new File(['Test'], 'example.text', { type: 'text/plain' });
    const input = screen.getByTestId('input');
    await userEvent.upload(input, file);

    expect(onFileDrop).not.toHaveBeenCalled();
  });

  it('should call onAttach when files are attached', async () => {
    const onAttach = jest.fn();
    render(<AttachButton inputTestId="input" onAttach={onAttach} />);

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const input = screen.getByTestId('input');

    await userEvent.upload(input, file);

    expect(onAttach).toHaveBeenCalled();
  });
  it('should use custom validator when provided', async () => {
    const validator = jest.fn().mockReturnValue({ message: 'Custom error' });
    const onAttachRejected = jest.fn();
    render(<AttachButton inputTestId="input" validator={validator} onAttachRejected={onAttachRejected} />);

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const input = screen.getByTestId('input');
    await userEvent.upload(input, file);

    expect(validator).toHaveBeenCalledWith(file);
    expect(onAttachRejected).toHaveBeenCalled();
  });
  it('should handle icon prop', () => {
    render(<AttachButton icon={<img alt="" src="" />} />);
    expect(screen.getByRole('img')).toBeVisible();
  });
});
