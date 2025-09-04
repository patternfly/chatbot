import {
  Button,
  ButtonVariant,
  Icon,
  ModalBody,
  ModalBodyProps,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  Stack,
  StackItem
} from '@patternfly/react-core';
import {
  useState,
  useEffect,
  type FunctionComponent,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent
} from 'react';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal, { ChatbotModalProps } from '../ChatbotModal';
import FileDetailsLabel, { FileDetailsLabelProps } from '../FileDetailsLabel';
import { TrashIcon } from '@patternfly/react-icons';

export interface ImagePreviewProps extends Omit<ChatbotModalProps, 'children'> {
  /** Class applied to modal */
  className?: string;
  /** Function that handles modal toggle */
  handleModalToggle: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Whether modal is open */
  isModalOpen: boolean;
  /** Title of modal */
  title?: string;
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
  /** Additional props passed to modal header */
  modalHeaderProps?: ModalHeaderProps;
  /** Additional props passed to modal body */
  modalBodyProps?: ModalBodyProps;
  /** Images displayed in modal */
  images: { fileName: string; fileSize?: string; image: React.ReactNode }[];
  /** Flag indicating if the pagination is disabled. */
  isDisabled?: boolean;
  /** Accessible label for the pagination component. */
  paginationAriaLabel?: string;
  /** Accessible label for the button which moves to the next page. */
  toNextPageAriaLabel?: string;
  /** Accessible label for the button which moves to the previous page. */
  toPreviousPageAriaLabel?: string;
  /** Function called when user clicks to navigate to next page. */
  onNextClick?: (event: React.SyntheticEvent<HTMLButtonElement>, page: number) => void;
  /** Function called when user clicks to navigate to previous page. */
  onPreviousClick?: (event: React.SyntheticEvent<HTMLButtonElement>, page: number) => void;
  /** Function called when page is changed. */
  onSetPage?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => void;
  /** Callback function for when file details label close button is clicked */
  onCloseFileDetailsLabel?: (event: React.MouseEvent, fileName: string, fileId?: string | number) => void;
  /** Props passed to file details label */
  fileDetailsLabelProps?: Omit<FileDetailsLabelProps, 'fileName'>;
}

const ImagePreview: FunctionComponent<ImagePreviewProps> = ({
  isModalOpen,
  displayMode = ChatbotDisplayMode.default,
  isCompact,
  className,
  handleModalToggle,
  title = 'Preview images',
  modalHeaderProps,
  modalBodyProps,
  images,
  isDisabled,
  onSetPage,
  onPreviousClick,
  toNextPageAriaLabel = 'Go to next page',
  toPreviousPageAriaLabel = 'Go to previous page',
  onNextClick,
  paginationAriaLabel,
  onCloseFileDetailsLabel,
  fileDetailsLabelProps,
  ...props
}: ImagePreviewProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (images.length === 0 || page > images.length) {
      setPage(1);
    }
  }, [images.length, page]);

  const handleNewPage = (_evt: ReactMouseEvent | ReactKeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
    onSetPage && onSetPage(_evt, newPage);
  };

  return (
    <ChatbotModal
      isOpen={isModalOpen}
      className={`pf-chatbot__image-preview-modal pf-chatbot__image-preview-modal--${displayMode} ${isCompact ? 'pf-m-compact' : ''} ${className ? className : ''}`}
      displayMode={displayMode}
      onClose={handleModalToggle}
      isCompact={isCompact}
      {...props}
    >
      <ModalHeader title={title} {...modalHeaderProps} />
      <ModalBody className="pf-chatbot__image-preview-body" {...modalBodyProps}>
        {images.length > 0 && images[page - 1] && (
          <Stack hasGutter className="pf-chatbot__image-preview-stack">
            <StackItem>
              <FileDetailsLabel
                fileName={images[page - 1].fileName}
                fileSize={images[page - 1].fileSize}
                hasTruncation={false}
                onClose={onCloseFileDetailsLabel}
                closeButtonIcon={<TrashIcon />}
                {...fileDetailsLabelProps}
              />
            </StackItem>
            <StackItem>
              <div className="pf-chatbot__image-preview-body">{images[page - 1].image}</div>
            </StackItem>
          </Stack>
        )}
      </ModalBody>
      {images.length > 1 && (
        <ModalFooter className="pf-chatbot__image-preview-footer">
          <nav className={`pf-chatbot__image-preview-footer-buttons`} aria-label={paginationAriaLabel}>
            <Button
              variant={ButtonVariant.plain}
              isDisabled={isDisabled || page === 1}
              data-action="previous"
              onClick={(event) => {
                const newPage = page > 1 ? page - 1 : 1;
                handleNewPage(event, newPage);
                onPreviousClick && onPreviousClick(event, newPage);
              }}
              aria-label={toPreviousPageAriaLabel}
            >
              <Icon iconSize="lg">
                {/* these are inline because the viewBox that works in a round icon is different than the PatternFly default */}
                <svg
                  className="pf-v6-svg"
                  viewBox="0 0 280 500"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                >
                  <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
                </svg>
              </Icon>
            </Button>
            <span aria-hidden="true">
              {page}/{images.length}
            </span>
            <Button
              variant={ButtonVariant.plain}
              isDisabled={isDisabled || page === images.length}
              aria-label={toNextPageAriaLabel}
              data-action="next"
              onClick={(event) => {
                const newPage = page + 1 <= images.length ? page + 1 : images.length;
                handleNewPage(event, newPage);
                onNextClick && onNextClick(event, newPage);
              }}
            >
              <Icon isInline iconSize="lg">
                {/* these are inline because the viewBox that works in a round icon is different than the PatternFly default */}
                <svg
                  className="pf-v6-svg"
                  viewBox="0 0 180 500"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                >
                  <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                </svg>
              </Icon>
            </Button>
          </nav>
        </ModalFooter>
      )}
    </ChatbotModal>
  );
};

export default ImagePreview;
