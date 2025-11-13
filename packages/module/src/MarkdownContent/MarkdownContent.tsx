// ============================================================================
// Markdown Content - Shared component for rendering markdown
// With aid from Jean-Claude Van Code
// ============================================================================
import { type FunctionComponent, ReactNode } from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ContentVariants } from '@patternfly/react-core';
import CodeBlockMessage, { CodeBlockMessageProps } from '../Message/CodeBlockMessage/CodeBlockMessage';
import TextMessage from '../Message/TextMessage/TextMessage';
import ListItemMessage from '../Message/ListMessage/ListItemMessage';
import UnorderedListMessage from '../Message/ListMessage/UnorderedListMessage';
import OrderedListMessage from '../Message/ListMessage/OrderedListMessage';
import TableMessage from '../Message/TableMessage/TableMessage';
import TrMessage from '../Message/TableMessage/TrMessage';
import TdMessage from '../Message/TableMessage/TdMessage';
import TbodyMessage from '../Message/TableMessage/TbodyMessage';
import TheadMessage from '../Message/TableMessage/TheadMessage';
import ThMessage from '../Message/TableMessage/ThMessage';
import { TableProps } from '@patternfly/react-table';
import ImageMessage from '../Message/ImageMessage/ImageMessage';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css';
import { PluggableList } from 'unified';
import LinkMessage from '../Message/LinkMessage/LinkMessage';
import { rehypeMoveImagesOutOfParagraphs } from '../Message/Plugins/rehypeMoveImagesOutOfParagraphs';
import SuperscriptMessage from '../Message/SuperscriptMessage/SuperscriptMessage';
import { ButtonProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

export interface MarkdownContentProps {
  /** The markdown content to render */
  content?: string;
  /** Disables markdown parsing, allowing only text input */
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
  codeBlockProps,
  tableProps,
  openLinkInNewTab = true,
  additionalRehypePlugins = [],
  additionalRemarkPlugins = [],
  linkProps,
  reactMarkdownProps,
  remarkGfmProps,
  hasNoImages = false,
  isPrimary,
  textComponent,
  shouldRetainStyles
}: MarkdownContentProps) => {
  let rehypePlugins: PluggableList = [rehypeUnwrapImages, rehypeMoveImagesOutOfParagraphs, rehypeHighlight];
  if (openLinkInNewTab) {
    rehypePlugins = rehypePlugins.concat([[rehypeExternalLinks, { target: '_blank' }, rehypeSanitize]]);
  }
  if (additionalRehypePlugins) {
    rehypePlugins.push(...additionalRehypePlugins);
  }

  const disallowedElements = hasNoImages ? ['img'] : [];
  if (reactMarkdownProps && reactMarkdownProps.disallowedElements) {
    disallowedElements.push(...reactMarkdownProps.disallowedElements);
  }

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
    <Markdown
      components={{
        section: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return (
            <section
              {...rest}
              className={css('pf-chatbot__message-text', shouldRetainStyles && 'pf-m-markdown', rest?.className)}
            />
          );
        },
        p: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return (
            <TextMessage
              shouldRetainStyles={shouldRetainStyles}
              component={ContentVariants.p}
              {...rest}
              isPrimary={isPrimary}
            />
          );
        },
        code: ({ children, ...props }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...codeProps } = props;
          return (
            <CodeBlockMessage
              {...codeProps}
              {...codeBlockProps}
              isPrimary={isPrimary}
              shouldRetainStyles={shouldRetainStyles}
              // className={css('pf-m-markdown', codeBlockProps?.className)}
            >
              {children}
            </CodeBlockMessage>
          );
        },
        h1: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h1} {...rest} />;
        },
        h2: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h2} {...rest} />;
        },
        h3: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h3} {...rest} />;
        },
        h4: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h4} {...rest} />;
        },
        h5: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h5} {...rest} />;
        },
        h6: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.h6} {...rest} />;
        },
        blockquote: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return (
            <TextMessage shouldRetainStyles={shouldRetainStyles} component={ContentVariants.blockquote} {...rest} />
          );
        },
        ul: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <UnorderedListMessage shouldRetainStyles={shouldRetainStyles} {...rest} />;
        },
        ol: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <OrderedListMessage shouldRetainStyles={shouldRetainStyles} {...rest} />;
        },
        li: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <ListItemMessage {...rest} />;
        },
        // table requires node attribute for calculating headers for mobile breakpoint
        table: (props) => (
          <TableMessage shouldRetainStyles={shouldRetainStyles} {...props} {...tableProps} isPrimary={isPrimary} />
        ),
        tbody: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TbodyMessage {...rest} />;
        },
        thead: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TheadMessage {...rest} />;
        },
        tr: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <TrMessage {...rest} />;
        },
        td: (props) => {
          // Conflicts with Td type
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, width, ...rest } = props;
          return <TdMessage {...rest} />;
        },
        th: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <ThMessage {...rest} />;
        },
        img: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <ImageMessage {...rest} />;
        },
        a: (props) => {
          // node is just the details of the document structure - not needed
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return (
            // some a types conflict with ButtonProps, but it's ok because we are using an a tag
            // there are too many to handle manually
            <LinkMessage shouldRetainStyles={shouldRetainStyles} {...(rest as any)} {...linkProps}>
              {props.children}
            </LinkMessage>
          );
        },
        // used for footnotes
        sup: (props) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { node, ...rest } = props;
          return <SuperscriptMessage {...rest} />;
        }
      }}
      remarkPlugins={[[remarkGfm, { ...remarkGfmProps }], ...additionalRemarkPlugins]}
      rehypePlugins={rehypePlugins}
      {...reactMarkdownProps}
      remarkRehypeOptions={{
        // removes sr-only class from footnote labels applied by default
        footnoteLabelProperties: { className: [''] },
        ...reactMarkdownProps?.remarkRehypeOptions
      }}
      disallowedElements={disallowedElements}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownContent;
