// ============================================================================
// Chatbot Main - Message - Content - Code Block
// ============================================================================
import { useState } from 'react';
import { ExpandableSectionProps, ExpandableSection } from '@patternfly/react-core';

import { CodeEditor, CodeEditorProps, Language } from '@patternfly/react-code-editor';

export interface CodeBlockMessageProps {
  /** Content rendered in code block */
  children?: React.ReactNode;
  /** Class name applied to code block */
  className?: string;
  /** Whether code block is expandable */
  isExpandable?: boolean;
  /** Additional props passed to expandable section if isExpandable is applied */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Additional props passed to code editor */
  codeEditorProps?: Omit<CodeEditorProps, 'ref'>;
  /** Link text applied to expandable toggle when expanded */
  expandedText?: string;
  /** Link text applied to expandable toggle when collapsed */
  collapsedText?: string;
}

const DEFAULT_EXPANDED_TEXT = 'Show less';
const DEFAULT_COLLAPSED_TEXT = 'Show more';

const CodeBlockMessage = ({
  children,
  className,
  isExpandable = false,
  expandableSectionProps,
  expandedText = DEFAULT_EXPANDED_TEXT,
  collapsedText = DEFAULT_COLLAPSED_TEXT,
  codeEditorProps,
  ...props
}: CodeBlockMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const languageString = /language-(\w+)/.exec(className || '')?.[1];
  const language = languageString ? Language[languageString] : undefined;

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

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  if (!String(children).includes('\n')) {
    return (
      <code {...props} className="pf-chatbot__message-inline-code">
        {children}
      </code>
    );
  }

  const codeEditor = (
    <CodeEditor
      // Force remount on state change
      // Prevents bug where code editor is 1px high when expandable is opened, closed, and reopened
      key={`code-editor-${isExpanded}`}
      code={children?.toString()}
      isReadOnly
      isCopyEnabled
      isLanguageLabelVisible
      language={language}
      height="sizeToFit"
      {...codeEditorProps}
    ></CodeEditor>
  );

  return (
    <div>
      {isExpandable ? (
        <ExpandableSection
          toggleText={isExpanded ? finalExpandedText : finalCollapsedText}
          onToggle={onToggle}
          isExpanded={isExpanded}
          {...expandableSectionProps}
        >
          {codeEditor}
        </ExpandableSection>
      ) : (
        codeEditor
      )}
    </div>
  );
};

export default CodeBlockMessage;
