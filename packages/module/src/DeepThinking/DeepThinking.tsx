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
}

export const DeepThinking: FunctionComponent<DeepThinkingProps> = ({
  body,
  cardProps,
  expandableSectionProps,
  subheading,
  toggleContent,
  isDefaultExpanded = true,
  cardBodyProps
}: DeepThinkingProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <Card isCompact className="pf-chatbot__deep-thinking" {...cardProps}>
      <CardBody {...cardBodyProps}>
        <ExpandableSection
          toggleContent={toggleContent}
          onToggle={onToggle}
          isExpanded={isExpanded}
          isIndented
          className="pf-chatbot__deep-thinking-expandable-section"
          {...expandableSectionProps}
        >
          <div className="pf-chatbot__deep-thinking-section">
            {subheading && (
              <div className="pf-chatbot__deep-thinking-subheading">
                <span>{subheading}</span>
              </div>
            )}
            {body && <div className="pf-chatbot__deep-thinking-body">{body}</div>}
          </div>
        </ExpandableSection>
      </CardBody>
    </Card>
  );
};

export default DeepThinking;
