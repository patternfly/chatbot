import { useState, FunctionComponent } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation,
  ConversationGroup
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox } from '@patternfly/react-core';

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

export const ChatbotHeaderDrawerWithExpandableGroupsDemo: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSavedPromptsExpanded, setIsSavedPromptsExpanded] = useState(false);
  const [isShowingAllChats, setIsShowingAllChats] = useState(false);

  const conversations: ConversationGroup[] = [
    {
      id: 'pinned',
      label: 'Pinned chats',
      items: pinnedChats
    },
    {
      id: 'chats',
      label: 'Chats',
      items: recentChats,
      showAll: {
        visibleCount: VISIBLE_CHAT_COUNT,
        isExpanded: isShowingAllChats,
        onToggle: setIsShowingAllChats,
        label: isShowingAllChats ? 'Show less' : 'Show all'
      }
    },
    {
      id: 'saved-prompts',
      label: 'Saved prompts',
      expandable: {
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
        id="expandable-groups-drawer-visible"
        name="expandable-groups-drawer-visible"
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
