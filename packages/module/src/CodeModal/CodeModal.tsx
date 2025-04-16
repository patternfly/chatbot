// ============================================================================
// Code Modal - Chatbot Modal with Code Editor
// ============================================================================
import React from 'react';
import path from 'path-browserify';

// Import PatternFly components
import { CodeEditor } from '@patternfly/react-code-editor';
import { Button, ModalBody, ModalFooter, ModalHeader, Stack, StackItem } from '@patternfly/react-core';
import FileDetails, { extensionToLanguage } from '../FileDetails';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal from '../ChatbotModal/ChatbotModal';

export interface CodeModalProps {
  /** Class applied to code editor */
  codeEditorControlClassName?: string;
  /** Text shown in code editor */
  code: string;
  /** Filename, including extension, of file shown in editor */
  fileName: string;
  /** Whether copying code is allowed */
  isCopyEnabled?: boolean;
  /** Whether line numbers show in the code editor */
  isLineNumbersVisible?: boolean;
  /** Whether code is read-only */
  isReadOnly?: boolean;
  /** Action assigned to primary modal button */
  onPrimaryAction: (event: React.MouseEvent | MouseEvent | KeyboardEvent, code?: string) => void;
  /** Action assigned to secondary modal button */
  onSecondaryAction: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Name of primary modal button */
  primaryActionBtn: string;
  /** Name of secondary modal button */
  secondaryActionBtn: string;
  /** Function that handles modal toggle */
  handleModalToggle: (event: React.MouseEvent | MouseEvent | KeyboardEvent) => void;
  /** Whether modal is open */
  isModalOpen: boolean;
  /** Title of modal */
  title: string;
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Sets modal to compact styling. */
  isCompact?: boolean;
}

export const CodeModal: React.FunctionComponent<CodeModalProps> = ({
  fileName,
  code,
  codeEditorControlClassName: codeEditorClassName,
  handleModalToggle,
  isCopyEnabled,
  isLineNumbersVisible,
  isModalOpen,
  isReadOnly,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionBtn,
  secondaryActionBtn,
  title,
  displayMode = ChatbotDisplayMode.default,
  isCompact,
  ...props
}: CodeModalProps) => {
  const [newCode, setNewCode] = React.useState(code);

  const handlePrimaryAction = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    if (!isReadOnly) {
      onPrimaryAction(_event, newCode);
    } else {
      onPrimaryAction(_event);
    }
  };

  const handleSecondaryAction = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onSecondaryAction(_event);
  };

  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const onCodeChange = (value: string) => {
    if (!isReadOnly) {
      setNewCode(value);
    }
  };

  const modal = (
    <ChatbotModal
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      ouiaId="CodeModal"
      aria-labelledby="code-modal-title"
      aria-describedby="code-modal"
      className={`pf-chatbot__code-modal ${isCompact ? 'pf-chatbot__code-modal-compact' : ''} pf-chatbot__code-modal--${displayMode}`}
      displayMode={displayMode}
      isCompact={isCompact}
    >
      <ModalHeader title={title} labelId="code-modal-title" />
      <ModalBody id="code-modal-body">
        <Stack className="pf-chatbot__code-modal-body">
          <StackItem className="pf-chatbot__code-modal-file-details">
            <FileDetails fileName={fileName} />
          </StackItem>
          <StackItem className="pf-chatbot__code-modal-editor">
            <CodeEditor
              isDarkTheme
              isLineNumbersVisible={isLineNumbersVisible}
              isLanguageLabelVisible
              isCopyEnabled={isCopyEnabled}
              isReadOnly={isReadOnly}
              code={newCode}
              language={extensionToLanguage[path.extname(fileName).slice(1)]}
              onEditorDidMount={onEditorDidMount}
              onCodeChange={onCodeChange}
              className={codeEditorClassName}
              isFullHeight
              options={{
                glyphMargin: false,
                folding: false
              }}
              {...props}
            />
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button isBlock key="code-modal-primary" variant="primary" onClick={handlePrimaryAction} form="code-modal-form">
          {primaryActionBtn}
        </Button>
        <Button isBlock key="code-modal-secondary" variant="link" onClick={handleSecondaryAction}>
          {secondaryActionBtn}
        </Button>
      </ModalFooter>
    </ChatbotModal>
  );

  return modal;
};

export default CodeModal;
