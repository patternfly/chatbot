import { FunctionComponent, useState } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, DropdownItem, DropdownList } from '@patternfly/react-core';

const generateMenuItems = (id: string) => [
  <DropdownList key={`header-drawer-with-actions-example-conversation-${id}-dropdown`}>
    <DropdownItem value="Download" id="Download">
      Download
    </DropdownItem>
    <DropdownItem value="Rename" id="Rename">
      Rename
    </DropdownItem>
    <DropdownItem value="Archive" id="Archive">
      Archive
    </DropdownItem>
    <DropdownItem value="Delete" id="Delete">
      Delete
    </DropdownItem>
  </DropdownList>
];

const conversations: { [key: string]: Conversation[] } = {
  Today: [{ id: '1', text: 'Red Hat products and services', menuItems: generateMenuItems('1') }],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup',
      menuItems: generateMenuItems('2')
    },
    { id: '3', text: 'Troubleshoot system crash', menuItems: generateMenuItems('3') }
  ],
  March: [
    { id: '4', text: 'Ansible security and updates', menuItems: generateMenuItems('4') },
    { id: '5', text: 'Red Hat certification', menuItems: generateMenuItems('5') },
    { id: '6', text: 'Lightspeed user documentation', menuItems: generateMenuItems('6') }
  ],
  February: [
    { id: '7', text: 'Crashing pod assistance', menuItems: generateMenuItems('7') },
    { id: '8', text: 'OpenShift AI pipelines', menuItems: generateMenuItems('8') },
    { id: '9', text: 'Updating subscription plan', menuItems: generateMenuItems('9') },
    { id: '10', text: 'Red Hat licensing options', menuItems: generateMenuItems('10') }
  ],
  January: [
    { id: '11', text: 'RHEL system performance', menuItems: generateMenuItems('11') },
    { id: '12', text: 'Manage user accounts', menuItems: generateMenuItems('12') }
  ]
};

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const displayMode = ChatbotDisplayMode.embedded;

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        id="drawer-actions-visible"
        name="drawer-actions-visible"
      ></Checkbox>
      <Checkbox
        label="Show compact version"
        isChecked={isCompact}
        onChange={() => setIsCompact(!isCompact)}
        id="drawer-actions-compact"
        name="drawer-actions-compact"
      ></Checkbox>
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        conversations={conversations}
        drawerContent={<div>Drawer content</div>}
        isCompact={isCompact}
      />
    </>
  );
};
