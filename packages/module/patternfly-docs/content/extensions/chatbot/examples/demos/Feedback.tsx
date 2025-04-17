import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

export const MessageWithFeedbackExample: React.FunctionComponent = () => {
  const [showUserFeedbackForm, setShowUserFeedbackForm] = React.useState(false);
  const [showCompletionForm, setShowCompletionForm] = React.useState(false);
  const [launchButton, setLaunchButton] = React.useState<string>();
  const positiveRef = React.useRef<HTMLButtonElement>(null);
  const negativeRef = React.useRef<HTMLButtonElement>(null);
  const feedbackId = 'user-feedback-form';
  const completeId = 'user-feedback-received';

  const getCurrentCard = () => {
    if (showUserFeedbackForm) {
      return feedbackId;
    }
    if (showCompletionForm) {
      return completeId;
    }
  };

  const isExpanded = showUserFeedbackForm || showCompletionForm;

  const focusLaunchButton = () => {
    if (launchButton === 'positive') {
      positiveRef.current?.focus();
    }
    if (launchButton === 'negative') {
      negativeRef.current?.focus();
    }
  };

  return (
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="Bot message with user feedback flow; click on a message action to launch the feedback flow. Click submit to see the thank-you message."
      actions={{
        positive: {
          onClick: () => {
            setShowUserFeedbackForm(true);
            setShowCompletionForm(false);
            setLaunchButton('positive');
          },
          /* These are important for accessibility */
          'aria-expanded': isExpanded,
          'aria-controls': getCurrentCard(),
          ref: positiveRef
        },
        negative: {
          onClick: () => {
            setShowUserFeedbackForm(true);
            setShowCompletionForm(false);
            setLaunchButton('negative');
          },
          /* These are important for accessibility */
          'aria-expanded': isExpanded,
          'aria-controls': getCurrentCard(),
          ref: negativeRef
        }
      }}
      userFeedbackForm={
        showUserFeedbackForm
          ? /* eslint-disable indent */
            {
              quickResponses: [
                { id: '1', content: 'Helpful information' },
                { id: '2', content: 'Easy to understand' },
                { id: '3', content: 'Resolved my issue' }
              ],
              onSubmit: (quickResponse, additionalFeedback) => {
                alert(`Selected ${quickResponse} and received the additional feedback: ${additionalFeedback}`);
                setShowUserFeedbackForm(false);
                setShowCompletionForm(true);
                focusLaunchButton();
              },
              hasTextArea: true,
              onClose: () => {
                setShowUserFeedbackForm(false);
                focusLaunchButton();
              },
              id: feedbackId
            }
          : undefined
        /* eslint-enable indent */
      }
      userFeedbackComplete={
        showCompletionForm
          ? /* eslint-disable indent */
            {
              onClose: () => {
                setShowCompletionForm(false);
                focusLaunchButton();
              },
              id: completeId
            }
          : undefined
        /* eslint-enable indent */
      }
    />
  );
};
