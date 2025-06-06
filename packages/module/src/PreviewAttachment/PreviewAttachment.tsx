// ============================================================================
// Preview Attachment - Chatbot Code Snippet Viewer
// ============================================================================
import type { FunctionComponent, MouseEvent } from 'react';
import CodeModal from '../CodeModal';
import { ChatbotDisplayMode } from '../Chatbot';

export interface PreviewAttachmentProps {
  /** Text shown in code editor */
  code: string;
  /** Filename, including extension, of file shown in modal */
  fileName: string;
  /** Function called when edit button is clicked */
  onEdit: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Function called when dismiss button is clicked */
  onDismiss?: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Function called when modal is toggled */
  handleModalToggle: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Whether modal is open */
  isModalOpen: boolean;
  /** Title of modal */
  title?: string;
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
  /** Primary action button text */
  primaryActionButtonText?: string;
  /** Secondary action button text */
  secondaryActionButtonText?: string;
  /** Class applied to modal header */
  modalHeaderClassName?: string;
  /** Class applied to modal body */
  modalBodyClassName?: string;
  /** Class applied to modal footer */
  modalFooterClassName?: string;
}

export const PreviewAttachment: FunctionComponent<PreviewAttachmentProps> = ({
  fileName,
  code,
  handleModalToggle,
  isModalOpen,
  onDismiss = undefined,
  onEdit,
  title = 'Preview attachment',
  primaryActionButtonText = 'Edit',
  secondaryActionButtonText = 'Dismiss',
  displayMode = ChatbotDisplayMode.default,
  modalHeaderClassName,
  modalBodyClassName,
  modalFooterClassName,
  isCompact
}: PreviewAttachmentProps) => {
  const handleEdit = (_event: MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onEdit(_event);
  };

  const handleDismiss = (_event: MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onDismiss && onDismiss(_event);
  };

  return (
    <CodeModal
      codeEditorControlClassName="pf-chatbot__code-modal--controls"
      code={code}
      fileName={fileName}
      handleModalToggle={handleModalToggle}
      isCopyEnabled
      isLineNumbersVisible={false}
      isModalOpen={isModalOpen}
      onPrimaryAction={handleEdit}
      onSecondaryAction={handleDismiss}
      primaryActionBtn={primaryActionButtonText}
      secondaryActionBtn={secondaryActionButtonText}
      title={title}
      isReadOnly
      displayMode={displayMode}
      isCompact={isCompact}
      modalHeaderClassName={modalHeaderClassName}
      modalBodyClassName={modalBodyClassName}
      modalFooterClassName={modalFooterClassName}
    />
  );
};

export default PreviewAttachment;
