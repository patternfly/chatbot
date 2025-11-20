// ============================================================================
// Tool Response Card
// ============================================================================
import {
  Card,
  CardBody,
  CardBodyProps,
  CardProps,
  CardTitle,
  CardTitleProps,
  Divider,
  DividerProps,
  ExpandableSection,
  ExpandableSectionProps
} from '@patternfly/react-core';
import { useState, type FunctionComponent } from 'react';
import MarkdownContent from '../MarkdownContent';
import type { MarkdownContentProps } from '../MarkdownContent';

export interface ToolResponseProps {
  /** Toggle content shown for expandable section */
  toggleContent: React.ReactNode;
  /** Flag indicating whether the expandable content is expanded by default. */
  isDefaultExpanded?: boolean;
  /** Additional props passed to expandable section */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Subheading rendered inside expandable section */
  subheading?: string;
  /** Body text rendered inside expandable section */
  body?: React.ReactNode | string;
  /** Content passed into tool response card body */
  cardBody?: React.ReactNode;
  /** Content passed into tool response card title */
  cardTitle?: React.ReactNode;
  /** Additional props passed to main card */
  cardProps?: CardProps;
  /** Additional props passed to main card body */
  cardBodyProps?: CardBodyProps;
  /** Additional props passed to tool response card */
  toolResponseCardProps?: CardProps;
  /** Additional props passed to tool response card body */
  toolResponseCardBodyProps?: CardBodyProps;
  /** Additional props passed to tool response card divider */
  toolResponseCardDividerProps?: DividerProps;
  /** Additional props passed to tool response card title */
  toolResponseCardTitleProps?: CardTitleProps;
  /** Whether to enable markdown rendering for toggleContent. When true and toggleContent is a string, it will be parsed as markdown. */
  isToggleContentMarkdown?: boolean;
  /** Whether to enable markdown rendering for subheading. When true, subheading will be parsed as markdown. */
  isSubheadingMarkdown?: boolean;
  /** Whether to enable markdown rendering for body. When true and body is a string, it will be parsed as markdown. */
  isBodyMarkdown?: boolean;
  /** Whether to enable markdown rendering for cardBody. When true and cardBody is a string, it will be parsed as markdown. */
  isCardBodyMarkdown?: boolean;
  /** Whether to enable markdown rendering for cardTitle. When true and cardTitle is a string, it will be parsed as markdown. */
  isCardTitleMarkdown?: boolean;
  /** Props passed to MarkdownContent component when markdown is enabled */
  markdownContentProps?: Omit<MarkdownContentProps, 'content'>;
  /** Whether to retain styles in the MarkdownContent component. Defaults to false. */
  shouldRetainStyles?: boolean;
}

export const ToolResponse: FunctionComponent<ToolResponseProps> = ({
  body,
  cardProps,
  expandableSectionProps,
  subheading,
  cardBody,
  cardTitle,
  cardBodyProps,
  toggleContent,
  isDefaultExpanded = true,
  toolResponseCardBodyProps,
  toolResponseCardDividerProps,
  toolResponseCardProps,
  toolResponseCardTitleProps,
  isToggleContentMarkdown,
  isSubheadingMarkdown,
  isBodyMarkdown,
  isCardBodyMarkdown,
  isCardTitleMarkdown,
  markdownContentProps,
  shouldRetainStyles = false
}: ToolResponseProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const renderToggleContent = () => {
    if (isToggleContentMarkdown && typeof toggleContent === 'string') {
      return (
        <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={toggleContent} {...markdownContentProps} />
      );
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

  const renderCardTitle = () => {
    if (!cardTitle) {
      return null;
    }
    if (isCardTitleMarkdown && typeof cardTitle === 'string') {
      return <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={cardTitle} {...markdownContentProps} />;
    }
    return cardTitle;
  };

  const renderCardBody = () => {
    if (!cardBody) {
      return null;
    }
    if (isCardBodyMarkdown && typeof cardBody === 'string') {
      return <MarkdownContent shouldRetainStyles={shouldRetainStyles} content={cardBody} {...markdownContentProps} />;
    }
    return cardBody;
  };

  return (
    <Card isCompact className="pf-chatbot__tool-response" {...cardProps}>
      <CardBody {...cardBodyProps}>
        <ExpandableSection
          toggleContent={renderToggleContent()}
          onToggle={onToggle}
          isExpanded={isExpanded}
          isIndented
          className="pf-chatbot__tool-response-expandable-section"
          {...expandableSectionProps}
        >
          <div className="pf-chatbot__tool-response-section">
            {subheading && (
              <div className="pf-chatbot__tool-response-subheading">
                <span>{renderSubheading()}</span>
              </div>
            )}
            {body && <div className="pf-chatbot__tool-response-body">{renderBody()}</div>}
            {(cardTitle || cardBody) && (
              <Card isCompact className="pf-chatbot__tool-response-card" {...toolResponseCardProps}>
                {cardTitle && <CardTitle {...toolResponseCardTitleProps}>{renderCardTitle()}</CardTitle>}
                {cardTitle && cardBody && <Divider {...toolResponseCardDividerProps} />}
                {cardBody && <CardBody {...toolResponseCardBodyProps}>{renderCardBody()}</CardBody>}
              </Card>
            )}
          </div>
        </ExpandableSection>
      </CardBody>
    </Card>
  );
};

export default ToolResponse;
