import { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';

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
  DrawerPanelContent
} from '@patternfly/react-core';

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
  ChatbotHeaderSelectorDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import { BarsIcon } from '@patternfly/react-icons';
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

~~~javascript
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

export const EmbeddedChatbotDemo: FunctionComponent = () => {
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

  const displayMode = ChatbotDisplayMode.drawer;
  const isExpanded = true;

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSelectModel = (_event: MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedModel(value as string);
  };

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string) => {
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
      avatar: patternflyAvatar,
      isLoading: true,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      // we can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message));
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
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    }, 5000);
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

  const skipToChatbot = (event: MouseEvent) => {
    event.preventDefault();
    if (historyRef.current) {
      historyRef.current.focus();
    }
  };

  const skipToContent = (
    /* You can also add a SkipToContent for your main content here */
    <SkipToContent href="#" onClick={skipToChatbot}>
      Skip to chatbot
    </SkipToContent>
  );

  const chatbot = (
    <Chatbot displayMode={displayMode}>
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
                    <DropdownItem value="Mistral 3B" key="mistral">
                      Mistral 3B
                    </DropdownItem>
                  </DropdownList>
                </ChatbotHeaderSelectorDropdown>
              </ChatbotHeaderActions>
            </ChatbotHeader>
            <ChatbotContent>
              {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
              <MessageBox announcement={announcement}>
                <ChatbotWelcomePrompt
                  title="Hello, Chatbot User"
                  description="How may I help you today?"
                  prompts={welcomePrompts}
                />
                {/* This code block enables scrolling to the top of the last message.
                  You can instead choose to move the div with scrollToBottomRef on it below 
                  the map of messages, so that users are forced to scroll to the bottom.
                  If you are using streaming, you will want to take a different approach; 
                  see: https://github.com/patternfly/chatbot/issues/201#issuecomment-2400725173 */}
                {messages.map((message, index) => {
                  if (index === messages.length - 1) {
                    return (
                      <>
                        <div ref={scrollToBottomRef}></div>
                        <Message key={message.id} {...message} />
                      </>
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
      ></ChatbotConversationHistoryNav>
    </Chatbot>
  );

  const panelContent = <DrawerPanelContent>{chatbot}</DrawerPanelContent>;

  return (
    <Drawer isExpanded={isExpanded} isInline onExpand={onExpand}>
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>
          <Page skipToContent={skipToContent} masthead={masthead} sidebar={sidebar} isContentFilled></Page>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
