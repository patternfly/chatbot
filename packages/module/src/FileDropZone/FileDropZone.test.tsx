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
});
