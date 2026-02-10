// ============================================================================
// Chatbot Main - Message
// ============================================================================
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import type { FunctionComponent, HTMLProps, MouseEvent as ReactMouseEvent, Ref } from 'react';
import { Options } from 'react-markdown';
import {
  AlertProps,
  Avatar,
  AvatarProps,
  ButtonProps,
  FormProps,
  Label,
  LabelGroupProps,
  Timestamp,
  Truncate
} from '@patternfly/react-core';
import MessageLoading from './MessageLoading';
import { CodeBlockMessageProps } from './CodeBlockMessage/CodeBlockMessage';
import FileDetailsLabel from '../FileDetailsLabel/FileDetailsLabel';
import ResponseActions, { ActionProps } from '../ResponseActions/ResponseActions';
import SourcesCard, { SourcesCardProps } from '../SourcesCard';
import QuickStartTile from './QuickStarts/QuickStartTile';
import { QuickStart, QuickstartAction } from './QuickStarts/types';
import QuickResponse from './QuickResponse/QuickResponse';
import UserFeedback, { UserFeedbackProps } from './UserFeedback/UserFeedback';
import UserFeedbackComplete, { UserFeedbackCompleteProps } from './UserFeedback/UserFeedbackComplete';
import { TableProps } from '@patternfly/react-table';
// see the full list of styles here: https://highlightjs.org/examples
import 'highlight.js/styles/vs2015.css';
import { PluggableList } from 'unified';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import MessageInput from './MessageInput';
import ToolResponse, { ToolResponseProps } from '../ToolResponse';
import DeepThinking, { DeepThinkingProps } from '../DeepThinking';
import ToolCall, { ToolCallProps } from '../ToolCall';
import MarkdownContent from '../MarkdownContent';
import { css } from '@patternfly/react-styles';

export interface MessageAttachment {
  /** Name of file attached to the message */
  name: string;
  /** Unique identifier of file attached to the message */
  id?: string | number;
  /** Callback for when attachment label is clicked */
  onClick?: (event: React.MouseEvent, name: string, id?: string | number) => void;
  /** Callback for when attachment label is closed */
  onClose?: (event: React.MouseEvent, name: string, id?: string | number) => void;
  /** Whether file is loading */
  isLoading?: boolean;
  /** Aria label for attachment close button */
  closeButtonAriaLabel?: string;
  /** Custom test id for the language in the attachment component */
  languageTestId?: string;
  /** Custom test id for the loading spinner in the attachment component */
  spinnerTestId?: string;
}

export interface MessageExtraContent {
  /** Content to display before the main content */
  beforeMainContent?: ReactNode;

  /** Content to display after the main content */
  afterMainContent?: ReactNode;

  /** Content to display at the end */
  endContent?: ReactNode;
}

export interface MessageProps extends Omit<HTMLProps<HTMLDivElement>, 'role'> {
  /** Children to render instead of the default message structure, allowing more fine-tuned message control. When provided, this will override the default rendering of content, toolResponse, deepThinking, toolCall, sources, quickStarts, actions, etc. */
  children?: ReactNode;
  /** Unique id for message */
  id?: string;
  /** Role of the user sending the message */
  role: 'user' | 'bot';
  /** Whether the message is aligned at the horizontal start or end of the message container. */
  alignment?: 'start' | 'end';
  /** Flag indicating whether message metadata (user name and timestamp) are visible. */
  isMetadataVisible?: boolean;
  /** Message content */
  content?: string;
  /** Extra Message content */
  extraContent?: MessageExtraContent;
  /** Name of the user */
  name?: string;
  /** Avatar src for the user */
  avatar?: string;
  /** Timestamp for the message */
  timestamp?: string;
  /** Set this to true if message is being loaded */
  isLoading?: boolean;
  /** Array of attachments attached to a message */
  attachments?: MessageAttachment[];
  /** Props for message actions, such as feedback (positive or negative), copy button, edit message, share, and listen.
   * Can be a single actions object or an array of action group objects. When passing an array, you can pass an object of actions or
   * an object that contains an actions property for finer control of selection persistence.
   */
  actions?:
    | {
        [key: string]: ActionProps;
      }
    | {
        [key: string]: ActionProps;
      }[]
    | {
        actions: {
          [key: string]: ActionProps;
        };
        persistActionSelection?: boolean;
      }[];
  /** When true, the selected action will persist even when clicking outside the component.
   * When false (default), clicking outside or clicking another action will deselect the current selection.
   * For finer control of multiple action groups, use persistActionSelection on each group.
   */
  persistActionSelection?: boolean;
  /** Sources for message */
  sources?: SourcesCardProps;
  /** Label for the English word "AI," used to tag messages with role "bot" */
  botWord?: string;
  /** Label for the English "Loading message," displayed to screenreaders when loading a message */
  loadingWord?: string;
  /** Props for code blocks */
  codeBlockProps?: CodeBlockMessageProps;
  /** Props for quick responses */
  quickResponses?: QuickResponse[];
  /** Props for quick responses container */
  quickResponseContainerProps?: Omit<LabelGroupProps, 'ref'>;
  /** Props for user feedback card */
  userFeedbackForm?: Omit<UserFeedbackProps, 'ref'>;
  /** Props for user feedback response */
  userFeedbackComplete?: Omit<UserFeedbackCompleteProps, 'ref'>;
  /** Whether avatar is round */
  hasRoundAvatar?: boolean;
  /** Any additional props applied to the avatar, for additional customization  */
  avatarProps?: Omit<AvatarProps, 'alt'>;
  /** Props for QuickStart card */
  quickStarts?: {
    quickStart: QuickStart;
    onSelectQuickStart: (id?: string) => void;
    minuteWord?: string;
    minuteWordPlural?: string;
    prerequisiteWord?: string;
    prerequisiteWordPlural?: string;
    quickStartButtonAriaLabel?: string;
    className?: string;
    onClick?: () => void;
    action?: QuickstartAction;
  };
  /** Turns the container into a live region so that changes to content within the Message, such as appending a feedback card, are reliably announced to assistive technology. */
  isLiveRegion?: boolean;
  /** Ref applied to message  */
  innerRef?: Ref<HTMLDivElement>;
  /** Props for table message. It is important to include a detailed aria-label that describes the purpose of the table. */
  tableProps?: Required<Pick<TableProps, 'aria-label'>> & TableProps;
  /** Additional rehype plugins passed from the consumer */
  additionalRehypePlugins?: PluggableList;
  /** Additional remark plugins passed from the consumer */
  additionalRemarkPlugins?: PluggableList;
  /** Whether to open links in message in new tab. */
  openLinkInNewTab?: boolean;
  /** Optional inline error message that can be displayed in the message */
  error?: AlertProps;
  /** Props for links */
  linkProps?: ButtonProps;
  /** Whether message is in edit mode */
  isEditable?: boolean;
  /** Placeholder for edit input */
  editPlaceholder?: string;
  /** Label for the English word "Update" used in edit mode. */
  updateWord?: string;
  /** Label for the English word "Cancel" used in edit mode. */
  cancelWord?: string;
  /** Callback function for when edit mode update button is clicked */
  onEditUpdate?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Callback functionf or when edit cancel update button is clicked */
  onEditCancel?: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Ref applied to editable message input */
  inputRef?: Ref<HTMLTextAreaElement>;
  /** Props for edit form */
  editFormProps?: FormProps;
  /** Sets message to compact styling. */
  isCompact?: boolean;
  /** Disables markdown parsing for message, allowing only text input */
  isMarkdownDisabled?: boolean;
  /** Allows passing additional props down to markdown parser react-markdown, such as allowedElements and disallowedElements. See https://github.com/remarkjs/react-markdown?tab=readme-ov-file#options for options */
  reactMarkdownProps?: Options;
  /** Props for tool response card */
  toolResponse?: ToolResponseProps;
  /** Props for deep thinking card */
  deepThinking?: DeepThinkingProps;
  /** Allows passing additional props down to remark-gfm. See https://github.com/remarkjs/remark-gfm?tab=readme-ov-file#options for options */
  remarkGfmProps?: Options;
  /** Props for a tool call message */
  toolCall?: ToolCallProps;
  /** Whether user messages default to stripping out images in markdown */
  hasNoImagesInUserMessages?: boolean;
  /** Sets background colors to be appropriate on primary chatbot background */
  isPrimary?: boolean;
}

export const MessageBase: FunctionComponent<MessageProps> = ({
  children,
  role,
  alignment = 'start',
  isMetadataVisible = true,
  content,
  extraContent,
  name,
  avatar,
  timestamp,
  isLoading,
  actions,
  persistActionSelection,
  sources,
  botWord = 'AI',
  loadingWord = 'Loading message',
  codeBlockProps,
  quickResponses,
  quickResponseContainerProps = { numLabels: 5 },
  attachments,
  hasRoundAvatar = true,
  avatarProps,
  quickStarts,
  userFeedbackForm,
  userFeedbackComplete,
  isLiveRegion = true,
  innerRef,
  tableProps,
  openLinkInNewTab = true,
  additionalRehypePlugins = [],
  additionalRemarkPlugins = [],
  linkProps,
  error,
  isEditable,
  editPlaceholder = 'Edit prompt message...',
  updateWord = 'Update',
  cancelWord = 'Cancel',
  onEditUpdate,
  onEditCancel,
  inputRef,
  editFormProps,
  isCompact,
  isMarkdownDisabled,
  reactMarkdownProps,
  toolResponse,
  deepThinking,
  remarkGfmProps,
  toolCall,
  hasNoImagesInUserMessages = true,
  isPrimary,
  ...props
}: MessageProps) => {
  const [messageText, setMessageText] = useState(content);

  useEffect(() => {
    setMessageText(content);
  }, [content]);

  const { beforeMainContent, afterMainContent, endContent } = extraContent || {};

  let avatarClassName: string | undefined;
  if (avatarProps && 'className' in avatarProps) {
    const { className, ...rest } = avatarProps;
    avatarClassName = className;
    avatarProps = { ...rest };
  }
  // Keep timestamps consistent between Timestamp component and aria-label
  const date = new Date();
  const dateString = timestamp ?? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  const handleMarkdown = () => (
    <MarkdownContent
      content={messageText}
      isMarkdownDisabled={isMarkdownDisabled}
      codeBlockProps={codeBlockProps}
      tableProps={tableProps}
      openLinkInNewTab={openLinkInNewTab}
      additionalRehypePlugins={additionalRehypePlugins}
      additionalRemarkPlugins={additionalRemarkPlugins}
      linkProps={linkProps}
      reactMarkdownProps={reactMarkdownProps}
      remarkGfmProps={remarkGfmProps}
      hasNoImages={role === 'user' && hasNoImagesInUserMessages}
      isPrimary={isPrimary}
    />
  );

  const renderMessage = () => {
    if (isLoading) {
      return <MessageLoading loadingWord={loadingWord} isPrimary={isPrimary} />;
    }
    if (isEditable) {
      return (
        <>
          {beforeMainContent && <>{beforeMainContent}</>}
          <MessageInput
            content={messageText}
            editPlaceholder={editPlaceholder}
            updateWord={updateWord}
            cancelWord={cancelWord}
            onEditUpdate={(event: ReactMouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
              onEditUpdate && onEditUpdate(event);
              setMessageText(value);
            }}
            onEditCancel={onEditCancel}
            inputRef={inputRef}
            {...editFormProps}
          />
        </>
      );
    }
    return (
      <>
        {beforeMainContent && <>{beforeMainContent}</>}
        {error ? <ErrorMessage {...error} /> : handleMarkdown()}
      </>
    );
  };

  return (
    <section
      aria-label={`Message from ${role} - ${dateString}`}
      className={css(`pf-chatbot__message pf-chatbot__message--${role}`, alignment === 'end' && 'pf-m-end')}
      aria-live={isLiveRegion ? 'polite' : undefined}
      aria-atomic={isLiveRegion ? false : undefined}
      ref={innerRef}
      {...props}
    >
      {/* We are using an empty alt tag intentionally in order to reduce noise on screen readers */}
      {avatar && (
        <Avatar
          className={`pf-chatbot__message-avatar ${hasRoundAvatar ? 'pf-chatbot__message-avatar--round' : ''} ${avatarClassName ? avatarClassName : ''}`}
          src={avatar}
          alt=""
          {...avatarProps}
        />
      )}
      <div className="pf-chatbot__message-contents">
        {isMetadataVisible && (
          <div className="pf-chatbot__message-meta">
            {name && (
              <span className="pf-chatbot__message-name">
                <Truncate content={name} />
              </span>
            )}
            {role === 'bot' && (
              <Label variant="outline" isCompact>
                {botWord}
              </Label>
            )}
            <Timestamp date={date}>{timestamp}</Timestamp>
          </div>
        )}
        <div className="pf-chatbot__message-response">
          {children ? (
            <>{children}</>
          ) : (
            <>
              <div className="pf-chatbot__message-and-actions">
                {renderMessage()}
                {afterMainContent && <>{afterMainContent}</>}
                {toolResponse && <ToolResponse {...toolResponse} />}
                {deepThinking && <DeepThinking {...deepThinking} />}
                {toolCall && <ToolCall {...toolCall} />}
                {!isLoading && sources && <SourcesCard {...sources} isCompact={isCompact} />}
                {quickStarts && quickStarts.quickStart && (
                  <QuickStartTile
                    quickStart={quickStarts.quickStart}
                    onSelectQuickStart={quickStarts.onSelectQuickStart}
                    minuteWord={quickStarts.minuteWord}
                    minuteWordPlural={quickStarts.minuteWordPlural}
                    prerequisiteWord={quickStarts.prerequisiteWord}
                    prerequisiteWordPlural={quickStarts.prerequisiteWordPlural}
                    quickStartButtonAriaLabel={quickStarts.quickStartButtonAriaLabel}
                    isCompact={isCompact}
                  />
                )}
                {!isLoading && !isEditable && actions && (
                  <>
                    {Array.isArray(actions) ? (
                      <div className="pf-chatbot__response-actions-groups">
                        {actions.map((actionGroup, index) => (
                          <ResponseActions
                            key={index}
                            actions={actionGroup.actions || actionGroup}
                            persistActionSelection={persistActionSelection || actionGroup.persistActionSelection}
                          />
                        ))}
                      </div>
                    ) : (
                      <ResponseActions actions={actions} persistActionSelection={persistActionSelection} />
                    )}
                  </>
                )}
                {userFeedbackForm && (
                  <UserFeedback {...userFeedbackForm} timestamp={dateString} isCompact={isCompact} />
                )}
                {userFeedbackComplete && (
                  <UserFeedbackComplete {...userFeedbackComplete} timestamp={dateString} isCompact={isCompact} />
                )}
                {!isLoading && quickResponses && (
                  <QuickResponse
                    quickResponses={quickResponses}
                    quickResponseContainerProps={quickResponseContainerProps}
                    isCompact={isCompact}
                  />
                )}
              </div>
              {attachments && (
                <div className="pf-chatbot__message-attachments-container">
                  {attachments.map((attachment) => (
                    <div key={attachment.id ?? attachment.name} className="pf-chatbot__message-attachment">
                      <FileDetailsLabel
                        fileName={attachment.name}
                        fileId={attachment.id}
                        onClose={attachment.onClose}
                        onClick={attachment.onClick}
                        isLoading={attachment.isLoading}
                        closeButtonAriaLabel={attachment.closeButtonAriaLabel}
                        languageTestId={attachment.languageTestId}
                        spinnerTestId={attachment.spinnerTestId}
                        variant={isPrimary ? 'outline' : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}
              {!isLoading && endContent && <>{endContent}</>}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const Message = forwardRef((props: MessageProps, ref: Ref<HTMLDivElement>) => (
  <MessageBase innerRef={ref} {...props} />
));

export default Message;
