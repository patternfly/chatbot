import React from 'react';

import { Bullseye, Brand, DropdownList, DropdownItem, DropdownGroup, SkipToContent } from '@patternfly/react-core';

import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox, { MessageBoxHandle } from '@patternfly/chatbot/dist/dynamic/MessageBox';
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
  ChatbotHeaderOptionsDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';

import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const footnoteProps = {
  label: 'ChatBot uses AI. Check for mistakes.',
  popover: {
    title: 'Verify information',
    description: `While ChatBot strives for accuracy, AI is experimental and can make mistakes. We cannot guarantee that all information provided by ChatBot is up to date or without error. You should always verify responses using reliable sources, especially for crucial information and decision making.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Dismiss',
      onClick: () => {
        alert('Do something!');
      }
    },
    link: {
      label: 'View AI policy',
      url: 'https://www.redhat.com/'
    }
  }
};

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

Here is an inline code - \`() => void\`

Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~

Here is some JavaScript code:

~~~js
import React from 'react';

const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;

~~~
`;

// It's important to set a date and timestamp prop since the Message components re-render.
// The timestamps re-render with them.
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
    title: 'Set up account',
    message: 'Choose the necessary settings and preferences for your account.'
  },
  {
    title: 'Troubleshoot issue',
    message: 'Find documentation and instructions to resolve your issue.'
  }
];

const initialConversations = {
  Today: [{ id: '1', text: 'Hello, can you give me an example of what you can do?' }],
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

export const ChatbotScrollingDemo: React.FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = React.useState<boolean>(true);
  const [displayMode, setDisplayMode] = React.useState<ChatbotDisplayMode>(ChatbotDisplayMode.default);
  const [messages, setMessages] = React.useState<MessageProps[]>(initialMessages);
  const [selectedModel, setSelectedModel] = React.useState('Granite 7B');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [announcement, setAnnouncement] = React.useState<string>();
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const chatbotRef = React.useRef<HTMLDivElement>(null);
  const historyRef = React.useRef<HTMLButtonElement>(null);
  const messageBoxRef = React.useRef<MessageBoxHandle>(null); // ref to MessageBox will have isSmartScrollActive, scrollToTop and scrollToBottom
  const scrollQueued = React.useRef(false);

  // Auto-scrolls to the latest message
  React.useLayoutEffect(() => {
    if (!messageBoxRef.current?.isSmartScrollActive() || scrollQueued.current) {
      return undefined;
    }

    let rafId = 0;
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollQueued.current = true;

      rafId = requestAnimationFrame(() => {
        messageBoxRef.current?.scrollToBottom();
        scrollQueued.current = false;
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      scrollQueued.current = false;
    };
    // To scroll to the top of latest message just once, Use messages.length as a dependency instead of messages.
  }, [messages, messageBoxRef]);

  const onSelectModel = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string);
  };

  const onSelectDisplayMode = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setDisplayMode(value as ChatbotDisplayMode);
  };

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message) => {
    setIsSendButtonDisabled(true);
    const newMessages: MessageProps[] = [];
    // We can't use structuredClone since messages contains functions, but we can't mutate
    // items that are going into state or the UI won't update correctly
    messages.forEach((message) => newMessages.push(message));
    // It's important to set a timestamp prop since the Message components re-render.
    // The timestamps re-render with them.
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
      isLoading: true,
      avatar: patternflyAvatar,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    messageBoxRef.current?.scrollToBottom();
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      // We can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message));
      const messageIndex = loadedMessages.length - 1;
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here.',
        name: 'Bot',
        isLoading: false,
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
      });

      const longMessage =
        `It includes a long message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptatevelit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.`.repeat(2);

      const contentChunks = longMessage.split(' ');
      let chunkIndex = 0;

      setMessages(loadedMessages);

      let accumulatedContent = '';
      let lastUpdateTime = 0;
      const interval = setInterval(() => {
        if (chunkIndex < contentChunks.length) {
          accumulatedContent += ` ${contentChunks[chunkIndex]}`;
          chunkIndex++;

          // Only update every 100 ms or every 10 chunks
          const now = Date.now();
          const shouldUpdate = now - lastUpdateTime > 100 || chunkIndex % 10 === 0;

          if (shouldUpdate) {
            const updatedMessages = loadedMessages.map((msg, i) => {
              if (i === messageIndex) {
                return {
                  ...msg,
                  content: msg.content + accumulatedContent
                };
              }
              return msg;
            });

            setMessages(updatedMessages);
            lastUpdateTime = now;
          }
        } else {
          setIsSendButtonDisabled(false);
          clearInterval(interval);
        }
      }, 50);

      // Scrolls to the bottom of the message box and resumes auto-scrolling
      messageBoxRef.current?.scrollToBottom({ resumeSmartScroll: true });
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
    }, 100);
  };

  const findMatchingItems = (targetValue: string) => {
    let filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});

    // append message if no items are found
    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{ id: '13', noIcon: true, text: 'No results found' }];
    }
    return filteredConversations;
  };

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="PatternFly" />
    </Bullseye>
  );

  const iconLogo = (
    <>
      <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
    </>
  );

  const handleSkipToContent = (e) => {
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

      case ChatbotDisplayMode.docked:
        if (chatbotRef.current) {
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

  return (
    <>
      <SkipToContent onClick={handleSkipToContent} href="#">
        Skip to chatbot
      </SkipToContent>
      <ChatbotToggle
        tooltipLabel="Chatbot"
        isChatbotVisible={chatbotVisible}
        onToggleChatbot={function () {
          setChatbotVisible(!chatbotVisible);
        }}
        id="chatbot-toggle"
        ref={toggleRef}
      />
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
          // eslint-disable-next-line no-console
          onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
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
            // this is where you would perform search on the items in the drawer
            // and update the state
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
                  <ChatbotHeaderTitle
                    displayMode={displayMode}
                    showOnFullScreen={horizontalLogo}
                    showOnDefault={iconLogo}
                  ></ChatbotHeaderTitle>
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
                      <DropdownItem value="Mistral 3B" key="mistral">
                        Mistral 3B
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
                          value={ChatbotDisplayMode.docked}
                          key="switchDisplayDock"
                          icon={<OpenDrawerRightIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.docked}
                        >
                          <span>Dock to window</span>
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
                </ChatbotHeaderActions>
              </ChatbotHeader>
              <ChatbotContent>
                {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
                <MessageBox announcement={announcement} enableSmartScroll ref={messageBoxRef}>
                  <ChatbotWelcomePrompt
                    title="Hi, ChatBot User!"
                    description="How can I help you today?"
                    prompts={welcomePrompts}
                  />
                  {messages.map((message, index) => {
                    if (index === messages.length - 1) {
                      return (
                        <>
                          <Message key={message.id} {...message} />
                        </>
                      );
                    }
                    return <Message key={message.id} {...message} />;
                  })}
                </MessageBox>
              </ChatbotContent>
              <ChatbotFooter>
                <MessageBar
                  onSendMessage={handleSend}
                  hasMicrophoneButton
                  isSendButtonDisabled={isSendButtonDisabled}
                />
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </>
          }
        ></ChatbotConversationHistoryNav>
      </Chatbot>
    </>
  );
};
