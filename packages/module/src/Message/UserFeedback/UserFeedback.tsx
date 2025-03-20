// ============================================================================
// Chatbot Main - Messages - Feedback Card
// ============================================================================
import React from 'react';

// Import PatternFly components
import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Form,
  LabelGroupProps,
  OUIAProps,
  TextArea
} from '@patternfly/react-core';
import QuickResponse from '../QuickResponse/QuickResponse';
import CloseButton from './CloseButton';

export interface UserFeedbackProps extends Omit<CardProps, 'onSubmit'>, OUIAProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** Quick responses a user can select */
  quickResponses?: QuickResponse[];
  /** Props for quick responses container */
  quickResponseContainerProps?: Omit<LabelGroupProps, 'ref'>;
  /** Whether form includes text area */
  hasTextArea?: boolean;
  /** Placeholder of text area */
  textAreaPlaceholder?: string;
  /** Aria label for text area */
  textAreaAriaLabel?: string;
  /** Callback function for when text area changes */
  onTextAreaChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: string) => void;
  /** Callback function for when form is submitted */
  onSubmit: (selectedResponse?: string, additionalFeedback?: string) => void;
  /** Callback function for when close button is clicked */
  onClose: () => void;
  /** Aria label for close button */
  closeButtonAriaLabel?: string;
  /** Label for the English word "Submit." */
  submitWord?: string;
  /** @deprecated Cancel button has been deprecated. Use the close button instead. Label for the English word "Cancel." */
  cancelWord?: string;
  /** Uniquely identifies the card. */
  id?: string;
  /** The heading level to use, default is h1 */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Whether to focus card on load */
  focusOnLoad?: boolean;
  /** Timestamp passed in by Message for more context in aria announcements */
  timestamp?: string;
}

const UserFeedback: React.FunctionComponent<UserFeedbackProps> = ({
  className,
  timestamp,
  title = 'Why did you choose this rating?',
  hasTextArea,
  textAreaAriaLabel = `Provide optional additional feedback for message received at ${timestamp}`,
  textAreaPlaceholder = 'Provide optional additional feedback',
  onTextAreaChange,
  submitWord = 'Submit',
  quickResponses,
  quickResponseContainerProps = { 'aria-label': `Quick feedback for message received at ${timestamp}` },
  onSubmit,
  onClose,
  closeButtonAriaLabel = `Close feedback for message received at ${timestamp}`,
  id,
  headingLevel: HeadingLevel = 'h1',
  focusOnLoad = true,
  ...props
}: UserFeedbackProps) => {
  const [selectedResponse, setSelectedResponse] = React.useState<string>();
  const [value, setValue] = React.useState('');
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (focusOnLoad) {
      divRef.current?.focus();
    }
  });

  return (
    /* card does not have ref forwarding; hence wrapper div */
    <div ref={divRef} id={id} tabIndex={0} aria-label={title}>
      <Card className={`pf-chatbot__feedback-card ${className ? className : ''}`} {...props}>
        <CardHeader
          actions={{
            actions: <CloseButton onClose={onClose} ariaLabel={closeButtonAriaLabel} />
          }}
        >
          <HeadingLevel className="pf-chatbot__feedback-card-title">{title}</HeadingLevel>
        </CardHeader>
        <CardBody>
          <Form className="pf-chatbot__feedback-card-form">
            {quickResponses && (
              <QuickResponse
                quickResponses={quickResponses}
                quickResponseContainerProps={quickResponseContainerProps}
                onSelect={(id) => setSelectedResponse(id)}
              />
            )}
            {hasTextArea && (
              <TextArea
                value={value}
                onChange={(_event, value) => {
                  setValue(value);
                  onTextAreaChange && onTextAreaChange(_event, value);
                }}
                placeholder={textAreaPlaceholder}
                aria-label={textAreaAriaLabel}
                resizeOrientation="vertical"
              />
            )}
            <ActionGroup>
              <Button onClick={() => onSubmit(selectedResponse, value)}>{submitWord}</Button>
            </ActionGroup>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserFeedback;
