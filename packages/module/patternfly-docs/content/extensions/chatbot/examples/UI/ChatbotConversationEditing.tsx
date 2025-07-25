// From Cursor, with aid
import { FunctionComponent, useState, useRef } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, DropdownItem, DropdownList } from '@patternfly/react-core';

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const displayMode = ChatbotDisplayMode.embedded;

  const originalTextRef = useRef({});

  const onRenameClick = (itemId: string | number) => {
    setConversations((prevConversations) => {
      const newConversations = { ...prevConversations };
      Object.keys(newConversations).forEach((groupKey) => {
        newConversations[groupKey] = newConversations[groupKey].map((conv) => {
          if (conv.id === itemId) {
            originalTextRef.current[conv.id] = conv.text;
            return { ...conv, isEditing: true };
          }
          return conv;
        });
      });
      return newConversations;
    });

    setTimeout(() => {
      const input = document.getElementById(`conversation-${itemId}-input`);
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const handleInputChange = (itemId: string | number, event: React.FormEvent<HTMLInputElement>, value: string) => {
    setConversations((prevConversations) => {
      const newConversations = { ...prevConversations };
      Object.keys(newConversations).forEach((groupKey) => {
        newConversations[groupKey] = newConversations[groupKey].map((conv) =>
          conv.id === itemId ? { ...conv, text: value } : conv
        );
      });
      return newConversations;
    });
  };

  const handleInputBlur = (itemId: string | number, event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setConversations((prevConversations) => {
      const newConversations = { ...prevConversations };
      Object.keys(newConversations).forEach((groupKey) => {
        newConversations[groupKey] = newConversations[groupKey].map((conv) =>
          conv.id === itemId ? { ...conv, text: newValue, isEditing: false } : conv
        );
      });
      return newConversations;
    });

    delete originalTextRef.current[itemId];
  };

  const handleInputKeyDown = (itemId: string | number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newValue = event.currentTarget.value;
      setConversations((prevConversations) => {
        const newConversations = { ...prevConversations };
        Object.keys(newConversations).forEach((groupKey) => {
          newConversations[groupKey] = newConversations[groupKey].map((conv) =>
            conv.id === itemId ? { ...conv, text: newValue, isEditing: false } : conv
          );
        });
        return newConversations;
      });
      // Clean up the stored original text
      delete originalTextRef.current[itemId];
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      // Revert to the original text
      const originalText = originalTextRef.current[itemId] || '';
      setConversations((prevConversations) => {
        const newConversations = { ...prevConversations };
        Object.keys(newConversations).forEach((groupKey) => {
          newConversations[groupKey] = newConversations[groupKey].map((conv) =>
            conv.id === itemId ? { ...conv, text: originalText, isEditing: false } : conv
          );
        });
        return newConversations;
      });
      // Clean up the stored original text
      delete originalTextRef.current[itemId];
    }
  };

  const renderMenuItems = (itemId: string | number) => [
    <DropdownList key="list-1">
      <DropdownItem value="Download" id="Download">
        Download
      </DropdownItem>
      <DropdownItem value="Rename" id="Rename" onClick={() => onRenameClick(itemId)}>
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

  const initialConversations: { [key: string]: Conversation[] } = {
    Today: [{ id: '1', text: 'Red Hat products and services', menuItems: renderMenuItems('1'), isEditing: false }],
    'This month': [
      {
        id: '2',
        text: 'Enterprise Linux installation and setup',
        menuItems: renderMenuItems('2'),
        isEditing: false
      },
      { id: '3', text: 'Troubleshoot system crash', menuItems: renderMenuItems('3'), isEditing: false }
    ],
    March: [
      { id: '4', text: 'Ansible security and updates', menuItems: renderMenuItems('4'), isEditing: false },
      { id: '5', text: 'Red Hat certification', menuItems: renderMenuItems('5'), isEditing: false },
      { id: '6', text: 'Lightspeed user documentation', menuItems: renderMenuItems('6'), isEditing: false }
    ],
    February: [
      { id: '7', text: 'Crashing pod assistance', menuItems: renderMenuItems('7'), isEditing: false },
      { id: '8', text: 'OpenShift AI pipelines', menuItems: renderMenuItems('8'), isEditing: false },
      { id: '9', text: 'Updating subscription plan', menuItems: renderMenuItems('9'), isEditing: false },
      { id: '10', text: 'Red Hat licensing options', menuItems: renderMenuItems('10'), isEditing: false }
    ],
    January: [
      { id: '11', text: 'RHEL system performance', menuItems: renderMenuItems('11'), isEditing: false },
      { id: '12', text: 'Manage user accounts', menuItems: renderMenuItems('12'), isEditing: false }
    ]
  };

  const [conversations, setConversations] = useState(initialConversations);

  const createConversationItems = () => {
    const newConversations = { ...conversations };

    Object.keys(newConversations).forEach((groupKey) => {
      newConversations[groupKey] = newConversations[groupKey].map((conv) => ({
        ...conv,
        inputAriaLabel: `Edit conversation name: ${originalTextRef.current[conv.id] ?? conv.text}`,
        onChange: (event: React.FormEvent<HTMLInputElement>, value: string) => handleInputChange(conv.id, event, value),
        onBlur: (event: React.FocusEvent<HTMLInputElement>) => handleInputBlur(conv.id, event),
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => handleInputKeyDown(conv.id, event)
      }));
    });

    return newConversations;
  };

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        id="drawer-actions-visible"
        name="drawer-actions-visible"
      ></Checkbox>
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        conversations={createConversationItems()}
        drawerContent={<div>Drawer content</div>}
      />
    </>
  );
};
