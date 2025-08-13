import { useState, FunctionComponent } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, ListItem } from '@patternfly/react-core';

const initialConversations = [<ListItem key="test">Test</ListItem>];

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isButtonOrderReversed, setIsButtonOrderReversed] = useState(false);
  const [conversations, setConversations] = useState<React.ReactNode[]>(initialConversations);
  const displayMode = ChatbotDisplayMode.embedded;

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isOpen}
        onChange={() => {
          setIsOpen(!isOpen);
          setConversations(initialConversations);
        }}
        id="custom-nodes-drawer-visible"
        name="custom-nodes-drawer-visible"
      />
      <Checkbox
        label="Reverse action buttons"
        isChecked={isButtonOrderReversed}
        onChange={() => setIsButtonOrderReversed(!isButtonOrderReversed)}
        id="custom-nodes-drawer-actions-visible"
        name="custom-nodes-drawer-actions-visible"
      ></Checkbox>
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => setIsOpen(!isOpen)}
        isDrawerOpen={isOpen}
        setIsDrawerOpen={setIsOpen}
        // eslint-disable-next-line no-console
        onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
        conversations={conversations}
        reverseButtonOrder={isButtonOrderReversed}
        drawerContent={<div>Drawer content</div>}
      />
    </>
  );
};
