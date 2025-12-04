import { useState, FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { Checkbox, FormGroup, Flex, FlexItem } from '@patternfly/react-core';

export const MessageWithFeedbackExample: FunctionComponent = () => {
  const [hasCloseButton, setHasCloseButton] = useState(false);
  const [hasTextArea, setHasTextArea] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPrivacyStatement, setHasPrivacyStatement] = useState(false);

  const children = <>This is additional content.</>;
  const privacyStatement = 'Do not share any personal or other sensitive information in your feedback.';

  return (
    <>
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
        <FlexItem>
          <FormGroup role="radiogroup" isInline isStack fieldId="feedback-card" label="Variant">
            <Checkbox
              isChecked={hasTextArea}
              onChange={() => {
                setHasTextArea(!hasTextArea);
              }}
              name="feedback-card-with-text-area"
              label="Has text area"
              id="has-text-area"
            />
            <Checkbox
              isChecked={hasChildren}
              onChange={() => {
                setHasChildren(!hasChildren);
              }}
              name="feedback-card-with-children"
              label="Has additional content"
              id="has-children"
            />
            <Checkbox
              isChecked={hasPrivacyStatement}
              onChange={() => {
                setHasPrivacyStatement(!hasPrivacyStatement);
              }}
              name="feedback-card-with-privacy"
              label="Has privacy statement"
              id="has-privacy"
            />
          </FormGroup>
        </FlexItem>
        <FlexItem>
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
              children: hasChildren ? children : undefined,
              privacyStatement: hasPrivacyStatement ? privacyStatement : undefined,
              // eslint-disable-next-line no-console
              onClose: () => console.log('closed feedback form'),
              focusOnLoad: false
            }}
          />
        </FlexItem>
        <FlexItem>
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
              children: hasChildren ? children : undefined,
              privacyStatement: hasPrivacyStatement ? privacyStatement : undefined,
              // eslint-disable-next-line no-console
              onClose: () => console.log('closed feedback form'),
              focusOnLoad: false
            }}
            isCompact
          />
        </FlexItem>
      </Flex>
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
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
        </FlexItem>
        <FlexItem>
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
        </FlexItem>
        <FlexItem>
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
        </FlexItem>
      </Flex>
    </>
  );
};
