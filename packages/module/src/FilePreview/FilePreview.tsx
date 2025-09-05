import { ModalBody, ModalBodyProps, ModalHeader, ModalHeaderProps } from '@patternfly/react-core';
import type { FunctionComponent } from 'react';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal, { ChatbotModalProps } from '../ChatbotModal';
import { FileIcon } from '@patternfly/react-icons';

export interface FilePreviewProps extends ChatbotModalProps {
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
  /** File name */
  fileName: string;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
  /** Additional props passed to modal header */
  modalHeaderProps?: ModalHeaderProps;
  /** Additional props passed to modal body */
  modalBodyProps?: ModalBodyProps;
}

const FilePreview: FunctionComponent<FilePreviewProps> = ({
  isModalOpen,
  displayMode = ChatbotDisplayMode.default,
  children,
  fileName,
  isCompact,
  className,
  handleModalToggle,
  title = 'File preview',
  modalHeaderProps,
  modalBodyProps,
  ...props
}: FilePreviewProps) => (
  <ChatbotModal
    isOpen={isModalOpen}
    className={`pf-chatbot__file-preview-modal pf-chatbot__file-preview-modal--${displayMode} ${isCompact ? 'pf-m-compact' : ''} ${className ? className : ''}`}
    displayMode={displayMode}
    onClose={handleModalToggle}
    isCompact={isCompact}
    {...props}
  >
    <ModalHeader title={title} {...modalHeaderProps} />
    <ModalBody className="pf-chatbot__file-preview-body" {...modalBodyProps}>
      <FileIcon className="pf-chatbot__file-preview-icon" />
      <h2 className="pf-chatbot__file-preview-name">{fileName}</h2>
      {children && <div className="pf-chatbot__file-preview-body">{children}</div>}
    </ModalBody>
  </ChatbotModal>
);

export default FilePreview;
