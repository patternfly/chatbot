// ============================================================================
// Chatbot Main - Message - Content - Code Block
// ============================================================================
import { useState, useRef, useCallback, useEffect } from 'react';
// Import PatternFly components
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Button,
  Tooltip,
  ExpandableSection,
  ExpandableSectionToggle,
  ExpandableSectionProps,
  ExpandableSectionToggleProps,
  ExpandableSectionVariant,
  getUniqueId
} from '@patternfly/react-core';

import { CheckIcon } from '@patternfly/react-icons/dist/esm/icons/check-icon';
import { CopyIcon } from '@patternfly/react-icons/dist/esm/icons/copy-icon';
import { css } from '@patternfly/react-styles';

export interface CodeBlockMessageProps {
  /** Content rendered in code block */
  children?: React.ReactNode;
  /** Aria label applied to code block */
  'aria-label'?: string;
  /** Class name applied to code block */
  className?: string;
  /** Whether code block is expandable */
  isExpandable?: boolean;
  /** Additional props passed to expandable section if isExpandable is applied */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Additional props passed to expandable toggle if isExpandable is applied */
  expandableSectionToggleProps?: ExpandableSectionToggleProps;
  /** Link text applied to expandable toggle when expanded */
  expandedText?: string;
  /** Link text applied to expandable toggle when collapsed */
  collapsedText?: string;
  /** Custom actions added to header of code block, after any default actions such as the "copy" action.  */
  customActions?: React.ReactNode;
  /** Sets background colors to be appropriate on primary chatbot background */
  isPrimary?: boolean;
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const DEFAULT_EXPANDED_TEXT = 'Show less';
const DEFAULT_COLLAPSED_TEXT = 'Show more';

const CodeBlockMessage = ({
  children,
  className,
  'aria-label': ariaLabel,
  isExpandable = false,
  expandableSectionProps,
  expandableSectionToggleProps,
  expandedText = DEFAULT_EXPANDED_TEXT,
  collapsedText = DEFAULT_COLLAPSED_TEXT,
  customActions,
  isPrimary,
  shouldRetainStyles,
  ...props
}: CodeBlockMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const buttonRef = useRef();
  const tooltipID = getUniqueId();
  const toggleId = getUniqueId();
  const contentId = getUniqueId();
  const codeBlockRef = useRef<HTMLDivElement>(null);

  const language = /language-(\w+)/.exec(className || '')?.[1];

  // Get custom toggle text from data attributes if available - for use with rehype plugins
  const customExpandedText = props['data-expanded-text'];
  const customCollapsedText = props['data-collapsed-text'];

  const finalExpandedText = customExpandedText || expandedText;
  const finalCollapsedText = customCollapsedText || collapsedText;

  if (
    (customExpandedText && expandedText !== DEFAULT_EXPANDED_TEXT) ||
    (customCollapsedText && collapsedText !== DEFAULT_COLLAPSED_TEXT)
  ) {
    // eslint-disable-next-line no-console
    console.error(
      'Message:',
      'Custom rehype plugins that rely on data-expanded-text or data-collapsed-text will override expandedText and collapsedText props if both are passed in.'
    );
  }

  const onToggle = (isExpanded) => {
    setIsExpanded(isExpanded);
  };

  // Handle clicking copy button
  const handleCopy = useCallback((event, text) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
  }, []);

  // Reset copied state
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  });

  if (!String(children).includes('\n')) {
    return (
      <code {...props} className={`pf-chatbot__message-inline-code ${isPrimary ? 'pf-m-primary' : ''}`}>
        {children}
      </code>
    );
  }

  // Setup code block header
  const actions = (
    <>
      <CodeBlockAction className="pf-chatbot__message-code-block-default-action">
        {language && <div className="pf-chatbot__message-code-block-language">{language}</div>}
        <Button
          ref={buttonRef}
          aria-label={ariaLabel ?? 'Copy code'}
          variant="plain"
          className="pf-chatbot__button--copy"
          onClick={(event) => handleCopy(event, children)}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
        <Tooltip id={tooltipID} content="Copy" position="top" triggerRef={buttonRef} />
      </CodeBlockAction>
      {customActions}
    </>
  );

  return (
    <div className={css('pf-chatbot__message-code-block', shouldRetainStyles && 'pf-m-markdown')} ref={codeBlockRef}>
      <CodeBlock actions={actions}>
        <CodeBlockCode className={css()}>
          <>
            {isExpandable ? (
              <ExpandableSection
                variant={ExpandableSectionVariant.truncate}
                isExpanded={isExpanded}
                isDetached
                toggleId={toggleId}
                contentId={contentId}
                {...expandableSectionProps}
              >
                {children}
              </ExpandableSection>
            ) : (
              children
            )}
          </>
        </CodeBlockCode>
        {isExpandable && (
          <ExpandableSectionToggle
            isExpanded={isExpanded}
            onToggle={onToggle}
            direction="up"
            toggleId={toggleId}
            contentId={contentId}
            hasTruncatedContent
            className="pf-chatbot__message-code-toggle"
            {...expandableSectionToggleProps}
          >
            {isExpanded ? finalExpandedText : finalCollapsedText}
          </ExpandableSectionToggle>
        )}
      </CodeBlock>
    </div>
  );
};

export default CodeBlockMessage;
