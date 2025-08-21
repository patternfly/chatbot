// ============================================================================
// Terms of Use Modal - Chatbot Modal Extension
// ============================================================================
import {
  Card,
  CardBody,
  CardProps,
  CardTitle,
  Divider,
  ExpandableSection,
  ExpandableSectionProps
} from '@patternfly/react-core';
import { useState, type FunctionComponent } from 'react';

export interface ToolResponseProps {
  /** Body text rendered inside expandable section */
  body?: React.ReactNode | string;
  /** Additional props passed to card */
  cardProps?: CardProps;
  /** Toggle text shown on expandable section when it is collapsed */
  collapsedToggleText: string;
  /** Additional props passed to expandable section */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Toggle text shown on expandable section when it is expanded */
  expandedToggleText: string;
  /** Subheading rendered inside expandable section */
  subheading?: string;
  cardBody?: React.ReactNode;
  cardTitle?: React.ReactNode;
}

export const ToolResponse: FunctionComponent<ToolResponseProps> = ({
  body,
  cardProps,
  collapsedToggleText,
  expandableSectionProps,
  expandedToggleText,
  subheading,
  cardBody,
  cardTitle
}: ToolResponseProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <Card {...cardProps}>
      <CardBody>
        <ExpandableSection
          toggleText={isExpanded ? expandedToggleText : collapsedToggleText}
          onToggle={onToggle}
          isExpanded={isExpanded}
          isIndented
          {...expandableSectionProps}
        >
          {subheading && <span>{subheading}</span>}
          {body}
          <Card ouiaId="CardWithDividers">
            <CardTitle>{cardTitle}</CardTitle>
            <Divider />
            <CardBody>{cardBody}</CardBody>
          </Card>
        </ExpandableSection>
      </CardBody>
    </Card>
  );
};

export default ToolResponse;
