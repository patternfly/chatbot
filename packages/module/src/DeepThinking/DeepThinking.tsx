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
  /** Toggle text shown on expandable section when it is collapsed */
  collapsedToggleText: string;
  /** Toggle text shown on expandable section when it is expanded */
  expandedToggleText: string;
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
  collapsedToggleText,
  expandableSectionProps,
  expandedToggleText,
  subheading,
  cardBodyProps
}: DeepThinkingProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <Card isCompact className="pf-chatbot__deep-thinking" {...cardProps}>
      <CardBody {...cardBodyProps}>
        <ExpandableSection
          toggleText={isExpanded ? expandedToggleText : collapsedToggleText}
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
