import { FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';

export const CustomActionExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
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
        icon: <RedoIcon />
      },
      info: {
        ariaLabel: 'Info',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Clicked info'),
        tooltipContent: 'Info',
        icon: <InfoCircleIcon />
      }
    }}
  />
);
