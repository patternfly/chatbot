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

export interface ToolResponseProps {
  /** Toggle content shown for expandable section */
  toggleContent: React.ReactNode;
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
  toolResponseCardBodyProps,
  toolResponseCardDividerProps,
  toolResponseCardProps,
  toolResponseCardTitleProps
}: ToolResponseProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <Card isCompact className="pf-chatbot__tool-response" {...cardProps}>
      <CardBody {...cardBodyProps}>
        <ExpandableSection
          toggleContent={toggleContent}
          onToggle={onToggle}
          isExpanded={isExpanded}
          isIndented
          className="pf-chatbot__tool-response-expandable-section"
          {...expandableSectionProps}
        >
          <div className="pf-chatbot__tool-response-section">
            {subheading && (
              <div className="pf-chatbot__tool-response-subheading">
                <span>{subheading}</span>
              </div>
            )}
            {body && <div className="pf-chatbot__tool-response-body">{body}</div>}
            {(cardTitle || cardBody) && (
              <Card isCompact className="pf-chatbot__tool-response-card" {...toolResponseCardProps}>
                {cardTitle && <CardTitle {...toolResponseCardTitleProps}>{cardTitle}</CardTitle>}
                {cardTitle && cardBody && <Divider {...toolResponseCardDividerProps} />}
                {cardBody && <CardBody {...toolResponseCardBodyProps}>{cardBody}</CardBody>}
              </Card>
            )}
          </div>
        </ExpandableSection>
      </CardBody>
    </Card>
  );
};

export default ToolResponse;
