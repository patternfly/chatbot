import type { ChangeEvent, FunctionComponent, KeyboardEvent as ReactKeyboardEvent, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Accept, DropEvent, DropzoneOptions, FileError, FileRejection } from 'react-dropzone';
import {
  ButtonProps,
  MenuSearchInputProps,
  MenuSearchProps,
  SearchInputProps,
  TextArea,
  TextAreaProps,
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
  onAttachMenuToggleClick: () => void;
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

export interface MessageBarProps extends Omit<TextAreaProps, 'innerRef'> {
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
  /** A callback for when the text area value changes. */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: string | number) => void;
  /** Display mode of chatbot, if you want to message bar to resize when the display mode changes */
  displayMode?: ChatbotDisplayMode;
  /** Whether message bar is compact */
  isCompact?: boolean;
  /** Ref applied to message bar textarea, for use with focus or other custom behaviors  */
  innerRef?: React.Ref<HTMLTextAreaElement>;
  /** Sets background color to primary */
  isPrimary?: boolean;
  /** Additional actions to render for the message bar. This will force a multiline layout, and the actions will render at the start of the container.  */
  additionalActions?: React.ReactNode;
  /** Flag indicating whether a multiline layout for the message input and actions should be forced. This can be used to always render actions below the message input. */
  forceMultilineLayout?: boolean;
  /** @beta Flag indicating whether the message bar has an AI indicator border. */
  hasAiIndicator?: boolean;
  /** @beta Flag indicating whether the chatbot is thinking in response to a query, adding an animation to the message bar. */
  isThinking?: boolean;
}

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
  hasAiIndicator,
  isThinking,
  ...props
}: MessageBarProps) => {
  // Text Input
  // --------------------------------------------------------------------------
  const [message, setMessage] = useState<string | number>(value ?? '');
  const [isListeningMessage, setIsListeningMessage] = useState<boolean>(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const shouldForceMultiline = forceMultilineLayout || additionalActions;
  const [isMultiline, setIsMultiline] = useState(shouldForceMultiline);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (innerRef as React.RefObject<HTMLTextAreaElement>) ?? inputRef;
  const attachButtonRef = useRef<HTMLButtonElement>(null);

  const topMargin = '1rem';

  const setInitialLineHeight = (field: HTMLTextAreaElement) => {
    field.style.setProperty('line-height', '1rem');
    const parent = field.parentElement;
    if (parent) {
      parent.style.setProperty('margin-top', topMargin);
      parent.style.setProperty('margin-bottom', `0rem`);
      parent.style.setProperty('height', 'inherit');

      const grandparent = parent.parentElement;
      if (grandparent) {
        grandparent.style.setProperty('flex-basis', shouldForceMultiline ? '100%' : 'auto');
      }
    }
  };

  const setAutoHeight = (field: HTMLTextAreaElement) => {
    const parent = field.parentElement;
    if (parent) {
      parent.style.setProperty('height', 'inherit');
      const computed = window.getComputedStyle(field);
      // Calculate the height
      const height =
        parseInt(computed.getPropertyValue('border-top-width')) +
        parseInt(computed.getPropertyValue('padding-top')) +
        field.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom')) +
        parseInt(computed.getPropertyValue('border-bottom-width'));
      parent.style.setProperty('height', `${height}px`);

      if (height > 32 || window.innerWidth <= 507) {
        parent.style.setProperty('margin-bottom', topMargin);
        parent.style.setProperty('margin-top', topMargin);
      }
    }
  };

  const textIsLongerThan2Lines = (field: HTMLTextAreaElement) => {
    const lineHeight = parseFloat(window.getComputedStyle(field).lineHeight);
    const lines = field.scrollHeight / lineHeight;
    return lines > 2;
  };

  const checkIfMultiline = useCallback(
    (field: HTMLTextAreaElement) => {
      const parent = field.parentElement;
      const grandparent = parent?.parentElement;
      if (grandparent) {
        const containerHeight = grandparent.offsetHeight;
        const threshold = isCompact ? 56 : 70;
        setIsMultiline(containerHeight > threshold);
      }
    },
    [isCompact]
  );

  const setAutoWidth = useCallback((field: HTMLTextAreaElement) => {
    const parent = field.parentElement;
    if (parent) {
      const grandparent = parent.parentElement;
      if ((textIsLongerThan2Lines(field) || shouldForceMultiline) && grandparent) {
        grandparent.style.setProperty('flex-basis', `100%`);
      }
    }
  }, []);

  const handleNewLine = (field: HTMLTextAreaElement) => {
    const parent = field.parentElement;
    if (parent) {
      parent.style.setProperty('margin-bottom', topMargin);
      parent.style.setProperty('margin-top', topMargin);
    }
  };

  useEffect(() => {
    const field = textareaRef.current;
    if (field) {
      if (field.value === '') {
        if (window.innerWidth > 507) {
          setInitialLineHeight(field);
        }
      } else {
        setAutoHeight(field);
        setAutoWidth(field);
      }
    }
    const resetHeight = () => {
      if (field) {
        if (field.value === '') {
          if (window.innerWidth > 507) {
            setInitialLineHeight(field);
          }
        } else {
          setAutoHeight(field);
          setAutoWidth(field);
        }
      }
    };
    window.addEventListener('resize', resetHeight);

    return () => {
      window.removeEventListener('resize', resetHeight);
    };
  }, [setAutoWidth]);

  useEffect(() => {
    const field = textareaRef.current;
    if (field) {
      if (field.value === '') {
        setInitialLineHeight(field);
        !shouldForceMultiline && setIsMultiline(false);
      } else {
        setAutoHeight(field);
        setAutoWidth(field);
        !shouldForceMultiline && checkIfMultiline(field);
      }
    }
  }, [displayMode, message, setAutoWidth, shouldForceMultiline, checkIfMultiline]);

  useEffect(() => {
    const field = textareaRef.current;
    if (field) {
      setInitialLineHeight(field);
      setHasSentMessage(false);
    }
  }, [hasSentMessage]);

  const handleChange = useCallback(
    (event) => {
      onChange && onChange(event, event.target.value);
      if (textareaRef.current) {
        if (event.target.value === '') {
          setInitialLineHeight(textareaRef.current);
          !shouldForceMultiline && setIsMultiline(false);
        } else {
          setAutoHeight(textareaRef.current);
          !shouldForceMultiline && checkIfMultiline(textareaRef.current);
        }
      }
      setMessage(event.target.value);
    },
    [onChange, checkIfMultiline]
  );

  // Handle sending message
  const handleSend = useCallback(
    (newMessage: string | number) => {
      onSendMessage(newMessage);
      setHasSentMessage(true);
      setMessage('');
    },
    [onSendMessage]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      // Japanese and other languages may use IME for character input.
      // In these cases, enter is used to select the final input, so we need to check for composition end instead.
      // See more info at https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/
      // Chrome, Edge, and Firefox seem to work well with just the compose event.
      // Safari is a little bit special. We need to handle 229 as well in this case.
      const nativeEvent = event.nativeEvent as KeyboardEvent;
      const isCompositionKey = nativeEvent.which === 229;
      const isCurrentlyComposing = isComposing || isCompositionKey;

      if (event.key === 'Enter' && !isCurrentlyComposing && !event.shiftKey) {
        event.preventDefault();
        if (!isSendButtonDisabled && !hasStopButton) {
          handleSend(message);
        }
      }
      if (event.key === 'Enter' && !isCurrentlyComposing && event.shiftKey) {
        if (textareaRef.current) {
          handleNewLine(textareaRef.current);
        }
      }
    },
    [isSendButtonDisabled, hasStopButton, handleSend, message, isComposing]
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleAttachMenuToggle = () => {
    attachMenuProps?.setIsAttachMenuOpen && attachMenuProps?.setIsAttachMenuOpen(!attachMenuProps?.isAttachMenuOpen);
    attachMenuProps?.onAttachMenuToggleClick();
  };

  const handleSpeechRecognition = (message) => {
    setMessage(message);
    onChange && onChange({} as ChangeEvent<HTMLTextAreaElement>, message);
  };

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
        <TextArea
          className="pf-chatbot__message-textarea"
          value={message}
          onChange={handleChange}
          aria-label={isListeningMessage ? listeningText : placeholder}
          placeholder={isListeningMessage ? listeningText : placeholder}
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          {...props}
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
        {...attachMenuProps}
      />
    );
  }

  return (
    <div
      className={css(
        'pf-chatbot__message-bar',
        isPrimary && 'pf-m-primary',
        hasAiIndicator && 'pf-v6-m-ai-indicator',
        isThinking && 'pf-v6-m-thinking',
        isMultiline && 'pf-m-multiline',
        className
      )}
    >
      {messageBarContents}
    </div>
  );
};

const MessageBar = forwardRef((props: MessageBarProps, ref: Ref<HTMLTextAreaElement>) => (
  <MessageBarBase innerRef={ref} {...props} />
));

export { MessageBar };
export default MessageBar;
