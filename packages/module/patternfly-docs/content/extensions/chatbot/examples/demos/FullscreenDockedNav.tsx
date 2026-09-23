import { FunctionComponent, useRef, useState } from 'react';
import {
  Avatar,
  Brand,
  Divider,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  PageToggleButton,
  Tooltip
} from '@patternfly/react-core';
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

const hamburgerHoverStyles = `
  .pf-chatbot__canvas-history-toggle.pf-v6-c-button.pf-m-hamburger:is(:hover, :focus-visible) {
    --pf-v6-c-button--hamburger-icon--top--path: path("M5,1 L9,1");
    --pf-v6-c-button--hamburger-icon--arrow--path: path("M3,7 L1,5 L3,3");
    --pf-v6-c-button--hamburger-icon--bottom--path: path("M9,9 L5,9");
    --pf-v6-c-button--hover__icon--ScaleX: -1;
    --pf-v6-c-button__icon--TransitionDelay: 0s;
    --pf-v6-c-button--hover__icon--TransitionDelay: 0s;
  }

  .pf-chatbot__canvas-history-toggle.pf-v6-c-button.pf-m-hamburger[aria-expanded="true"]:is(:hover, :focus-visible) {
    --pf-v6-c-button--hover__icon--ScaleX: 1;
  }
`;

export const FullscreenDockedNav: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const newChatRef = useRef<HTMLAnchorElement>(null);

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
    <>
      <style>{hamburgerHoverStyles}</style>
      <div className="pf-chatbot__canvas-docked-nav pf-v6-u-h-100 pf-v6-u-p-sm">
        <Masthead variant="docked">
          <MastheadMain>
            <MastheadToggle>
              <PageToggleButton
                className="pf-chatbot__canvas-history-toggle"
                aria-label="Chat history"
                isHamburgerButton
                isSidebarOpen={isDrawerOpen}
                onSidebarToggle={() => setIsDrawerOpen((open) => !open)}
              />
            </MastheadToggle>
            <MastheadBrand>
              <MastheadLogo isCompact>
                <Brand src={PFIconLogoColor} alt="PatternFly" heights={{ default: '37px' }} />
              </MastheadLogo>
            </MastheadBrand>
          </MastheadMain>
          <MastheadContent>
            <Divider />
            <Nav
              variant="docked"
              aria-label="Chatbot navigation"
              className="pf-v6-u-flex-1 pf-v6-u-align-content-space-between"
            >
              <NavList>
                <NavItem
                  itemId="new-chat"
                  aria-label="New chat"
                  icon={<RhUiEditFillIcon />}
                  component="button"
                  preventDefault
                  anchorRef={newChatRef}
                  onClick={startNewChat}
                >
                  New chat
                </NavItem>
              </NavList>
              <NavList className="pf-v6-u-mt-auto">
                <NavItem
                  itemId="settings"
                  aria-label="Settings"
                  icon={<RhUiSettingsFillIcon />}
                  component="button"
                  preventDefault
                >
                  Settings
                </NavItem>
              </NavList>
            </Nav>
            <Tooltip aria="none" aria-live="off" triggerRef={newChatRef} content="New chat" />
            <Avatar
              className="pf-v6-u-mt-md pf-v6-u-mb-md pf-v6-u-mx-auto"
              src={userAvatar}
              alt="User profile"
              size="md"
            />
          </MastheadContent>
        </Masthead>
      </div>
    </>
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
                <MessageBox
                  ariaLabel="Scrollable message log for ChatBot"
                  announcement={announcement}
                  position="bottom"
                >
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
