// ============================================================================
// Markdown Content - Shared component for rendering markdown
// ============================================================================
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ComponentType,
  type FunctionComponent,
  type ReactNode
} from 'react';
import type { Options } from 'react-markdown';
import { ContentVariants } from '@patternfly/react-core';
import type { CodeBlockMessageProps } from '../Message/CodeBlockMessage/CodeBlockMessage';
import type { TableProps } from '@patternfly/react-table';
import type { PluggableList } from 'unified';
import type { ButtonProps } from '@patternfly/react-core';
import TextMessage from '../Message/TextMessage/TextMessage';

type MarkdownRendererModule = typeof import('./MarkdownRenderer');

let markdownRendererPromise: Promise<MarkdownRendererModule> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ResolvedMarkdownRenderer: ComponentType<any> | null = null;
const markdownRendererListeners = new Set<() => void>();

const importMarkdownRenderer = () => {
  if (!markdownRendererPromise) {
    markdownRendererPromise = import('./MarkdownRenderer').then((module) => {
      ResolvedMarkdownRenderer = module.default;
      markdownRendererListeners.forEach((listener) => listener());
      return module;
    });
  }

  return markdownRendererPromise;
};

const subscribeToMarkdownRendererReady = (listener: () => void) => {
  markdownRendererListeners.add(listener);
  void importMarkdownRenderer();
  return () => markdownRendererListeners.delete(listener);
};

/**
 * Whether the lazy-loaded markdown renderer chunk has finished loading.
 */
export const useIsMarkdownRendererReady = (): boolean =>
  useSyncExternalStore(
    subscribeToMarkdownRendererReady,
    () => ResolvedMarkdownRenderer !== null,
    () => true
  );

/**
 * When provided by `MessageBox`, defers markdown rendering until the shared chunk is ready
 * so existing messages don't each flash an individual loading state.
 */
export const MarkdownRendererReadyContext = createContext<boolean | null>(null);

/**
 * Eagerly fetches the markdown renderer chunk so the first rendered message
 * doesn't flash a loading state while the chunk downloads. Safe to call repeatedly
 * (the dynamic import is cached).
 */
export const preloadMarkdownRenderer = (): void => {
  void importMarkdownRenderer();
};

/**
 * Resolves when the markdown renderer chunk has loaded.
 */
export const whenMarkdownRendererReady = (): Promise<MarkdownRendererModule> => importMarkdownRenderer();

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
  const contextReady = useContext(MarkdownRendererReadyContext);
  const storeReady = useIsMarkdownRendererReady();
  const isMarkdownRendererReady = contextReady ?? storeReady;

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

  if (!isMarkdownRendererReady || !ResolvedMarkdownRenderer) {
    return null;
  }

  return <ResolvedMarkdownRenderer {...markdownProps} content={content} isPrimary={isPrimary} />;
};

export default MarkdownContent;
