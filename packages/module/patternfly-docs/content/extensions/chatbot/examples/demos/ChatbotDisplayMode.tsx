import React, { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';

import {
  Brand,
  DropdownList,
  DropdownItem,
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadLogo,
  PageSidebarBody,
  PageSidebar,
  MastheadToggle,
  PageToggleButton,
  SkipToContent,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DropdownGroup
} from '@patternfly/react-core';

import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {
  ChatbotHeaderMenu,
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotHeaderActions,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderCloseButton
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import { BarsIcon } from '@patternfly/react-icons';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const footnoteProps = {
  label: 'ChatBot uses AI. Check for mistakes.',
  popover: {
    title: 'Verify accuracy',
    description: `While ChatBot strives for accuracy, there's always a possibility of errors. It's a good practice to verify critical information from reliable sources, especially if it's crucial for decision-making or actions.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Got it',
      onClick: () => {
        alert('Do something!');
      }
    },
    link: {
      label: 'Learn more',
      url: 'https://www.redhat.com/'
    }
  }
};

const markdown = `A paragraph with *emphasis* and **strong importance**.`;

const date = new Date();

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, can you give me an example of what you can do?',
    name: 'User',
    avatar: userAvatar,
    timestamp: date.toLocaleString(),
    avatarProps: { isBordered: true }
  },
  {
    id: '2',
    role: 'bot',
    content: markdown,
    name: 'Bot',
    avatar: patternflyAvatar,
    timestamp: date.toLocaleString(),
    actions: {
      // eslint-disable-next-line no-console
      positive: { onClick: () => console.log('Good response') },
      // eslint-disable-next-line no-console
      negative: { onClick: () => console.log('Bad response') },
      // eslint-disable-next-line no-console
      copy: { onClick: () => console.log('Copy') },
      // eslint-disable-next-line no-console
      download: { onClick: () => console.log('Download') },
      // eslint-disable-next-line no-console
      listen: { onClick: () => console.log('Listen') }
    }
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

const initialConversations = {
  Today: [{ id: '1', text: 'Hello, can you give me an example of what you can do?' }],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup'
    }
  ]
};

export const ChatbotDisplayModeDemo: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [selectedModel, setSelectedModel] = useState('Granite 7B');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>();
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(true);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const [shouldFocusOptions, setShouldFocusOptions] = useState(false);

  const [displayMode, setDisplayMode] = useState<ChatbotDisplayMode>(ChatbotDisplayMode.default);

  const isDrawerPanelExpanded = displayMode === ChatbotDisplayMode.drawer;

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  useEffect(() => {
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus options dropdown after display mode changes
  useEffect(() => {
    if (shouldFocusOptions) {
      // Use a more reliable timeout to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        // Find the options dropdown button via CSS selector since ref forwarding isn't supported
        const optionsButton = document.querySelector('.pf-chatbot__button--toggle-options');
        if (optionsButton instanceof HTMLElement) {
          optionsButton.focus();
        }
        setShouldFocusOptions(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [displayMode, shouldFocusOptions]);

  const onSelectModel = (_event: MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedModel(value as string);
  };

  const onSelectDisplayMode = (
    _event: MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setDisplayMode(value as ChatbotDisplayMode);
    // Flag to focus options dropdown after render
    setShouldFocusOptions(true);
  };

  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string) => {
    setIsSendButtonDisabled(true);
    const newMessages: MessageProps[] = [...messages];
    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    });
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    setTimeout(() => {
      const loadedMessages: MessageProps[] = [...newMessages];
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false,
        actions: {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        },
        timestamp: date.toLocaleString()
      });
      setMessages(loadedMessages);
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    }, 2000);
  };

  const findMatchingItems = (targetValue: string) => {
    let filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});

    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{ id: '13', noIcon: true, text: 'No results found' }];
    }
    return filteredConversations;
  };

  const iconLogo = (
    <>
      <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
    </>
  );
  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            id="fill-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo href="https://patternfly.org" target="_blank">
            Logo
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="fill-sidebar">
      <PageSidebarBody>Navigation</PageSidebarBody>
    </PageSidebar>
  );

  const skipToChatbot = (e: MouseEvent) => {
    e.preventDefault();
    /* eslint-disable indent */
    switch (displayMode) {
      case ChatbotDisplayMode.default:
        if (!chatbotVisible && toggleRef.current) {
          toggleRef.current.focus();
        }
        if (chatbotVisible && chatbotRef.current) {
          chatbotRef.current.focus();
        }
        break;
      default:
        if (historyRef.current) {
          historyRef.current.focus();
        }
        break;
    }
    /* eslint-enable indent */
  };

  const skipToContent = (
    <SkipToContent href="#" onClick={skipToChatbot}>
      Skip to chatbot
    </SkipToContent>
  );

  const handleChatbotVisibilityDrawer = () => {
    setChatbotVisible(!chatbotVisible);
    setDisplayMode(ChatbotDisplayMode.default);
  };

  const chatbotComponent = (
    <Chatbot isVisible={chatbotVisible} displayMode={displayMode} ref={chatbotRef}>
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => {
          setIsDrawerOpen(!isDrawerOpen);
          setConversations(initialConversations);
        }}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        activeItemId="1"
        conversations={conversations}
        onNewChat={() => {
          setIsDrawerOpen(!isDrawerOpen);
          setMessages([]);
          setConversations(initialConversations);
        }}
        handleTextInputChange={(value: string) => {
          if (value === '') {
            setConversations(initialConversations);
          }
          const newConversations: { [key: string]: Conversation[] } = findMatchingItems(value);
          setConversations(newConversations);
        }}
        drawerContent={
          <>
            <ChatbotHeader>
              <ChatbotHeaderMain>
                <ChatbotHeaderMenu
                  ref={historyRef}
                  aria-expanded={isDrawerOpen}
                  onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                />
                <ChatbotHeaderTitle>{iconLogo}</ChatbotHeaderTitle>
              </ChatbotHeaderMain>
              <ChatbotHeaderActions>
                <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
                  <DropdownList>
                    <DropdownItem value="Granite 7B" key="granite">
                      Granite 7B
                    </DropdownItem>
                    <DropdownItem value="Llama 3.0" key="llama">
                      Llama 3.0
                    </DropdownItem>
                  </DropdownList>
                </ChatbotHeaderSelectorDropdown>
                <ChatbotHeaderOptionsDropdown onSelect={onSelectDisplayMode}>
                  <DropdownGroup label="Display mode">
                    <DropdownList>
                      <DropdownItem
                        value={ChatbotDisplayMode.default}
                        key="switchDisplayOverlay"
                        icon={<OutlinedWindowRestoreIcon aria-hidden />}
                        isSelected={displayMode === ChatbotDisplayMode.default}
                      >
                        <span>Overlay</span>
                      </DropdownItem>
                      <DropdownItem
                        value={ChatbotDisplayMode.drawer}
                        key="switchDisplayDock"
                        icon={<OpenDrawerRightIcon aria-hidden />}
                        isSelected={displayMode === ChatbotDisplayMode.drawer}
                      >
                        <span>Drawer</span>
                      </DropdownItem>
                      <DropdownItem
                        value={ChatbotDisplayMode.fullscreen}
                        key="switchDisplayFullscreen"
                        icon={<ExpandIcon aria-hidden />}
                        isSelected={displayMode === ChatbotDisplayMode.fullscreen}
                      >
                        <span>Fullscreen</span>
                      </DropdownItem>
                    </DropdownList>
                  </DropdownGroup>
                </ChatbotHeaderOptionsDropdown>
                {(displayMode === ChatbotDisplayMode.drawer || displayMode === ChatbotDisplayMode.fullscreen) && (
                  <ChatbotHeaderCloseButton onClick={handleChatbotVisibilityDrawer} />
                )}
              </ChatbotHeaderActions>
            </ChatbotHeader>
            <ChatbotContent>
              <MessageBox announcement={announcement}>
                <ChatbotWelcomePrompt
                  title="Hello, Chatbot User"
                  description="How may I help you today?"
                  prompts={welcomePrompts}
                />
                {messages.map((message, index) => {
                  if (index === messages.length - 1) {
                    return (
                      <React.Fragment key={message.id}>
                        <div ref={scrollToBottomRef}></div>
                        <Message {...message} />
                      </React.Fragment>
                    );
                  }
                  return <Message key={message.id} {...message} />;
                })}
              </MessageBox>
            </ChatbotContent>
            <ChatbotFooter>
              <MessageBar onSendMessage={handleSend} hasMicrophoneButton isSendButtonDisabled={isSendButtonDisabled} />
              <ChatbotFootnote {...footnoteProps} />
            </ChatbotFooter>
          </>
        }
      />
    </Chatbot>
  );

  const chatbotToggle =
    displayMode === ChatbotDisplayMode.default ? (
      <ChatbotToggle
        tooltipLabel="Chatbot"
        isChatbotVisible={chatbotVisible}
        onToggleChatbot={() => {
          setChatbotVisible(!chatbotVisible);
        }}
        id="chatbot-toggle"
        ref={toggleRef}
      />
    ) : null;

  const panelContent = <DrawerPanelContent>{chatbotComponent}</DrawerPanelContent>;

  const pageContent = (
    <Page skipToContent={skipToContent} masthead={masthead} sidebar={sidebar} isContentFilled>
      {displayMode === ChatbotDisplayMode.default && chatbotToggle}
    </Page>
  );

  if (displayMode === ChatbotDisplayMode.drawer) {
    return (
      <Drawer isExpanded={isDrawerPanelExpanded} isInline onExpand={onExpand}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>{pageContent}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {pageContent}
      {chatbotComponent}
    </>
  );
};
