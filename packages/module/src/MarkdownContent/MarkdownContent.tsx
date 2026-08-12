// ============================================================================
// Markdown Content - Shared component for rendering markdown
// ============================================================================
import { lazy, Suspense, type FunctionComponent, type ReactNode } from 'react';
import type { Options } from 'react-markdown';
import { ContentVariants } from '@patternfly/react-core';
import type { CodeBlockMessageProps } from '../Message/CodeBlockMessage/CodeBlockMessage';
import type { TableProps } from '@patternfly/react-table';
import type { PluggableList } from 'unified';
import type { ButtonProps } from '@patternfly/react-core';
import TextMessage from '../Message/TextMessage/TextMessage';
import { css } from '@patternfly/react-styles';
const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'));

/**
 * MarkdownContent renders content either as plain text or with content with markdown support.
 *
 * Use this component when passing children to Message to customize its structure.
 */
export interface MarkdownContentProps {
  /** The content to render. Supports markdown formatting by default, or plain text when isMarkdownDisabled is true. */
  content?: string;
  /** Disables markdown parsing, allowing only plain text input */
  isMarkdownDisabled?: boolean;
  /** Props for code blocks */
  codeBlockProps?: CodeBlockMessageProps;
  /** Props for table message. It is important to include a detailed aria-label that describes the purpose of the table. */
  tableProps?: Required<Pick<TableProps, 'aria-label'>> & TableProps;
  /** Additional rehype plugins passed from the consumer */
  additionalRehypePlugins?: PluggableList;
  /** Additional remark plugins passed from the consumer */
  additionalRemarkPlugins?: PluggableList;
  /** Whether to open links in message in new tab. */
  openLinkInNewTab?: boolean;
  /** Props for links */
  linkProps?: ButtonProps;
  /** Allows passing additional props down to markdown parser react-markdown, such as allowedElements and disallowedElements. See https://github.com/remarkjs/react-markdown?tab=readme-ov-file#options for options */
  reactMarkdownProps?: Options;
  /** Allows passing additional props down to remark-gfm. See https://github.com/remarkjs/remark-gfm?tab=readme-ov-file#options for options */
  remarkGfmProps?: Options;
  /** Whether to strip out images in markdown */
  hasNoImages?: boolean;
  /** Sets background colors to be appropriate on primary chatbot background */
  isPrimary?: boolean;
  /** Custom component to render when markdown is disabled */
  textComponent?: ReactNode;
  /** Flag indicating whether content should retain various styles of its context (typically font-size and text color). */
  shouldRetainStyles?: boolean;
}

export const MarkdownContent: FunctionComponent<MarkdownContentProps> = ({
  content,
  isMarkdownDisabled,
  isPrimary,
  textComponent,
  ...markdownProps
}: MarkdownContentProps) => {
  if (isMarkdownDisabled) {
    if (textComponent) {
      return <>{textComponent}</>;
    }
    return (
      <TextMessage component={ContentVariants.p} isPrimary={isPrimary}>
        {content}
      </TextMessage>
    );
  }

  return (
    <Suspense fallback={<span className={css('pf-chatbot__message-text')}>{content}</span>}>
      <MarkdownRenderer {...markdownProps} content={content} isPrimary={isPrimary} />
    </Suspense>
  );
};

export default MarkdownContent;
