import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilePreview from './FilePreview';
import { ChatbotDisplayMode } from '../Chatbot';
import { Button, ModalBodyProps, ModalHeaderProps } from '@patternfly/react-core';

describe('FilePreview', () => {
  const defaultProps = {
    isModalOpen: true,
    handleModalToggle: jest.fn(),
    fileName: 'test-file.txt',
    children: 'File content preview'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with basic props', () => {
    render(<FilePreview {...defaultProps} />);
    expect(screen.getByText('Preview file')).toBeInTheDocument();
    expect(screen.getByText('test-file.txt')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    const customTitle = 'Custom file preview title';
    render(<FilePreview {...defaultProps} title={customTitle} />);
    expect(screen.getByRole('heading', { name: customTitle })).toBeTruthy();
  });

  it('should handle modal toggle when closed', () => {
    const mockToggle = jest.fn();
    render(<FilePreview {...defaultProps} isModalOpen={false} handleModalToggle={mockToggle} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should apply default display mode class', () => {
    render(<FilePreview {...defaultProps} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('pf-chatbot__file-preview-modal--default');
  });

  it('should apply custom display mode class', () => {
    render(<FilePreview {...defaultProps} displayMode={ChatbotDisplayMode.fullscreen} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('pf-chatbot__file-preview-modal--fullscreen');
  });

  it('should apply compact styling when isCompact is true', () => {
    render(<FilePreview {...defaultProps} isCompact />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('pf-m-compact');
  });

  it('should not apply compact styling when isCompact is false', () => {
    render(<FilePreview {...defaultProps} isCompact={false} />);
    const modal = screen.getByRole('dialog');
    expect(modal).not.toHaveClass('pf-m-compact');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-file-preview';
    render(<FilePreview {...defaultProps} className={customClass} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass(customClass);
  });

  it('should pass through additional props to ChatbotModal', () => {
    render(<FilePreview {...defaultProps} data-testid="file-preview-modal" />);
    const modal = screen.getByTestId('file-preview-modal');
    expect(modal).toBeInTheDocument();
  });

  it('should pass modalHeaderProps to ModalHeader', () => {
    const modalHeaderProps = {
      'data-testid': 'custom-header'
    } as ModalHeaderProps;
    render(<FilePreview {...defaultProps} modalHeaderProps={modalHeaderProps} />);
    const header = screen.getByTestId('custom-header');
    expect(header).toBeInTheDocument();
  });

  it('should pass modalBodyProps to ModalBody', () => {
    const modalBodyProps = {
      'data-testid': 'custom-body'
    } as ModalBodyProps;
    render(<FilePreview {...defaultProps} modalBodyProps={modalBodyProps} />);
    const body = screen.getByTestId('custom-body');
    expect(body).toBeInTheDocument();
  });

  it('should pass ouiaId to ChatbotModal', () => {
    const ouiaId = 'file-preview-ouia-id';
    render(<FilePreview {...defaultProps} ouiaId={ouiaId} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('data-ouia-component-id', ouiaId);
  });

  it('should handle complex children', () => {
    const complexChildren = (
      <div>
        <h3>File details</h3>
        <p>Size: 1.2 MB</p>
        <Button>Download</Button>
      </div>
    );
    render(<FilePreview {...defaultProps}>{complexChildren}</FilePreview>);
    expect(screen.getByRole('heading', { name: /File details/i })).toBeTruthy();
    expect(screen.getByText('Size: 1.2 MB')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Download/i })).toBeTruthy();
  });
});
