import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileDetailsLabel from './FileDetailsLabel';
import userEvent from '@testing-library/user-event';
import { BellIcon } from '@patternfly/react-icons';

describe('FileDetailsLabel', () => {
  it('should render file details label', () => {
    const { container } = render(<FileDetailsLabel fileName="test.txt" />);
    expect(container).toMatchSnapshot();
  });
  it('should render file details correctly if an extension we support is passed in', () => {
    render(<FileDetailsLabel fileName="test.txt" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('TEXT')).toBeTruthy();
  });
  it('should skip language if we do not support an extension', () => {
    render(<FileDetailsLabel fileName="test.joke" languageTestId="language" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.queryByTestId('language')).toBeFalsy();
  });
  it('should pass file size down', () => {
    render(<FileDetailsLabel fileName="test.svg" fileSize="100MB" />);
    expect(screen.getByText('100MB')).toBeTruthy();
  });
  it('should pass truncation prop down as true by default', () => {
    render(<FileDetailsLabel fileName="test.svg" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.queryByText('test.svg')).toBeFalsy();
  });
  it('should pass truncation prop down when false', () => {
    render(<FileDetailsLabel fileName="test.svg" hasTruncation={false} />);
    expect(screen.getByText('test.svg')).toBeTruthy();
  });
  it('should not show spinner by default', () => {
    render(<FileDetailsLabel fileName="test.txt" spinnerTestId="spinner" />);
    expect(screen.queryByTestId('spinner')).toBeFalsy();
  });
  it('should show spinner if loading', () => {
    render(<FileDetailsLabel fileName="test.txt" isLoading spinnerTestId="spinner" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('TEXT')).toBeTruthy();
    expect(screen.queryByTestId('spinner')).toBeTruthy();
  });
  it('should call onClick prop', async () => {
    const spy = jest.fn();
    render(<FileDetailsLabel fileName="test.txt" onClick={spy} />);
    await userEvent.click(screen.getByRole('button'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call onClose prop', async () => {
    const spy = jest.fn();
    render(<FileDetailsLabel fileName="test.txt" onClose={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Close test.txt/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should use closeButtonAriaLabel prop appropriately', () => {
    render(<FileDetailsLabel fileName="test.txt" onClose={jest.fn()} closeButtonAriaLabel="Delete file" />);
    expect(screen.getByRole('button', { name: /Delete file/i })).toBeTruthy();
  });
  it('should support custom close icon', () => {
    render(
      <FileDetailsLabel fileName="test.txt" onClose={jest.fn()} closeButtonIcon={<BellIcon data-testid="bell" />} />
    );
    expect(screen.getByTestId('bell')).toBeTruthy();
  });
});
