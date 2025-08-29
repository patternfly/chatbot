import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagePreview from './ImagePreview';
import { ChatbotDisplayMode } from '../Chatbot';

const mockImages = [
  {
    fileName: 'image1.jpg',
    fileSize: '2.5 MB',
    image: <img src="" alt="Test image 1" />
  },
  {
    fileName: 'image2.png',
    fileSize: '1.8 MB',
    image: <img src="" alt="Test image 2" />
  },
  {
    fileName: 'image3.gif',
    image: <img src="" alt="Test image 3" />
  }
];

const defaultProps = {
  isModalOpen: true,
  handleModalToggle: jest.fn(),
  images: mockImages
};

describe('ImagePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isModalOpen is true', () => {
    render(<ImagePreview {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render modal when isModalOpen is false', () => {
    render(<ImagePreview {...defaultProps} isModalOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays custom title when provided', () => {
    const customTitle = 'Custom image preview';
    render(<ImagePreview {...defaultProps} title={customTitle} />);
    expect(screen.getByRole('heading', { name: customTitle })).toBeInTheDocument();
  });

  it('displays default title when no title provided', () => {
    render(<ImagePreview {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /Preview images/i })).toBeInTheDocument();
  });

  it('calls handleModalToggle when modal is closed', () => {
    const mockHandleToggle = jest.fn();
    render(<ImagePreview {...defaultProps} handleModalToggle={mockHandleToggle} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });

  it('displays first image by default', () => {
    render(<ImagePreview {...defaultProps} />);
    expect(screen.getByText('image1.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
  });

  it('displays page counter correctly', () => {
    render(<ImagePreview {...defaultProps} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('navigates to next image when next button is clicked', () => {
    const mockOnNextClick = jest.fn();
    render(<ImagePreview {...defaultProps} onNextClick={mockOnNextClick} />);
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextButton);
    expect(mockOnNextClick).toHaveBeenCalled();
    expect(screen.getByText('2/3')).toBeInTheDocument();
    expect(screen.getByText('image2.png')).toBeInTheDocument();
  });

  it('navigates to previous image when previous button is clicked', () => {
    const mockOnPreviousClick = jest.fn();
    render(<ImagePreview {...defaultProps} onPreviousClick={mockOnPreviousClick} />);
    // First go to page 2
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextButton);
    // Then go back to page 1
    const previousButton = screen.getByRole('button', { name: /Go to previous page/i });
    fireEvent.click(previousButton);
    expect(mockOnPreviousClick).toHaveBeenCalled();
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('calls onSetPage when page changes', () => {
    const mockOnSetPage = jest.fn();
    render(<ImagePreview {...defaultProps} onSetPage={mockOnSetPage} />);
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextButton);
    expect(mockOnSetPage).toHaveBeenCalledWith(expect.any(Object), 2);
  });

  it('disables previous button on first page', () => {
    render(<ImagePreview {...defaultProps} />);
    const previousButton = screen.getByRole('button', { name: /Go to previous page/i });
    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<ImagePreview {...defaultProps} />);
    // Navigate to last page
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextButton); // page 2
    fireEvent.click(nextButton); // page 3
    expect(nextButton).toBeDisabled();
  });

  it('disables both navigation buttons when isDisabled is true', () => {
    render(<ImagePreview {...defaultProps} isDisabled={true} />);
    const previousButton = screen.getByRole('button', { name: /Go to previous page/i });
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('uses custom aria labels for pagination', () => {
    const customLabels = {
      paginationAriaLabel: 'Custom pagination',
      toPreviousPageAriaLabel: 'Go to previous image',
      toNextPageAriaLabel: 'Go to next image'
    };

    render(<ImagePreview {...defaultProps} {...customLabels} />);
    expect(screen.getByRole('navigation', { name: 'Custom pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to previous image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next image' })).toBeInTheDocument();
  });

  it('renders with compact mode when isCompact is true', () => {
    render(<ImagePreview {...defaultProps} isCompact={true} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('pf-m-compact');
  });

  it('applies custom className when provided', () => {
    const customClassName = 'custom-image-preview';
    render(<ImagePreview {...defaultProps} className={customClassName} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass(customClassName);
  });

  it('applies display mode class correctly', () => {
    render(<ImagePreview {...defaultProps} displayMode={ChatbotDisplayMode.embedded} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('pf-chatbot__image-preview-modal--embedded');
  });

  it('passes additional props to ChatbotModal', () => {
    const modalClass = 'custom-modal-class';
    const additionalProps = {
      'data-testid': 'modal',
      className: modalClass
    };
    render(<ImagePreview {...defaultProps} {...additionalProps} />);
    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass(modalClass);
  });

  it('passes modalHeaderProps correctly', () => {
    const headerClass = 'custom-modal-header-class';
    const headerProps = {
      'data-testid': 'header',
      className: headerClass
    };
    render(<ImagePreview {...defaultProps} modalHeaderProps={headerProps} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveClass(headerClass);
  });

  it('passes modalBodyProps correctly', () => {
    const bodyClass = 'custom-modal-body-class';
    const bodyProps = {
      'data-testid': 'body',
      className: bodyClass
    };
    render(<ImagePreview {...defaultProps} modalBodyProps={bodyProps} />);
    expect(screen.getByTestId('body')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toHaveClass(bodyClass);
  });

  it('handles single image without pagination', () => {
    const singleImage = [mockImages[0]];
    render(<ImagePreview {...defaultProps} images={singleImage} />);
    expect(screen.queryByText('1/1')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Go to previous page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Go to next page/i })).not.toBeInTheDocument();
  });

  it('calls onCloseFileDetailsLabel when file details close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<ImagePreview {...defaultProps} onCloseFileDetailsLabel={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: /Close image1.jpg/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('passes fileDetailsLabelProps correctly to FileDetailsLabel', () => {
    const customFileDetailsProps = {
      'data-testid': 'custom-file-details'
    };
    render(<ImagePreview {...defaultProps} fileDetailsLabelProps={customFileDetailsProps as any} />);
    expect(screen.getByTestId('custom-file-details')).toBeInTheDocument();
  });

  it('displays file details for current page when navigating', () => {
    render(<ImagePreview {...defaultProps} />);
    // Initially shows first image details
    expect(screen.getByText('image1.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();

    // Navigate to second page
    const nextButton = screen.getByRole('button', { name: /Go to next page/i });
    fireEvent.click(nextButton);

    // Should now show second image details
    expect(screen.getByText('image2.png')).toBeInTheDocument();
    expect(screen.getByText('1.8 MB')).toBeInTheDocument();

    // Navigate to third page
    fireEvent.click(nextButton);

    // Should now show third image details (no file size)
    expect(screen.getByText('image3.gif')).toBeInTheDocument();
    expect(screen.queryByText(/MB/)).not.toBeInTheDocument();
  });

  it('sets hasTruncation to false on FileDetailsLabel', () => {
    const longFileName = 'very-long-filename-that-would-normally-be-truncated-in-other-contexts.jpg';
    const imageWithLongName = {
      fileName: longFileName,
      fileSize: '1.0 MB',
      image: <img src="" alt="Test image with long name" />
    };
    render(<ImagePreview {...defaultProps} images={[imageWithLongName]} />);
    expect(screen.getByText(longFileName)).toBeInTheDocument();
  });
});
