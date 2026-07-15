import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import { RhMicronsInformationFillIcon, RhUiRedoIcon } from '@patternfly/react-icons';

export const CustomActionExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    content="I updated your account with those settings. You're ready to set up your first dashboard!"
    actions={{
      regenerate: {
        ariaLabel: 'Regenerate',
        clickedAriaLabel: 'Regenerated',
        isClicked: true,
        // eslint-disable-next-line no-console
        onClick: () => console.log('Clicked regenerate'),
        tooltipContent: 'Regenerate',
        clickedTooltipContent: 'Regenerated',
        icon: <RhUiRedoIcon />
      },
      info: {
        ariaLabel: 'Info',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Clicked info'),
        tooltipContent: 'Info',
        icon: <RhMicronsInformationFillIcon />
      }
    }}
  />
);
