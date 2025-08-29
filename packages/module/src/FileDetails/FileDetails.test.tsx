import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileDetails from './FileDetails';

describe('FileDetails', () => {
  it('should render file details', () => {
    const { container } = render(<FileDetails fileName="test.txt" />);
    expect(container).toMatchSnapshot();
  });

  it('should render file details correctly if an extension we support is passed in', () => {
    render(<FileDetails fileName="test.txt" languageTestId="language" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.queryByText('test.txt')).toBeFalsy();
    expect(screen.getByText('TEXT')).toBeTruthy();
    expect(screen.getByTestId('language')).toBeTruthy();
  });
  it('should skip language if we do not support an extension', () => {
    render(<FileDetails fileName="test.joke" languageTestId="language" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.queryByTestId('language')).toBeFalsy();
  });
  it('should support image formats by rendering extension differently', () => {
    render(<FileDetails fileName="test.svg" languageTestId="language" />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.queryByText('test.svg')).toBeFalsy();
    expect(screen.queryByTestId('language')).toBeFalsy();
  });
  it('should handle truncation differently', () => {
    render(<FileDetails fileName="test.svg" languageTestId="language" hasTruncation={false} />);
    expect(screen.getByText('test.svg')).toBeTruthy();
    expect(screen.queryByTestId('language')).toBeFalsy();
  });
  it('should include file size if prop passed in', () => {
    render(<FileDetails fileName="test.joke" languageTestId="language" fileSize="100MB" />);
    expect(screen.getByText('100MB')).toBeTruthy();
  });
});
