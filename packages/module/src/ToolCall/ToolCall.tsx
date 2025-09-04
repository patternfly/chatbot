import { type FunctionComponent } from 'react';
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
  CardTitle,
  CardTitleProps,
  ExpandableSection,
  ExpandableSectionProps,
  Spinner,
  SpinnerProps
} from '@patternfly/react-core';

export interface ToolCallProps {
  /** Title text for the tool call */
  titleText: string;
  /** Loading text for the tool call */
  loadingText?: string;
  /** Flag indicating whether the tool call is loading or not. */
  isLoading?: boolean;
  /** Additional props for the spinner that is rendered when isLoading is true. */
  spinnerProps?: SpinnerProps;
  /** Content to render within an expandable section. */
  expandableContent?: React.ReactNode;
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
  /** Additional props for the action list group */
  actionListGroupProps?: ActionListGroupProps;
  /** Additional props for all action list items */
  actionListItemProps?: ActionListItemProps;
  /** Additional props for the card */
  cardProps?: CardProps;
  /** Additional props for the card body */
  cardBodyProps?: CardBodyProps;
  /** Additional props for the card title */
  cardTitleProps?: CardTitleProps;
  /** Additional props for the expandable section */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
}

export const ToolCall: FunctionComponent<ToolCallProps> = ({
  titleText,
  loadingText,
  isLoading,
  expandableContent,
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
  cardTitleProps,
  expandableSectionProps,
  spinnerProps
}: ToolCallProps) => {
  const titleContent = (
    <span className={`pf-chatbot__tool-call-title-content`}>
      {isLoading ? (
        <>
          <Spinner diameter="1em" {...spinnerProps} /> {loadingText}
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
      <CardTitle className="pf-chatbot__tool-call-title" {...cardTitleProps}>
        {expandableContent ? (
          <ExpandableSection
            className="pf-chatbot__tool-call-expandable-section"
            toggleContent={titleContent}
            isIndented
            {...expandableSectionProps}
          >
            {expandableContent}
          </ExpandableSection>
        ) : (
          titleContent
        )}
      </CardTitle>
      {!isLoading && (
        <CardBody {...cardBodyProps}>
          <ActionList className="pf-chatbot__tool-call-action-list" {...actionListProps}>
            <ActionListGroup {...actionListGroupProps}>{customActions || defaultActions}</ActionListGroup>
          </ActionList>
        </CardBody>
      )}
    </Card>
  );
};

export default ToolCall;
