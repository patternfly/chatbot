import { FunctionComponent, useRef, useState } from 'react';
import {
  Avatar,
  Brand,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Flex,
  MenuToggle,
  Nav,
  NavItem,
  NavList,
  PageToggleButton,
  Switch,
  Title,
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
import SettingsForm from '@patternfly/chatbot/dist/dynamic/Settings';
import { RhUiEditFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import { RhUiSettingsFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import { RhMicronsCloseIcon } from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
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
  .pf-chatbot__canvas-docked-nav .pf-v6-c-masthead__logo.pf-m-compact {
    display: revert;
  }

  .pf-chatbot__canvas-docked-nav .pf-v6-c-nav.pf-m-docked .pf-v6-c-nav__link-text {
    display: none;
  }

  .pf-chatbot__canvas-history-toggle.pf-v6-c-button.pf-m-hamburger:is(:hover, :focus-visible) {
    --pf-v6-c-button--hamburger-icon--top--path: var(--pf-v6-c-button--hamburger-icon--top--collapse--path);
    --pf-v6-c-button--hamburger-icon--arrow--path: var(--pf-v6-c-button--hamburger-icon--arrow--collapse--path);
    --pf-v6-c-button--hamburger-icon--bottom--path: var(--pf-v6-c-button--hamburger-icon--bottom--collapse--path);
    --pf-v6-c-button__icon--TransitionDelay: 0s;
    --pf-v6-c-button__icon--ScaleX: var(--pf-v6-c-button--m-hamburger__icon--m-expand--ScaleX);
  }

  .pf-chatbot__canvas-history-toggle.pf-v6-c-button.pf-m-hamburger[aria-expanded="true"]:is(:hover, :focus-visible) {
    --pf-v6-c-button__icon--ScaleX: var(--pf-v6-c-button--m-hamburger__icon--m-collapse--ScaleX);
  }
`;

const SettingsPanel = ({ onClose }) => {
  const [openDropdown, setOpenDropdown] = useState<string>();
  const [theme, setTheme] = useState('System');
  const [language, setLanguage] = useState('Auto-detect');
  const [voice, setVoice] = useState('Bot');
  const [isAnalyticsShared, setIsAnalyticsShared] = useState(true);

  const dropdownField = (id, value, options, onSelect) => (
    <Dropdown
      isOpen={openDropdown === id}
      onSelect={(_event, selectedValue) => {
        onSelect(String(selectedValue));
        setOpenDropdown(undefined);
      }}
      onOpenChange={(isOpen: boolean) => setOpenDropdown(isOpen ? id : undefined)}
      shouldFocusToggleOnSelect
      shouldFocusFirstItemOnOpen
      toggle={(toggleRef) => (
        <MenuToggle
          id={id}
          ref={toggleRef}
          onClick={() => setOpenDropdown(openDropdown === id ? undefined : id)}
          isExpanded={openDropdown === id}
        >
          {value}
        </MenuToggle>
      )}
    >
      <DropdownList>
        {options.map((option) => (
          <DropdownItem value={option} key={option}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );

  const fields = [
    { id: 'theme', label: 'Theme', field: dropdownField('theme', theme, ['System', 'Light', 'Dark'], setTheme) },
    {
      id: 'language',
      label: 'Language',
      field: dropdownField('language', language, ['Auto-detect', 'English'], setLanguage)
    },
    { id: 'voice', label: 'Voice', field: dropdownField('voice', voice, ['Bot', 'User'], setVoice) },
    {
      id: 'analytics',
      label: 'Share analytics',
      field: (
        <Switch
          id="analytics"
          aria-label="Toggle sharing analytics"
          isChecked={isAnalyticsShared}
          onChange={(_event, checked) => setIsAnalyticsShared(checked)}
        />
      )
    },
    { id: 'archived-chat', label: 'Archived chats', field: <Button id="archived-chat">Manage</Button> },
    { id: 'archive-all', label: 'Archived all chats', field: <Button id="archive-all">Archive all</Button> },
    {
      id: 'delete-all',
      label: 'Delete all chats',
      field: (
        <Button id="delete-all" variant="danger">
          Delete all
        </Button>
      )
    }
  ];

  return (
    <div className="pf-v6-u-w-100">
      <div className="pf-v6-u-w-100 pf-v6-u-mx-auto" style={{ maxWidth: '60rem' }}>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
          className="pf-v6-u-p-lg"
        >
          <Title headingLevel="h1" size="2xl">
            Settings
          </Title>
          <Button variant="plain" icon={<RhMicronsCloseIcon />} aria-label="Close settings" onClick={onClose} />
        </Flex>
        <Divider />
        <SettingsForm fields={fields} />
      </div>
    </div>
  );
};

export const FullscreenDockedNav: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const newChatRef = useRef<HTMLAnchorElement>(null);

  const startNewChat = () => {
    setMessages([]);
    setIsDrawerOpen(false);
    setAreSettingsOpen(false);
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
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setAreSettingsOpen(true);
                  }}
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
              isBordered
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
            <div className="pf-chatbot__canvas">
              {areSettingsOpen ? (
                <SettingsPanel onClose={() => setAreSettingsOpen(false)} />
              ) : (
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
                    <ChatbotFootnote
                      label="Always review AI-generated content prior to use."
                      popover={{
                        title: 'AI-generated content',
                        description: 'Always review AI-generated content prior to use.',
                        showClose: true
                      }}
                    />
                  </ChatbotFooter>
                </div>
              )}
            </div>
          }
        />
      </div>
    </Chatbot>
  );
};
