// ============================================================================
// Deep Thinking
// ============================================================================
import {
  Card,
  CardBody,
  CardBodyProps,
  CardProps,
  ExpandableSection,
  ExpandableSectionProps
} from '@patternfly/react-core';
import { useState, type FunctionComponent } from 'react';
import MarkdownContent from '../MarkdownContent';
import type { MarkdownContentProps } from '../MarkdownContent';

export interface DeepThinkingProps {
  /** Toggle content shown for expandable section  */
  toggleContent: React.ReactNode;
  /** Flag indicating whether the expandable content is expanded by default. */
  isDefaultExpanded?: boolean;
  /** Additional props passed to expandable section */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Subheading rendered inside expandable section */
  subheading?: string;
  /** Body text rendered inside expandable section */
  body?: React.ReactNode | string;
  /** Additional props passed to main card */
  cardProps?: CardProps;
  /** Additional props passed to main card body */
  cardBodyProps?: CardBodyProps;
  /** Whether to enable markdown rendering for toggleContent. When true and toggleContent is a string, it will be parsed as markdown. */
  isToggleContentMarkdown?: boolean;
  /** Whether to enable markdown rendering for subheading. When true, subheading will be parsed as markdown. */
  isSubheadingMarkdown?: boolean;
  /** Whether to enable markdown rendering for body. When true and body is a string, it will be parsed as markdown. */
  isBodyMarkdown?: boolean;
  /** Props passed to MarkdownContent component when markdown is enabled */
  markdownContentProps?: Omit<MarkdownContentProps, 'content'>;
  /** Whether to retain styles in the MarkdownContent component. Defaults to false. */
  shouldRetainStyles?: boolean;
}

export const DeepThinking: FunctionComponent<DeepThinkingProps> = ({
  body,
  cardProps,
  expandableSectionProps,
  subheading,
  toggleContent,
  isDefaultExpanded = true,
  cardBodyProps,
  isToggleContentMarkdown,
  isSubheadingMarkdown,
  isBodyMarkdown,
  markdownContentProps,
  shouldRetainStyles = false
}: DeepThinkingProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const renderToggleContent = () => {
    if (isToggleContentMarkdown && typeof toggleContent === 'string') {
      return <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={toggleContent} {...markdownContentProps} />;
    }
    return toggleContent;
  };

  const renderSubheading = () => {
    if (!subheading) {
      return null;
    }
    if (isSubheadingMarkdown) {
      return <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={subheading} {...markdownContentProps} />;
    }
    return subheading;
  };

  const renderBody = () => {
    if (!body) {
      return null;
    }
    if (isBodyMarkdown && typeof body === 'string') {
      return <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={body} {...markdownContentProps} />;
    }
    return body;
  };

  return (
    <Card isCompact className="pf-chatbot__deep-thinking" {...cardProps}>
      <CardBody {...cardBodyProps}>
        <ExpandableSection
          toggleContent={renderToggleContent()}
          onToggle={onToggle}
          isExpanded={isExpanded}
          isIndented
          className="pf-chatbot__deep-thinking-expandable-section"
          {...expandableSectionProps}
        >
          <div className="pf-chatbot__deep-thinking-section">
            {subheading && (
              <div className="pf-chatbot__deep-thinking-subheading">
                <span>{renderSubheading()}</span>
              </div>
            )}
            {body && <div className="pf-chatbot__deep-thinking-body">{renderBody()}</div>}
          </div>
        </ExpandableSection>
      </CardBody>
    </Card>
  );
};

export default DeepThinking;
