// ============================================================================
// Chatbot Main - Message
// ============================================================================

import React, { ReactNode } from 'react';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Avatar,
  AvatarProps,
  ContentVariants,
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
import { PluggableList } from 'react-markdown/lib';

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

export interface MessageProps extends Omit<React.HTMLProps<HTMLDivElement>, 'role'> {
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
  /** Props for message actions, such as feedback (positive or negative), copy button, share, and listen */
  actions?: {
    [key: string]: ActionProps;
  };
  /** Sources for message */
  sources?: SourcesCardProps;
  /** Label for the English word "AI," used to tag messages with role "bot" */
  botWord?: string;
  /** Label for the English "Loading message," displayed to screenreaders when loading a message */
  loadingWord?: string;
  codeBlockProps?: {
    'aria-label'?: string;
    className?: string;
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
  innerRef?: React.Ref<HTMLDivElement>;
  /** Props for table message. It is important to include a detailed aria-label that describes the purpose of the table. */
  tableProps?: Required<Pick<TableProps, 'aria-label'>> & TableProps;
  /** Additional rehype plugins passed from the consumer */
  additionalRehypePlugins?: PluggableList;
}

export const MessageBase: React.FunctionComponent<MessageProps> = ({
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
  additionalRehypePlugins = [],
  ...props
}: MessageProps) => {
  const { beforeMainContent, afterMainContent, endContent } = extraContent || {};
  let avatarClassName;
  if (avatarProps && 'className' in avatarProps) {
    const { className, ...rest } = avatarProps;
    avatarClassName = className;
    avatarProps = { ...rest };
  }
  // Keep timestamps consistent between Timestamp component and aria-label
  const date = new Date();
  const dateString = timestamp ?? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  const rehypePlugins = [rehypeUnwrapImages, ...(additionalRehypePlugins ?? [])];

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
            {isLoading ? (
              <MessageLoading loadingWord={loadingWord} />
            ) : (
              <>
                {beforeMainContent && <>{beforeMainContent}</>}
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
                    img: (props) => <ImageMessage {...props} />
                  }}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={rehypePlugins}
                >
                  {content}
                </Markdown>
                {afterMainContent && <>{afterMainContent}</>}
              </>
            )}
            {!isLoading && sources && <SourcesCard {...sources} />}
            {quickStarts && quickStarts.quickStart && (
              <QuickStartTile
                quickStart={quickStarts.quickStart}
                onSelectQuickStart={quickStarts.onSelectQuickStart}
                minuteWord={quickStarts.minuteWord}
                minuteWordPlural={quickStarts.minuteWordPlural}
                prerequisiteWord={quickStarts.prerequisiteWord}
                prerequisiteWordPlural={quickStarts.prerequisiteWordPlural}
                quickStartButtonAriaLabel={quickStarts.quickStartButtonAriaLabel}
              />
            )}
            {!isLoading && actions && <ResponseActions actions={actions} />}
            {userFeedbackForm && <UserFeedback {...userFeedbackForm} timestamp={dateString} />}
            {userFeedbackComplete && <UserFeedbackComplete {...userFeedbackComplete} timestamp={dateString} />}
            {!isLoading && quickResponses && (
              <QuickResponse
                quickResponses={quickResponses}
                quickResponseContainerProps={quickResponseContainerProps}
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

const Message = React.forwardRef((props: MessageProps, ref: React.Ref<HTMLDivElement>) => (
  <MessageBase innerRef={ref} {...props} />
));

export default Message;
