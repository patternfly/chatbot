// From Cursor, with aid
import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import {
  Checkbox,
  DropdownItem,
  DropdownList,
  Modal,
  ModalVariant,
  Button,
  TextInput,
  Form,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@patternfly/react-core';

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const displayMode = ChatbotDisplayMode.embedded;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConversationId, setEditingConversationId] = useState<string | number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [originalText, setOriginalText] = useState('');

  // Ref for the text input
  const textInputRef = useRef<HTMLInputElement>(null);

  // Focus the text input when modal opens
  useEffect(() => {
    if (isModalOpen && textInputRef.current) {
      textInputRef.current.focus();
      // Move cursor to the end of the text
      const length = textInputRef.current.value.length;
      textInputRef.current.setSelectionRange(length, length);
    }
  }, [isModalOpen]);

  const findConversationAndGroup = (conversations: { [key: string]: Conversation[] }, itemId: string | number) => {
    for (const [groupKey, conversationList] of Object.entries(conversations)) {
      const conversationIndex = conversationList.findIndex((conv) => conv.id === itemId);
      if (conversationIndex !== -1) {
        return { groupKey, conversationIndex, conversation: conversationList[conversationIndex] };
      }
    }
    return null;
  };

  const onRenameClick = (itemId: string | number) => {
    const result = findConversationAndGroup(conversations, itemId);
    if (result) {
      setEditingConversationId(itemId);
      setEditingText(result.conversation.text);
      setOriginalText(result.conversation.text);
      setIsModalOpen(true);
    }
  };

  const handleModalSave = () => {
    if (editingConversationId) {
      setConversations((prevConversations) => {
        const result = findConversationAndGroup(prevConversations, editingConversationId);
        if (!result) {
          return prevConversations;
        }

        const { groupKey, conversationIndex } = result;
        const newConversations = { ...prevConversations };
        const newGroup = [...newConversations[groupKey]];

        newGroup[conversationIndex] = { ...newGroup[conversationIndex], text: editingText };
        newConversations[groupKey] = newGroup;

        return newConversations;
      });
    }
    handleModalClose();
  };

  const handleModalCancel = () => {
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingConversationId(null);
    setEditingText('');
    setOriginalText('');
  };

  const handleTextInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleModalSave();
    }
  };

  const renderMenuItems = (itemId: string | number) => [
    <DropdownList key={`list-${itemId}`}>
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
    Today: [{ id: '1', text: 'Red Hat products and services' }],
    'This month': [
      {
        id: '2',
        text: 'Enterprise Linux installation and setup'
      },
      { id: '3', text: 'Troubleshoot system crash' }
    ],
    March: [
      { id: '4', text: 'Ansible security and updates' },
      { id: '5', text: 'Red Hat certification' },
      { id: '6', text: 'Lightspeed user documentation' }
    ],
    February: [
      { id: '7', text: 'Crashing pod assistance' },
      { id: '8', text: 'OpenShift AI pipelines' },
      { id: '9', text: 'Updating subscription plan' },
      { id: '10', text: 'Red Hat licensing options' }
    ],
    January: [
      { id: '11', text: 'RHEL system performance' },
      { id: '12', text: 'Manage user accounts' }
    ]
  };

  const [conversations, setConversations] = useState(initialConversations);

  // Create conversations with menu items dynamically
  const conversationsWithMenuItems = () => {
    const newConversations = { ...conversations };
    Object.keys(newConversations).forEach((groupKey) => {
      newConversations[groupKey] = newConversations[groupKey].map((conv) => ({
        ...conv,
        menuItems: renderMenuItems(conv.id)
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
        conversations={conversationsWithMenuItems()}
        drawerContent={<div>Drawer content</div>}
      />

      <Modal variant={ModalVariant.small} isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalHeader title="Rename Conversation" />
        <ModalBody>
          <Form>
            <FormGroup label="Conversation Name" fieldId="conversation-name" isRequired>
              <TextInput
                isRequired
                ref={textInputRef}
                value={editingText}
                onChange={(_, value) => setEditingText(value)}
                onKeyDown={handleTextInputKeyDown}
                id="conversation-name"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button key="save" variant="primary" onClick={handleModalSave}>
            Save
          </Button>
          <Button key="cancel" variant="link" onClick={handleModalCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
