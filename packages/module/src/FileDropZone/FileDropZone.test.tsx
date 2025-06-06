import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileDropZone from './FileDropZone';
import userEvent from '@testing-library/user-event';

describe('FileDropZone', () => {
  it('should render file drop zone', () => {
    const { container } = render(<FileDropZone onFileDrop={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
  it('should render children', () => {
    render(<FileDropZone onFileDrop={jest.fn()}>Hi</FileDropZone>);
    expect(screen.getByText('Hi')).toBeTruthy();
  });

  it('should call onFileDrop when file type is accepted', async () => {
    const onFileDrop = jest.fn();
    const { container } = render(
      <FileDropZone data-testid="input" allowedFileTypes={{ 'text/plain': ['.txt'] }} onFileDrop={onFileDrop} />
    );

    const file = new File(['Test'], 'example.text', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(onFileDrop).toHaveBeenCalled();
  });

  it('should not call onFileDrop when file type is not accepted', async () => {
    const onFileDrop = jest.fn();
    const { container } = render(
      <FileDropZone data-testid="input" allowedFileTypes={{ 'text/plain': ['.txt'] }} onFileDrop={onFileDrop} />
    );

    const file = new File(['[]'], 'example.json', { type: 'application/json' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(onFileDrop).not.toHaveBeenCalled();
  });

  it('should respect minSize restriction', async () => {
    const onAttachRejected = jest.fn();
    const { container } = render(
      <FileDropZone onFileDrop={jest.fn()} minSize={1000} onAttachRejected={onAttachRejected} />
    );

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(onAttachRejected).toHaveBeenCalled();
  });
  it('should respect maxSize restriction', async () => {
    const onAttachRejected = jest.fn();
    const { container } = render(
      <FileDropZone onFileDrop={jest.fn()} maxSize={100} onAttachRejected={onAttachRejected} />
    );

    const largeContent = 'x'.repeat(200);
    const file = new File([largeContent], 'example.txt', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(onAttachRejected).toHaveBeenCalled();
  });

  it('should respect maxFiles restriction', async () => {
    const onAttachRejected = jest.fn();
    const { container } = render(
      <FileDropZone onFileDrop={jest.fn()} maxFiles={1} onAttachRejected={onAttachRejected} />
    );

    const files = [
      new File(['Test1'], 'example1.txt', { type: 'text/plain' }),
      new File(['Test2'], 'example2.txt', { type: 'text/plain' })
    ];
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, files);

    expect(onAttachRejected).toHaveBeenCalled();
  });

  it('should be disabled when isAttachmentDisabled is true', async () => {
    const onFileDrop = jest.fn();
    const { container } = render(<FileDropZone onFileDrop={onFileDrop} isAttachmentDisabled={true} />);

    const file = new File(['Test'], 'example.text', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    expect(onFileDrop).not.toHaveBeenCalled();
  });

  it('should call onAttach when files are attached', async () => {
    const onAttach = jest.fn();
    const { container } = render(<FileDropZone onFileDrop={jest.fn()} onAttach={onAttach} />);

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(onAttach).toHaveBeenCalled();
  });
  it('should use custom validator when provided', async () => {
    const validator = jest.fn().mockReturnValue({ message: 'Custom error' });
    const onAttachRejected = jest.fn();
    const onFileDrop = jest.fn();
    const { container } = render(
      <FileDropZone onFileDrop={onFileDrop} validator={validator} onAttachRejected={onAttachRejected} />
    );

    const file = new File(['Test'], 'example.txt', { type: 'text/plain' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    expect(validator).toHaveBeenCalledWith(file);
    expect(onAttachRejected).toHaveBeenCalled();
  });
});
