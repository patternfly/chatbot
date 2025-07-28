// ============================================================================
// Chatbot Main - Message
// ============================================================================
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import type { FunctionComponent, HTMLProps, MouseEvent as ReactMouseEvent, Ref } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertProps,
  Avatar,
  AvatarProps,
  ButtonProps,
  ContentVariants,
  ExpandableSectionProps,
  ExpandableSectionToggleProps,
  FormProps,
  Label,
  LabelGroupProps,
  Timestamp,
  Truncate
} from '@patternfly/react-core';
import MessageLoading from './MessageLoading';
import CodeBlockMessage from './CodeBlockMessage/CodeBlockMessage';
import TextMessage from './TextMessage/TextMessage';
import FileDetailsLabel from '../FileDetailsLabel/FileDetailsLabel';
import ResponseActions, { ActionProps } from '../ResponseActions/ResponseActions';
import SourcesCard, { SourcesCardProps } from '../SourcesCard';
import ListItemMessage from './ListMessage/ListItemMessage';
import UnorderedListMessage from './ListMessage/UnorderedListMessage';
import OrderedListMessage from './ListMessage/OrderedListMessage';
import QuickStartTile from './QuickStarts/QuickStartTile';
import { QuickStart, QuickstartAction } from './QuickStarts/types';
import QuickResponse from './QuickResponse/QuickResponse';
import UserFeedback, { UserFeedbackProps } from './UserFeedback/UserFeedback';
import UserFeedbackComplete, { UserFeedbackCompleteProps } from './UserFeedback/UserFeedbackComplete';
import TableMessage from './TableMessage/TableMessage';
import TrMessage from './TableMessage/TrMessage';
import TdMessage from './TableMessage/TdMessage';
import TbodyMessage from './TableMessage/TbodyMessage';
import TheadMessage from './TableMessage/TheadMessage';
import ThMessage from './TableMessage/ThMessage';
import { TableProps } from '@patternfly/react-table';
import ImageMessage from './ImageMessage/ImageMessage';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import { PluggableList } from 'react-markdown/lib';
import LinkMessage from './LinkMessage/LinkMessage';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import MessageInput from './MessageInput';
import { rehypeMoveImagesOutOfParagraphs } from './Plugins/rehypeMoveImagesOutOfParagraphs';

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
  /** Unique id for message */
  id?: string;
  /** Role of the user sending the message */
  role: 'user' | 'bot';
  /** Message content */
  content?: string;
  /** Extra Message content */
  extraContent?: MessageExtraContent;
  /** Name of the user */
  name?: string;
  /** Avatar src for the user */
  avatar: string;
  /** Timestamp for the message */
  timestamp?: string;
  /** Set this to true if message is being loaded */
  isLoading?: boolean;
  /** Array of attachments attached to a message */
  attachments?: MessageAttachment[];
  /** Props for message actions, such as feedback (positive or negative), copy button, edit message, share, and listen */
  actions?: {
    [key: string]: ActionProps;
  };
  /** Sources for message */
  sources?: SourcesCardProps;
  /** Label for the English word "AI," used to tag messages with role "bot" */
  botWord?: string;
  /** Label for the English "Loading message," displayed to screenreaders when loading a message */
  loadingWord?: string;
  /** Props for code blocks */
  codeBlockProps?: {
    /** Aria label applied to code blocks */
    'aria-label'?: string;
    /** Class name applied to code blocks */
    className?: string;
    /** Whether code blocks are expandable */
    isExpandable?: boolean;
    /** Length of text initially shown in expandable code blocks; defaults to 10 characters */
    maxLength?: number;
    /** Additional props passed to expandable section if isExpandable is applied */
    expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
    /** Additional props passed to expandable toggle if isExpandable is applied */
    expandableSectionToggleProps?: ExpandableSectionToggleProps;
    /** Link text applied to expandable toggle when expanded */
    expandedText?: string;
    /** Link text applied to expandable toggle when collapsed */
    collapsedText?: string;
  };
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
}

export const MessageBase: FunctionComponent<MessageProps> = ({
  role,
  content,
  extraContent,
  name,
  avatar,
  timestamp,
  isLoading,
  actions,
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
  ...props
}: MessageProps) => {
  const [messageText, setMessageText] = useState(content);

  useEffect(() => {
    setMessageText(content);
  }, [content]);

  const { beforeMainContent, afterMainContent, endContent } = extraContent || {};
  let rehypePlugins: PluggableList = [rehypeUnwrapImages, rehypeMoveImagesOutOfParagraphs];
  if (openLinkInNewTab) {
    rehypePlugins = rehypePlugins.concat([[rehypeExternalLinks, { target: '_blank' }, rehypeSanitize]]);
  }
  if (additionalRehypePlugins) {
    rehypePlugins.push(...additionalRehypePlugins);
  }
  let avatarClassName;
  if (avatarProps && 'className' in avatarProps) {
    const { className, ...rest } = avatarProps;
    avatarClassName = className;
    avatarProps = { ...rest };
  }
  // Keep timestamps consistent between Timestamp component and aria-label
  const date = new Date();
  const dateString = timestamp ?? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  const renderMessage = () => {
    if (isLoading) {
      return <MessageLoading loadingWord={loadingWord} />;
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
        {error ? (
          <ErrorMessage {...error} />
        ) : (
          <Markdown
            components={{
              p: (props) => <TextMessage component={ContentVariants.p} {...props} />,
              code: ({ children, ...props }) => (
                <CodeBlockMessage {...props} {...codeBlockProps}>
                  {children}
                </CodeBlockMessage>
              ),
              h1: (props) => <TextMessage component={ContentVariants.h1} {...props} />,
              h2: (props) => <TextMessage component={ContentVariants.h2} {...props} />,
              h3: (props) => <TextMessage component={ContentVariants.h3} {...props} />,
              h4: (props) => <TextMessage component={ContentVariants.h4} {...props} />,
              h5: (props) => <TextMessage component={ContentVariants.h5} {...props} />,
              h6: (props) => <TextMessage component={ContentVariants.h6} {...props} />,
              blockquote: (props) => <TextMessage component={ContentVariants.blockquote} {...props} />,
              ul: (props) => <UnorderedListMessage {...props} />,
              ol: (props) => <OrderedListMessage {...props} />,
              li: (props) => <ListItemMessage {...props} />,
              table: (props) => <TableMessage {...props} {...tableProps} />,
              tbody: (props) => <TbodyMessage {...props} />,
              thead: (props) => <TheadMessage {...props} />,
              tr: (props) => <TrMessage {...props} />,
              td: (props) => {
                // Conflicts with Td type
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { width, ...rest } = props;
                return <TdMessage {...rest} />;
              },
              th: (props) => <ThMessage {...props} />,
              img: (props) => <ImageMessage {...props} />,
              a: (props) => (
                <LinkMessage href={props.href} rel={props.rel} target={props.target} {...linkProps}>
                  {props.children}
                </LinkMessage>
              )
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins}
          >
            {messageText}
          </Markdown>
        )}
      </>
    );
  };

  return (
    <section
      aria-label={`Message from ${role} - ${dateString}`}
      className={`pf-chatbot__message pf-chatbot__message--${role}`}
      aria-live={isLiveRegion ? 'polite' : undefined}
      aria-atomic={isLiveRegion ? false : undefined}
      ref={innerRef}
      {...props}
    >
      {/* We are using an empty alt tag intentionally in order to reduce noise on screen readers */}
      <Avatar
        className={`pf-chatbot__message-avatar ${hasRoundAvatar ? 'pf-chatbot__message-avatar--round' : ''} ${avatarClassName ? avatarClassName : ''}`}
        src={avatar}
        alt=""
        {...avatarProps}
      />
      <div className="pf-chatbot__message-contents">
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
        <div className="pf-chatbot__message-response">
          <div className="pf-chatbot__message-and-actions">
            {renderMessage()}
            {afterMainContent && <>{afterMainContent}</>}
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
            {!isLoading && !isEditable && actions && <ResponseActions actions={actions} />}
            {userFeedbackForm && <UserFeedback {...userFeedbackForm} timestamp={dateString} isCompact={isCompact} />}
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
                  />
                </div>
              ))}
            </div>
          )}
          {!isLoading && endContent && <>{endContent}</>}
        </div>
      </div>
    </section>
  );
};

const Message = forwardRef((props: MessageProps, ref: Ref<HTMLDivElement>) => (
  <MessageBase innerRef={ref} {...props} />
));

export default Message;
