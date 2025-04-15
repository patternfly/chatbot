import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { Checkbox, FormGroup, Stack } from '@patternfly/react-core';

export const MessageWithFeedbackExample: React.FunctionComponent = () => {
  const [hasCloseButton, setHasCloseButton] = React.useState(false);
  const [hasTextArea, setHasTextArea] = React.useState(false);

  return (
    <>
      <Stack hasGutter>
        <FormGroup role="radiogroup" isInline fieldId="feedback-card" label="Variant">
          <Checkbox
            isChecked={hasTextArea}
            onChange={() => {
              setHasTextArea(!hasTextArea);
            }}
            name="basic-inline-radio"
            label="Has text area"
            id="has-text-area"
          />
        </FormGroup>
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This is a message with the feedback card:"
          userFeedbackForm={{
            quickResponses: [
              { id: '1', content: 'Helpful information' },
              { id: '2', content: 'Easy to understand' },
              { id: '3', content: 'Resolved my issue' }
            ],
            onSubmit: (quickResponse, additionalFeedback) =>
              alert(`Selected ${quickResponse} and received the additional feedback: ${additionalFeedback}`),
            hasTextArea,
            // eslint-disable-next-line no-console
            onClose: () => console.log('closed feedback form'),
            focusOnLoad: false
          }}
        />
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This is a compact message with the feedback card:"
          userFeedbackForm={{
            quickResponses: [
              { id: '1', content: 'Helpful information' },
              { id: '2', content: 'Easy to understand' },
              { id: '3', content: 'Resolved my issue' }
            ],
            onSubmit: (quickResponse, additionalFeedback) =>
              alert(`Selected ${quickResponse} and received the additional feedback: ${additionalFeedback}`),
            hasTextArea,
            // eslint-disable-next-line no-console
            onClose: () => console.log('closed feedback form'),
            focusOnLoad: false
          }}
          isCompact
        />
      </Stack>
      <Stack hasGutter>
        <FormGroup role="radiogroup" isInline fieldId="feedback-thank-you" label="Variant">
          <Checkbox
            isChecked={hasCloseButton}
            onChange={() => {
              setHasCloseButton(!hasCloseButton);
            }}
            name="basic-inline-radio"
            label="Has close button"
            id="has-close"
          />
        </FormGroup>
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This is a thank-you message, which is displayed once the feedback card is submitted:"
          // eslint-disable-next-line no-console
          userFeedbackComplete={{
            // eslint-disable-next-line no-console
            onClose: hasCloseButton ? () => console.log('closed completion message') : undefined,
            focusOnLoad: false
          }}
        />
        <Message
          name="Bot"
          role="bot"
          avatar={patternflyAvatar}
          content="This is a compact thank-you message, which is displayed once the feedback card is submitted:"
          // eslint-disable-next-line no-console
          userFeedbackComplete={{
            // eslint-disable-next-line no-console
            onClose: hasCloseButton ? () => console.log('closed completion message') : undefined,
            focusOnLoad: false
          }}
          isCompact
        />
      </Stack>
    </>
  );
};
