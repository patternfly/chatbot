import { useState, FunctionComponent } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation,
  ConversationGroup
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, MenuItem } from '@patternfly/react-core';

const pinnedChats: Conversation[] = [
  {
    id: '1',
    text: 'Red Hat products and services'
  }
];

const recentChats: Conversation[] = [
  {
    id: '2',
    text: 'Enterprise Linux installation and setup'
  },
  {
    id: '3',
    text: 'Troubleshoot system crash'
  },
  {
    id: '4',
    text: 'Ansible security and updates'
  },
  {
    id: '5',
    text: 'Red Hat certification'
  },
  {
    id: '6',
    text: 'Lightspeed user documentation'
  }
];

const savedPrompts: Conversation[] = [
  {
    id: '7',
    text: 'Summarize this document'
  },
  {
    id: '8',
    text: 'Draft a release announcement'
  }
];

const VISIBLE_CHAT_COUNT = 3;

export const ChatbotHeaderDrawerWithCollapsibleGroupsDemo: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSavedPromptsExpanded, setIsSavedPromptsExpanded] = useState(false);
  const [isShowingAllChats, setIsShowingAllChats] = useState(false);

  const visibleChats = isShowingAllChats ? recentChats : recentChats.slice(0, VISIBLE_CHAT_COUNT);
  const hiddenChatCount = recentChats.length - VISIBLE_CHAT_COUNT;

  const renderExpandButton = () => {
    if (isShowingAllChats) {
      return [
        <MenuItem
          key="show-some-chats"
          itemId="show-some-chats"
          className="pf-chatbot__menu-item pf-chatbot__menu-item--show-button"
          onClick={() => setIsShowingAllChats(false)}
        >
          Show less
        </MenuItem>
      ];
    }
    if (hiddenChatCount > 0 && !isShowingAllChats) {
      return [
        <MenuItem
          key="show-all-chats"
          itemId="show-all-chats"
          className="pf-chatbot__menu-item pf-chatbot__menu-item--show-button"
          onClick={() => setIsShowingAllChats(true)}
        >
          {`Show all (${recentChats.length})`}
        </MenuItem>
      ];
    }
    return [];
  };

  const conversations: ConversationGroup[] = [
    {
      id: 'pinned',
      label: 'Pinned chats',
      items: pinnedChats
    },
    {
      id: 'chats',
      label: 'Chats',
      items: [...visibleChats, ...renderExpandButton()]
    },
    {
      id: 'saved-prompts',
      label: 'Saved prompts',
      collapsible: {
        isExpanded: isSavedPromptsExpanded,
        onToggle: setIsSavedPromptsExpanded
      },
      items: savedPrompts
    }
  ];

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
        id="collapsible-groups-drawer-visible"
        name="collapsible-groups-drawer-visible"
      />
      <ChatbotConversationHistoryNav
        displayMode={ChatbotDisplayMode.embedded}
        onDrawerToggle={() => setIsOpen(!isOpen)}
        isDrawerOpen={isOpen}
        setIsDrawerOpen={setIsOpen}
        conversations={conversations}
        drawerContent={<div>Drawer content</div>}
      />
    </>
  );
};
