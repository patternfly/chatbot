// ============================================================================
// Code Modal - Chatbot Modal with Code Editor
// ============================================================================

import type { FunctionComponent, MouseEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import path from 'path-browserify';

// Import PatternFly components
import { CodeEditor } from '@patternfly/react-code-editor';
import {
  Bullseye,
  Button,
  getResizeObserver,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Stack,
  StackItem
} from '@patternfly/react-core';
import FileDetails, { extensionToLanguage } from '../FileDetails';
import { ChatbotDisplayMode } from '../Chatbot';
import ChatbotModal from '../ChatbotModal/ChatbotModal';

// Try to lazy load - some consumers need to be below a certain bundle size, but can't use the CDN and don't have webpack
let monacoInstance: typeof import('monaco-editor') | null = null;
const loadMonaco = async () => {
  if (!monacoInstance) {
    const [monaco, { loader }] = await Promise.all([import('monaco-editor'), import('@monaco-editor/react')]);
    monacoInstance = monaco;
    loader.config({ monaco });
  }
  return monacoInstance;
};

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
  /** Class applied to modal header */
  modalHeaderClassName?: string;
  /** Class applied to modal body */
  modalBodyClassName?: string;
  /** Class applied to modal footer */
  modalFooterClassName?: string;
  /** Aria label applied to spinner when loading Monaco */
  spinnerAriaLabel?: string;
}

export const CodeModal: FunctionComponent<CodeModalProps> = ({
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
  modalHeaderClassName,
  modalBodyClassName,
  modalFooterClassName,
  spinnerAriaLabel = 'Loading',
  ...props
}: CodeModalProps) => {
  const [newCode, setNewCode] = useState(code);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoLoading, setIsMonacoLoading] = useState(false);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen && !isMonacoLoaded && !isMonacoLoading) {
      setIsMonacoLoading(true);
      loadMonaco()
        .then(() => {
          setIsMonacoLoaded(true);
          setIsMonacoLoading(false);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load Monaco editor:', error);
          setIsMonacoLoading(false);
        });
    }
  }, [isModalOpen, isMonacoLoaded, isMonacoLoading]);

  useEffect(() => {
    if (!isModalOpen || !isEditorReady || !editorInstance || !containerRef.current) {
      return;
    }

    const handleResize = () => {
      if (editorInstance && isEditorReady && isModalOpen) {
        try {
          window.requestAnimationFrame(() => {
            editorInstance.layout();
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('ChatBot code modal layout error:', error);
        }
      }
    };

    const observer = getResizeObserver(containerRef.current, handleResize);

    return () => {
      observer();
    };
  }, [editorInstance, isEditorReady, isModalOpen]);

  const handlePrimaryAction = (_event: MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    if (!isReadOnly) {
      onPrimaryAction(_event, newCode);
    } else {
      onPrimaryAction(_event);
    }
  };

  const handleSecondaryAction = (_event: MouseEvent | MouseEvent | KeyboardEvent) => {
    handleModalToggle(_event);
    onSecondaryAction(_event);
  };

  const onEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);

    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });

    if (containerRef.current) {
      setIsEditorReady(true);
      editor.layout();
      editor.focus();
    }
  };

  const onCodeChange = (value: string) => {
    if (!isReadOnly) {
      setNewCode(value);
    }
  };

  const renderMonacoEditor = () => {
    if (isMonacoLoading) {
      return (
        <Bullseye>
          <Spinner aria-label={spinnerAriaLabel} />
        </Bullseye>
      );
    }
    if (isMonacoLoaded) {
      return (
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
            folding: false,
            // prevents Monaco from handling resizing itself
            // was causing ResizeObserver issues
            automaticLayout: false
          }}
          {...props}
        />
      );
    }
    return null;
  };

  const modal = (
    <ChatbotModal
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      ouiaId="CodeModal"
      aria-labelledby="code-modal-title"
      aria-describedby="code-modal"
      className={`pf-chatbot__code-modal ${isCompact ? 'pf-m-compact' : ''} pf-chatbot__code-modal--${displayMode}`}
      displayMode={displayMode}
      isCompact={isCompact}
    >
      <ModalHeader className={modalHeaderClassName} title={title} labelId="code-modal-title" />
      <ModalBody className={modalBodyClassName} id="code-modal-body">
        <Stack className="pf-chatbot__code-modal-body">
          <StackItem className="pf-chatbot__code-modal-file-details">
            <FileDetails fileName={fileName} />
          </StackItem>
          <div className="pf-v6-l-stack__item pf-chatbot__code-modal-editor" ref={containerRef}>
            {renderMonacoEditor()}
          </div>
        </Stack>
      </ModalBody>
      <ModalFooter className={modalFooterClassName}>
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
