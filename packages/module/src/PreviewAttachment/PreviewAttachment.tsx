// ============================================================================
// Preview Attachment - Chatbot Code Snippet Viewer
// ============================================================================
import React from 'react';
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
}

export const PreviewAttachment: React.FunctionComponent<PreviewAttachmentProps> = ({
  fileName,
  code,
  handleModalToggle,
  isModalOpen,
  onDismiss = undefined,
  onEdit,
  title = 'Preview attachment',
  displayMode = ChatbotDisplayMode.default,
  isCompact
}: PreviewAttachmentProps) => {
  const handleEdit = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onEdit(_event);
  };

  const handleDismiss = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
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
      primaryActionBtn="Edit"
      secondaryActionBtn="Dismiss"
      title={title}
      isReadOnly
      displayMode={displayMode}
      isCompact={isCompact}
    />
  );
};

export default PreviewAttachment;
