import { useState, type FunctionComponent } from 'react';
import {
  ActionList,
  ActionListProps,
  ActionListGroup,
  ActionListGroupProps,
  ActionListItem,
  ActionListItemProps,
  Button,
  ButtonProps,
  Card,
  CardProps,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  ExpandableSection,
  ExpandableSectionProps,
  Spinner,
  SpinnerProps
} from '@patternfly/react-core';

export interface ToolCallProps {
  /** Title text for the tool call. */
  titleText: string;
  /** Loading text for the tool call. */
  loadingText?: string;
  /** Flag indicating whether the tool call is loading or not. */
  isLoading?: boolean;
  /** Additional props for the spinner that is rendered when isLoading is true. */
  spinnerProps?: SpinnerProps;
  /** Content to render within an expandable section. */
  expandableContent?: React.ReactNode;
  /** Flag indicating whether the expandable content is expanded by default. */
  isDefaultExpanded?: boolean;
  /** Text content for the "run" action button. */
  runButtonText?: string;
  /** Additional props for the "run" action button. */
  runButtonProps?: ButtonProps;
  /** Additional props for the "run" action list item. */
  runActionItemProps?: ActionListItemProps;
  /** Text content for the "cancel" action button. */
  cancelButtonText?: string;
  /** Additional props for the "cancel" action button. */
  cancelButtonProps?: ButtonProps;
  /** Additional props for the "cancel" action list item. */
  cancelActionItemProps?: ActionListItemProps;
  /** Custom actions to render, typically a "cancel" and "run" action. This will override the default actions. */
  actions?: React.ReactNode[];
  /** Additional props for the action list */
  actionListProps?: ActionListProps;
  /** Additional props for the action list group. */
  actionListGroupProps?: ActionListGroupProps;
  /** Additional props for all action list items. */
  actionListItemProps?: ActionListItemProps;
  /** Additional props for the card. */
  cardProps?: CardProps;
  /** Additional props for the card body that contains the main tool call content. */
  cardBodyProps?: CardBodyProps;
  /** Additional props for the card footer that contains the tool call actions. */
  cardFooterProps?: CardFooterProps;
  /** Additional props for the expandable section when expandableContent is passed. */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
}

export const ToolCall: FunctionComponent<ToolCallProps> = ({
  titleText,
  loadingText,
  isLoading,
  expandableContent,
  isDefaultExpanded = false,
  runButtonText = 'Run tool',
  runButtonProps,
  runActionItemProps,
  cancelButtonText = 'Cancel',
  cancelButtonProps,
  cancelActionItemProps,
  actions,
  actionListProps,
  actionListGroupProps,
  actionListItemProps,
  cardProps,
  cardBodyProps,
  cardFooterProps,
  expandableSectionProps,
  spinnerProps
}: ToolCallProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const titleContent = (
    <span className={`pf-chatbot__tool-call-title-content`}>
      {isLoading ? (
        <>
          <Spinner diameter="1em" {...spinnerProps} />{' '}
          {<span className="pf-chatbot__tool-call-title-text">{loadingText}</span>}
        </>
      ) : (
        <span className="pf-chatbot__tool-call-title-text">{titleText}</span>
      )}
    </span>
  );
  const defaultActions = (
    <>
      <ActionListItem {...actionListItemProps} {...cancelActionItemProps}>
        <Button variant="link" {...cancelButtonProps}>
          {cancelButtonText}
        </Button>
      </ActionListItem>
      <ActionListItem {...actionListItemProps} {...runActionItemProps}>
        <Button variant="secondary" {...runButtonProps}>
          {runButtonText}
        </Button>
      </ActionListItem>
    </>
  );

  const customActions =
    actions &&
    actions.map((action, index) => (
      <ActionListItem key={index} {...actionListItemProps}>
        {action}
      </ActionListItem>
    ));

  return (
    <Card isCompact className="pf-chatbot__tool-call" {...cardProps}>
      <CardBody className="pf-chatbot__tool-call-title" {...cardBodyProps}>
        {expandableContent && !isLoading ? (
          <ExpandableSection
            className="pf-chatbot__tool-call-expandable-section"
            toggleContent={titleContent}
            onToggle={onToggle}
            isExpanded={isExpanded}
            isIndented
            {...expandableSectionProps}
          >
            {expandableContent}
          </ExpandableSection>
        ) : (
          titleContent
        )}
      </CardBody>
      {!isLoading && (
        <CardFooter {...cardFooterProps}>
          <ActionList className="pf-chatbot__tool-call-action-list" {...actionListProps}>
            <ActionListGroup {...actionListGroupProps}>{customActions || defaultActions}</ActionListGroup>
          </ActionList>
        </CardFooter>
      )}
    </Card>
  );
};

export default ToolCall;
