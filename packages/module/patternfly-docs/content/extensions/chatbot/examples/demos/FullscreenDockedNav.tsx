import { FunctionComponent, useState } from 'react';
import { Avatar, Brand, Divider, Flex, Nav, NavItem, NavList } from '@patternfly/react-core';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { RhUiEditFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import { RhUiSettingsFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import userAvatar from '../Messages/user_avatar.svg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Show me how a fullscreen chatbot can use docked navigation.',
    name: 'You',
    avatar: userAvatar,
    timestamp: new Date().toLocaleString(),
    avatarProps: { isBordered: true }
  },
  {
    id: '2',
    role: 'bot',
    content: 'Use the rail on the left to switch between the conversation, history, and a new chat.',
    name: 'Bot',
    timestamp: new Date().toLocaleString()
  }
];

const welcomePrompts = [
  {
    title: 'Topic 1',
    message: 'Helpful prompt for Topic 1'
  },
  {
    title: 'Topic 2',
    message: 'Helpful prompt for Topic 2'
  }
];

const conversations = [
  { id: '1', text: 'Fullscreen chatbot navigation' },
  { id: '2', text: 'Review deployment options' }
];

export const FullscreenDockedNav: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();

  const startNewChat = () => {
    setMessages([]);
    setIsDrawerOpen(false);
  };

  const sendMessage = (content: string) => {
    const message: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content,
      name: 'You',
      avatar: userAvatar,
      timestamp: new Date().toLocaleString(),
      avatarProps: { isBordered: true }
    };
    setMessages((currentMessages) => [...currentMessages, message]);
    setAnnouncement(`Message from You: ${content}`);
  };

  const dockedNav = (
    <Nav variant="docked" aria-label="Chatbot navigation" className="pf-chatbot__canvas-docked-nav pf-v6-u-h-100">
      <Flex direction={{ default: 'column' }} className="pf-v6-u-h-100 pf-v6-u-p-sm">
        <NavList>
          <NavItem
            itemId="history"
            isActive={isDrawerOpen}
            icon={<BarsIcon />}
            component="button"
            preventDefault
            onClick={() => setIsDrawerOpen((open) => !open)}
          >
            Chat history
          </NavItem>
        </NavList>
        <Brand
          className="pf-v6-u-my-md"
          src={PFIconLogoColor}
          alt="PatternFly"
          widths={{ default: '37px' }}
          heights={{ default: '37px' }}
        />
        <Divider />
        <NavList>
          <NavItem
            itemId="new-chat"
            icon={<RhUiEditFillIcon />}
            component="button"
            preventDefault
            onClick={startNewChat}
          >
            New chat
          </NavItem>
        </NavList>
        <NavList className="pf-v6-u-mt-auto">
          <NavItem itemId="settings" icon={<RhUiSettingsFillIcon />} component="button" preventDefault>
            Settings
          </NavItem>
        </NavList>
        <Avatar className="pf-v6-u-mt-md pf-v6-u-mb-md pf-v6-u-mx-auto" src={userAvatar} alt="User profile" size="md" />
      </Flex>
    </Nav>
  );

  return (
    <Chatbot displayMode={ChatbotDisplayMode.fullscreen} dockedNav={dockedNav}>
      <div className="pf-chatbot__canvas">
        <ChatbotConversationHistoryNav
          displayMode={ChatbotDisplayMode.fullscreen}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onDrawerToggle={() => setIsDrawerOpen((open) => !open)}
          conversations={{ Today: conversations }}
          activeItemId="1"
          onNewChat={startNewChat}
          drawerCloseButtonProps={{ 'aria-label': 'Close chat history' }}
          drawerContent={
            <div className="pf-chatbot__canvas-column">
              <ChatbotContent>
                <MessageBox ariaLabel="Scrollable message log for ChatBot" announcement={announcement} position="bottom">
                  <ChatbotWelcomePrompt
                    title="Hello, Chatbot User"
                    description="How may I help you today?"
                    prompts={welcomePrompts}
                  />
                  {messages.map((message) => (
                    <Message key={message.id} {...message} />
                  ))}
                </MessageBox>
              </ChatbotContent>
              <ChatbotFooter>
                <MessageBar onSendMessage={sendMessage} attachButtonPosition="start" alwayShowSendButton />
                <ChatbotFootnote label="Always review AI-generated content prior to use." />
              </ChatbotFooter>
            </div>
          }
        />
      </div>
    </Chatbot>
  );
};
