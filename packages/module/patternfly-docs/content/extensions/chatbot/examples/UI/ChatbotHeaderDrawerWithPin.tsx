// Assisted by: Cursor
import React, { FunctionComponent, useState } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, DropdownItem, DropdownList } from '@patternfly/react-core';
import { ThumbtackIcon } from '@patternfly/react-icons';

// Sample conversations
const initialConversations: { [key: string]: Conversation[] } = {
  Today: [
    {
      id: '1',
      text: 'Red Hat products and services',
      label: 'Conversation options for "Red Hat products and services"'
    }
  ],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup',
      label: 'Conversation options for "Enterprise Linux installation and setup"'
    },
    {
      id: '3',
      text: 'Troubleshoot system crash',
      label: 'Conversation options for "Troubleshoot system crash"'
    }
  ],
  March: [
    {
      id: '4',
      text: 'Ansible security and updates',
      label: 'Conversation options for "Ansible security and updates"'
    },
    {
      id: '5',
      text: 'Red Hat certification',
      label: 'Conversation options for "Red Hat certification"'
    },
    {
      id: '6',
      text: 'Lightspeed user documentation',
      label: 'Conversation options for "Lightspeed user documentation"'
    }
  ],
  February: [
    {
      id: '7',
      text: 'Crashing pod assistance',
      label: 'Conversation options for "Crashing pod assistance"'
    },
    {
      id: '8',
      text: 'OpenShift AI pipelines',
      label: 'Conversation options for "OpenShift AI pipelines"'
    },
    {
      id: '9',
      text: 'Updating subscription plan',
      label: 'Conversation options for "Updating subscription plan"'
    },
    {
      id: '10',
      text: 'Red Hat licensing options',
      label: 'Conversation options for "Red Hat licensing options"'
    }
  ],
  January: [
    {
      id: '11',
      text: 'RHEL system performance',
      label: 'Conversation options for "RHEL system performance"'
    },
    {
      id: '12',
      text: 'Manage user accounts',
      label: 'Conversation options for "Manage user accounts"'
    }
  ]
};

export const ChatbotHeaderPinDemo: FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(new Set());
  const displayMode = ChatbotDisplayMode.embedded;

  const handlePinToggle = (conversationId: string) => {
    setPinnedConversations((prev) => {
      const newPinned = new Set(prev);
      if (newPinned.has(conversationId)) {
        newPinned.delete(conversationId);
      } else {
        newPinned.add(conversationId);
      }
      return newPinned;
    });
  };

  const createMenuItems = (conversationId: string) => {
    const isPinned = pinnedConversations.has(conversationId);

    return [
      <DropdownList key={`${conversationId}-menu`} aria-label="Conversation options">
        <DropdownItem
          value={isPinned ? 'Unpin' : 'Pin'}
          id={isPinned ? 'Unpin' : 'Pin'}
          onClick={() => handlePinToggle(conversationId)}
        >
          {isPinned ? 'Unpin' : 'Pin'}
        </DropdownItem>
        <DropdownItem value="Delete" id="Delete">
          Delete
        </DropdownItem>
        <DropdownItem value="Rename" id="Rename">
          Rename
        </DropdownItem>
        <DropdownItem value="Archive" id="Archive">
          Archive
        </DropdownItem>
      </DropdownList>
    ];
  };

  // Reorganize conversations to show pinned ones at the top
  const organizeConversations = () => {
    const organized: { [key: string]: Conversation[] } = {};
    const pinnedItems: Conversation[] = [];

    // Collect all pinned conversations first
    Object.entries(initialConversations).forEach(([_period, conversations]) => {
      conversations.forEach((conv) => {
        if (pinnedConversations.has(conv.id)) {
          pinnedItems.push({
            ...conv,
            menuItems: createMenuItems(conv.id),
            icon: <ThumbtackIcon />
          });
        }
      });
    });

    // Add pinned section if there are pinned items
    if (pinnedItems.length > 0) {
      organized.Pinned = pinnedItems;
    }

    // Add unpinned conversations
    Object.entries(initialConversations).forEach(([period, conversations]) => {
      const unpinnedConversations = conversations
        .filter((conv) => !pinnedConversations.has(conv.id))
        .map((conv) => ({
          ...conv,
          menuItems: createMenuItems(conv.id)
        }));

      if (unpinnedConversations.length > 0) {
        organized[period] = unpinnedConversations;
      }
    });

    return organized;
  };

  const conversations = organizeConversations();

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        id="drawer-pin-visible"
        name="drawer-pin-visible"
      ></Checkbox>
      <Checkbox
        label="Show compact version"
        isChecked={isCompact}
        onChange={() => setIsCompact(!isCompact)}
        id="drawer-pin-compact"
        name="drawer-pin-compact"
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
