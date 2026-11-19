import type { FunctionComponent, KeyboardEvent as ReactKeyboardEvent, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Accept, DropEvent, DropzoneOptions, FileError, FileRejection } from 'react-dropzone';
import {
  ButtonProps,
  MenuSearchInputProps,
  MenuSearchProps,
  SearchInputProps,
  TooltipProps
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

// Import Chatbot components
import SendButton from './SendButton';
import MicrophoneButton from './MicrophoneButton';
import { AttachButton, AttachButtonProps } from './AttachButton';
import AttachMenu from '../AttachMenu';
import StopButton from './StopButton';
import { ChatbotDisplayMode } from '../Chatbot';

export interface MessageBarWithAttachMenuProps {
  /** Flag to enable whether attach menu is open */
  isAttachMenuOpen: boolean;
  /** Callback to close attach menu */
  setIsAttachMenuOpen: (isOpen: boolean) => void;
  /** Items in menu */
  attachMenuItems: React.ReactNode;
  /** A callback for when the attachment menu toggle is clicked */
  onAttachMenuToggleClick?: () => void;
  /** A callback for when the input value in the menu changes. */
  onAttachMenuInputChange?: (value: string) => void;
  /** Function callback called when user selects item in menu. */
  onAttachMenuSelect?: (event?: React.MouseEvent<Element, MouseEvent>, value?: string | number) => void;
  /** Placeholder for search input */
  attachMenuInputPlaceholder?: string;
  /** Keys that trigger onOpenChange, defaults to tab and escape. It is highly recommended to include Escape in the array, while Tab may be omitted if the menu contains non-menu items that are focusable. */
  onAttachMenuOnOpenChangeKeys?: string[];
  /** Callback to change the open state of the menu. Triggered by clicking outside of the menu. */
  onAttachMenuOpenChange?: (isOpen: boolean) => void;
  /** Additional props passed to MenuSearch component in attach menu */
  menuSearchProps?: Omit<MenuSearchProps, 'ref'>;
  /** Additional props passed to MenuSearchInput component in attach menu */
  menuSearchInputProps?: Omit<MenuSearchInputProps, 'ref'>;
  /** Additional props passed to SearchInput component in attach menu */
  searchInputProps?: SearchInputProps;
}

export interface MessageBarProps {
  /** Callback to get the value of input message by user */
  onSendMessage: (message: string | number) => void;
  /** Class Name for the MessageBar component */
  className?: string;
  /** Flag to always to show the send button. By default send button is shown when there is a message in the input field */
  alwayShowSendButton?: boolean;
  /** Placeholder for message input */
  placeholder?: string;
  /** Flag to disable/enable the Attach button  */
  hasAttachButton?: boolean;
  /** Whether the attach button is rendered before or after the message input. */
  attachButtonPosition?: 'start' | 'end';
  /** Flag to enable the Microphone button  */
  hasMicrophoneButton?: boolean;
  /** Placeholder text when listening */
  listeningText?: string;
  /** Flag to enable the Stop button, used for streaming content */
  hasStopButton?: boolean;
  /** Callback function for when stop button is clicked */
  handleStopButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback function for when attach button is used to upload a file */
  handleAttach?: (data: File[], event: DropEvent) => void;
  /** Specifies the file types accepted by the attachment upload component.
   *  Files that don't match the accepted types will be disabled in the file picker.
   *  For example,
   *   allowedFileTypes: { 'application/json': ['.json'], 'text/plain': ['.txt'] }
   **/
  allowedFileTypes?: Accept;
  /** Minimum file size allowed */
  minSize?: number;
  /** Max file size allowed */
  maxSize?: number;
  /** Max number of files allowed */
  maxFiles?: number;
  /** Whether attachments are disabled */
  isAttachmentDisabled?: boolean;
  /** Callback when file(s) are attached */
  onAttach?: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  /** Callback function for AttachButton when an attachment fails */
  onAttachRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  /** Validator for files; see https://react-dropzone.js.org/#!/Custom%20validation for more information */
  validator?: <T extends File>(file: T) => FileError | readonly FileError[] | null;
  /** Additional props passed to react-dropzone */
  dropzoneProps?: DropzoneOptions;
  /** Props to enable a menu that opens when the Attach button is clicked, instead of the attachment window */
  attachMenuProps?: MessageBarWithAttachMenuProps;
  /** Flag to provide manual control over whether send button is disabled */
  isSendButtonDisabled?: boolean;
  /** Prop to allow passage of additional props to buttons */
  buttonProps?: {
    attach?: AttachButtonProps & { props?: ButtonProps };
    stop?: { tooltipContent?: string; props?: ButtonProps; tooltipProps?: Omit<TooltipProps, 'content'> };
    send?: { tooltipContent?: string; props?: ButtonProps; tooltipProps?: Omit<TooltipProps, 'content'> };
    microphone?: {
      tooltipContent?: { active?: string; inactive?: string };
      language?: string;
      props?: ButtonProps;
      tooltipProps?: Omit<TooltipProps, 'content'>;
    };
  };
  /** A callback for when the input value changes. */
  onChange?: (event: React.FormEvent<HTMLDivElement> | null, value: string) => void;
  /** Display mode of chatbot, if you want to message bar to resize when the display mode changes */
  displayMode?: ChatbotDisplayMode;
  /** Whether message bar is compact */
  isCompact?: boolean;
  /** Ref applied to message bar input, for use with focus or other custom behaviors  */
  innerRef?: React.Ref<HTMLDivElement>;
  /** Sets background color to primary */
  isPrimary?: boolean;
  /** Additional actions to render for the message bar. This will force a multiline layout, and the actions will render at the start of the container.  */
  additionalActions?: React.ReactNode;
  /** Flag indicating whether a multiline layout for the message input and actions should be forced. This can be used to always render actions below the message input. */
  forceMultilineLayout?: boolean;
  /** Controlled value of the message input */
  value?: string | number;
  /** When true, allows styled inline elements within the input (e.g., for mention or tag systems). Uses contenteditable="true" instead of "plaintext-only". */
  allowInlineElements?: boolean;
  /** Additional onKeyDown handler that runs before the internal handler. Call event.preventDefault() to suppress the default send-on-Enter behavior. */
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

/** Extract plain text from a contenteditable element, normalizing the trailing <br> browsers leave in empty divs.
 *  Falls back to textContent for environments that don't implement innerText (jsdom). */
const getText = (el: HTMLElement): string => {
  const text = el.innerText ?? el.textContent ?? '';
  return text === '\n' ? '' : text;
};

export const MessageBarBase: FunctionComponent<MessageBarProps> = ({
  onSendMessage,
  className,
  alwayShowSendButton,
  placeholder = 'Send a message...',
  hasAttachButton = true,
  attachButtonPosition = 'end',
  hasMicrophoneButton,
  listeningText = 'Listening',
  handleAttach,
  attachMenuProps,
  isSendButtonDisabled,
  handleStopButton,
  hasStopButton,
  buttonProps,
  onChange,
  displayMode,
  value,
  isCompact = false,
  allowedFileTypes,
  minSize,
  maxSize,
  maxFiles,
  isAttachmentDisabled,
  onAttach,
  onAttachRejected,
  validator,
  dropzoneProps,
  innerRef,
  isPrimary,
  additionalActions,
  forceMultilineLayout = false,
  allowInlineElements,
  onKeyDown
}: MessageBarProps) => {
  // Text Input
  // --------------------------------------------------------------------------
  const [message, setMessage] = useState<string>('');
  const [isListeningMessage, setIsListeningMessage] = useState<boolean>(false);
  const [isComposing, setIsComposing] = useState(false);

  const shouldForceMultiline = forceMultilineLayout || additionalActions;
  const [isMultiline, setIsMultiline] = useState(shouldForceMultiline);
  const inputRef = useRef<HTMLDivElement>(null);
  const resolvedRef = (innerRef as React.RefObject<HTMLDivElement>) ?? inputRef;
  const attachButtonRef = useRef<HTMLButtonElement>(null);

  // Sync controlled value from parent — only touch the DOM when the
  // value actually diverges from what the user typed.
  useEffect(() => {
    if (value !== undefined) {
      const stringValue = String(value);
      setMessage(stringValue);
      if (resolvedRef.current && getText(resolvedRef.current) !== stringValue) {
        resolvedRef.current.textContent = stringValue;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Layout: detect multiline state and adjust flex-basis so buttons
  // wrap below the input when text exceeds two lines.
  const updateLayout = useCallback(() => {
    const field = resolvedRef.current;
    if (!field) {
      return;
    }
    const inputWrapper = field.parentElement;
    if (!inputWrapper) {
      return;
    }

    const isEmpty = !getText(field);

    if (isEmpty) {
      inputWrapper.style.setProperty('flex-basis', shouldForceMultiline ? '100%' : 'auto');
      if (!shouldForceMultiline) {
        setIsMultiline(false);
      }
    } else {
      const lineHeight = parseFloat(window.getComputedStyle(field).lineHeight) || 24;
      const lines = field.scrollHeight / lineHeight;
      inputWrapper.style.setProperty('flex-basis', lines > 2 || shouldForceMultiline ? '100%' : 'auto');

      if (!shouldForceMultiline) {
        const bar = inputWrapper.parentElement;
        if (bar) {
          const threshold = isCompact ? 56 : 70;
          setIsMultiline(bar.offsetHeight > threshold);
        }
      }
    }
  }, [shouldForceMultiline, isCompact]);

  useEffect(() => {
    updateLayout();
  }, [message, displayMode, updateLayout]);

  useEffect(() => {
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  // Input handler — reads directly from the DOM so React never fights
  // the browser's own text mutations.
  const handleInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const text = getText(event.currentTarget);
      setMessage(text);
      onChange && onChange(event, text);
    },
    [onChange]
  );

  // Paste handler — enforce plain text to prevent XSS and messy
  // markup from external sources. contenteditable="plaintext-only"
  // handles this natively in modern browsers, but this is a safety net.
  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    // execCommand preserves the browser's native undo stack
    document.execCommand('insertText', false, text);
  }, []);

  const handleSend = useCallback(
    (newMessage: string) => {
      onSendMessage(newMessage);
      setMessage('');
      if (resolvedRef.current) {
        resolvedRef.current.textContent = '';
      }
    },
    [onSendMessage]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      // Block browser formatting shortcuts (Ctrl/Cmd+B/I/U) when inline elements are allowed —
      // we want programmatic tags only, not user-driven formatting.
      if (allowInlineElements && (event.ctrlKey || event.metaKey)) {
        if (['b', 'i', 'u'].includes(event.key.toLowerCase())) {
          event.preventDefault();
          return;
        }
      }

      const nativeEvent = event.nativeEvent as KeyboardEvent;
      const isCompositionKey = nativeEvent.which === 229;
      const isCurrentlyComposing = isComposing || isCompositionKey;

      if (event.key === 'Enter' && !isCurrentlyComposing && !event.shiftKey) {
        event.preventDefault();
        if (!isSendButtonDisabled && !hasStopButton) {
          handleSend(message);
        }
      }
      // Shift+Enter naturally inserts a newline in contenteditable — no special handling needed.
    },
    [onKeyDown, allowInlineElements, isSendButtonDisabled, hasStopButton, handleSend, message, isComposing]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleAttachMenuToggle = () => {
    attachMenuProps?.setIsAttachMenuOpen && attachMenuProps?.setIsAttachMenuOpen(!attachMenuProps?.isAttachMenuOpen);
    attachMenuProps?.onAttachMenuToggleClick?.();
  };

  const handleSpeechRecognition: React.Dispatch<React.SetStateAction<string>> = useCallback(
    (action) => {
      const msg = typeof action === 'function' ? action(message) : action;
      setMessage(msg);
      if (resolvedRef.current) {
        resolvedRef.current.textContent = msg;
      }
      onChange && onChange(null, msg);
    },
    [message, onChange]
  );

  const renderAttachButton = () => {
    if (!attachMenuProps && hasAttachButton) {
      return (
        <AttachButton
          onAttachAccepted={handleAttach}
          isDisabled={isListeningMessage}
          tooltipContent={buttonProps?.attach?.tooltipContent}
          inputTestId={buttonProps?.attach?.inputTestId}
          isCompact={isCompact}
          tooltipProps={buttonProps?.attach?.tooltipProps}
          allowedFileTypes={allowedFileTypes}
          minSize={minSize}
          maxSize={maxSize}
          maxFiles={maxFiles}
          isAttachmentDisabled={isAttachmentDisabled}
          onAttach={onAttach}
          onAttachRejected={onAttachRejected}
          validator={validator}
          dropzoneProps={dropzoneProps}
          {...buttonProps?.attach}
          {...buttonProps?.attach?.props}
        />
      );
    }
    if (attachMenuProps) {
      return (
        <AttachButton
          ref={attachButtonRef}
          onClick={handleAttachMenuToggle}
          isDisabled={isListeningMessage}
          tooltipContent={buttonProps?.attach?.tooltipContent}
          isCompact={isCompact}
          tooltipProps={buttonProps?.attach?.tooltipProps}
          allowedFileTypes={allowedFileTypes}
          minSize={minSize}
          maxSize={maxSize}
          maxFiles={maxFiles}
          isAttachmentDisabled={isAttachmentDisabled}
          onAttach={onAttach}
          onAttachRejected={onAttachRejected}
          validator={validator}
          dropzoneProps={dropzoneProps}
          {...buttonProps?.attach}
          isClicked={attachMenuProps.isAttachMenuOpen}
          aria-expanded={attachMenuProps.isAttachMenuOpen}
        />
      );
    }
  };

  const isAttachButtonAtStart = attachButtonPosition === 'start';
  const renderButtons = () => {
    if (hasStopButton && handleStopButton) {
      return (
        <StopButton
          onClick={handleStopButton}
          tooltipContent={buttonProps?.stop?.tooltipContent}
          isCompact={isCompact}
          tooltipProps={buttonProps?.stop?.tooltipProps}
          {...buttonProps?.stop?.props}
        />
      );
    }
    return (
      <>
        {!isAttachButtonAtStart && renderAttachButton()}
        {hasMicrophoneButton && (
          <MicrophoneButton
            isListening={isListeningMessage}
            onIsListeningChange={setIsListeningMessage}
            onSpeechRecognition={handleSpeechRecognition}
            tooltipContent={buttonProps?.microphone?.tooltipContent}
            language={buttonProps?.microphone?.language}
            isCompact={isCompact}
            tooltipProps={buttonProps?.microphone?.tooltipProps}
            {...buttonProps?.microphone?.props}
          />
        )}
        {(alwayShowSendButton || message) && (
          <SendButton
            value={message}
            onClick={() => handleSend(message)}
            isDisabled={isSendButtonDisabled}
            tooltipContent={buttonProps?.send?.tooltipContent}
            isCompact={isCompact}
            tooltipProps={buttonProps?.send?.tooltipProps}
            {...buttonProps?.send?.props}
          />
        )}
      </>
    );
  };

  const hasGroupedActions = additionalActions || (isAttachButtonAtStart && isMultiline);
  const messageBarContents = (
    <>
      {isAttachButtonAtStart && !isMultiline && (
        <div className="pf-chatbot__message-bar-actions test">{renderAttachButton()}</div>
      )}
      <div className={`pf-chatbot__message-bar-input ${isCompact ? 'pf-m-compact' : ''}`}>
        <div
          ref={resolvedRef}
          className={css('pf-chatbot__message-textarea', !message && 'pf-m-empty')}
          contentEditable={allowInlineElements ? true : 'plaintext-only'}
          role="textbox"
          aria-multiline="true"
          aria-label={isListeningMessage ? listeningText : placeholder}
          data-placeholder={isListeningMessage ? listeningText : placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>
      <div className={css('pf-chatbot__message-bar-actions', hasGroupedActions && 'pf-m-grouped')}>
        {hasGroupedActions ? (
          <>
            <div className={css('pf-chatbot__message-bar-actions-group')}>
              {isAttachButtonAtStart && renderAttachButton()}
              {additionalActions}
            </div>
            <div className={css('pf-chatbot__message-bar-actions-group')}>{renderButtons()}</div>
          </>
        ) : (
          renderButtons()
        )}
      </div>
    </>
  );

  if (attachMenuProps) {
    return (
      <AttachMenu
        toggle={(toggleRef) => (
          <div ref={toggleRef} className={css('pf-chatbot__message-bar', isMultiline && 'pf-m-multiline', className)}>
            {messageBarContents}
          </div>
        )}
        filteredItems={attachMenuProps?.attachMenuItems}
        {...(attachMenuProps && { isOpen: attachMenuProps.isAttachMenuOpen })}
        onOpenChange={(isAttachMenuOpen) => {
          attachButtonRef.current?.focus();
          attachMenuProps?.setIsAttachMenuOpen(isAttachMenuOpen);
          attachMenuProps?.onAttachMenuOpenChange && attachMenuProps?.onAttachMenuOpenChange(isAttachMenuOpen);
        }}
        onOpenChangeKeys={attachMenuProps?.onAttachMenuOnOpenChangeKeys}
        onSelect={attachMenuProps?.onAttachMenuSelect}
        {...(attachMenuProps && { handleTextInputChange: attachMenuProps.onAttachMenuInputChange })}
        popperProps={{ direction: 'up', distance: 8 }}
        searchInputPlaceholder={attachMenuProps?.attachMenuInputPlaceholder}
        menuSearchProps={attachMenuProps?.menuSearchProps}
        menuSearchInputProps={attachMenuProps?.menuSearchInputProps}
        searchInputProps={attachMenuProps?.searchInputProps}
      />
    );
  }

  return (
    <div
      className={css(
        'pf-chatbot__message-bar',
        isPrimary && 'pf-m-primary',
        isMultiline && 'pf-m-multiline',
        className
      )}
    >
      {messageBarContents}
    </div>
  );
};

const MessageBar = forwardRef((props: MessageBarProps, ref: Ref<HTMLDivElement>) => (
  <MessageBarBase innerRef={ref} {...props} />
));

export { MessageBar };
export default MessageBar;
