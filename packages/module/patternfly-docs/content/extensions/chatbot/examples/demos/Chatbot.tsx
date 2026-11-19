import { useEffect, useRef, useState, FunctionComponent, MouseEvent } from 'react';
import {
  Bullseye,
  Brand,
  DropdownList,
  DropdownItem,
  DropdownGroup,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  SkipToContent
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
  ChatbotHeaderOptionsDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import { RhUiExpandIcon, RhUiOpenDrawerRightIcon, RhUiRestoreWindowIcon } from '@patternfly/react-icons';
import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import { getTrackingProviders } from '@patternfly/chatbot/dist/dynamic/tracking';
import { InitProps } from '@patternfly/chatbot/dist/dynamic/tracking';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const footnoteProps = {
  label: 'Always review AI-generated content prior to use.'
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

const initProps: InitProps = {
  verbose: false,
  segmentKey: 'TODO-key', // TODO add your key here
  posthogKey: 'TODO-key',
  umamiKey: 'TODO-key',
  umamiHostUrl: 'http://localhost:3000', // TODO where is your Umami installation?
  console: true,
  something: 'test'
};

const tracking = getTrackingProviders(initProps);
tracking.identify('user-123', { superUser: true }); // TODO get real user id + properties
tracking.trackPageView(window.location.href);

const actionEventName = 'MessageAction';
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
    timestamp: date.toLocaleString(),
    actions: {
      positive: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Good response' }) },
      negative: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Bad response' }) },
      copy: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Copy' }) },
      download: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Download' }) },
      listen: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Listen' }) }
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

const TAG_RESOURCES = [
  { name: 'auth-operator', type: 'Pod' },
  { name: 'api-server', type: 'Service' },
  { name: 'data-pipeline', type: 'Deployment' },
  { name: 'ingress-controller', type: 'Ingress' },
  { name: 'config-map', type: 'ConfigMap' }
];

const actionEvent2 = 'ActionEvent2';
export const ChatbotDemo: FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<ChatbotDisplayMode>(ChatbotDisplayMode.default);
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [selectedModel, setSelectedModel] = useState('Granite 7B');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [announcement, setAnnouncement] = useState<string>();
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const messageBarRef = useRef<HTMLDivElement>(null);

  // Tag menu state
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const savedRangeRef = useRef<Range | null>(null);

  const filteredResources = TAG_RESOURCES.filter((r) =>
    r.name.toLowerCase().includes(tagFilter.toLowerCase())
  );

  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSelectModel = (_event: MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedModel(value as string);
    tracking.trackSingleItem('ModelSelected', { model: value });
  };

  const onSelectDisplayMode = (
    _event: MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setDisplayMode(value as ChatbotDisplayMode);
  };

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string) => {
    setIsSendButtonDisabled(true);
    tracking.trackSingleItem('UserInputReceived', { text: message });
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
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      // We can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        isLoading: false,
        timestamp: date.toLocaleString(),
        actions: {
          positive: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Good response' }) },
          negative: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Bad response' }) },
          copy: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Copy' }) },
          download: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Download' }) },
          listen: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Listen' }) }
        }
      });
      setMessages(loadedMessages);
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
      tracking.trackSingleItem('BotResponded', { undefined });
      setIsSendButtonDisabled(false);
    }, 5000);
  };

  // --- Tag / mention system ---------------------------------------------------
  const handleMessageBarChange = (_event: React.FormEvent<HTMLDivElement> | null, _value: string) => {
    const el = messageBarRef.current;
    if (!el) {
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setIsTagMenuOpen(false);
      return;
    }

    const range = sel.getRangeAt(0);
    const container = range.startContainer;

    if (container.nodeType === Node.TEXT_NODE) {
      const text = container.textContent || '';
      const offset = range.startOffset;
      const before = text.slice(0, offset);
      const hashIdx = before.lastIndexOf('#');

      if (hashIdx >= 0) {
        const filter = before.slice(hashIdx + 1);
        if (!filter.includes(' ') && !filter.includes('\n')) {
          savedRangeRef.current = range.cloneRange();
          setIsTagMenuOpen(true);
          setTagFilter(filter);
          setActiveTagIndex(0);
          return;
        }
      }
    }

    setIsTagMenuOpen(false);
    setTagFilter('');
  };

  const insertTag = (resourceName: string) => {
    const el = messageBarRef.current;
    if (!el || !savedRangeRef.current) {
      return;
    }

    el.focus();
    const sel = window.getSelection();
    if (!sel) {
      return;
    }
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);

    const range = sel.getRangeAt(0);
    const container = range.startContainer;
    if (container.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const text = container.textContent || '';
    const offset = range.startOffset;
    const before = text.slice(0, offset);
    const hashIdx = before.lastIndexOf('#');
    if (hashIdx < 0) {
      return;
    }

    // Remove the #filter text the user typed
    const deleteRange = document.createRange();
    deleteRange.setStart(container, hashIdx);
    deleteRange.setEnd(container, offset);
    deleteRange.deleteContents();

    // Split the text node so we can insert the styled span between halves
    const textNode = container as Text;
    const afterNode = textNode.splitText(hashIdx);

    // Build the tag element
    const span = document.createElement('span');
    span.className = 'pf-chatbot__message-tag';
    span.contentEditable = 'false';
    span.textContent = `#${resourceName}`;

    const space = document.createTextNode(' ');
    const parent = textNode.parentNode;
    if (!parent) {
      return;
    }
    parent.insertBefore(span, afterNode);
    parent.insertBefore(space, afterNode);

    // Place the cursor after the trailing space
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    savedRangeRef.current = null;
    setIsTagMenuOpen(false);
    setTagFilter('');

    // Let the MessageBar know the content changed
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTagMenuOpen || filteredResources.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveTagIndex((prev) => Math.min(prev + 1, filteredResources.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveTagIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        insertTag(filteredResources[activeTagIndex].name);
        break;
      case 'Escape':
        event.preventDefault();
        setIsTagMenuOpen(false);
        setTagFilter('');
        break;
    }
  };
  // --- end tag system --------------------------------------------------------

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
          tracking.trackSingleItem('Chatbot Visible', { isVisible: !chatbotVisible }); // TODO correct?
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
                          icon={<RhUiRestoreWindowIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.default}
                        >
                          <span>Overlay</span>
                        </DropdownItem>
                        <DropdownItem
                          value={ChatbotDisplayMode.docked}
                          key="switchDisplayDock"
                          icon={<RhUiOpenDrawerRightIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.docked}
                        >
                          <span>Dock to window</span>
                        </DropdownItem>
                        <DropdownItem
                          value={ChatbotDisplayMode.fullscreen}
                          key="switchDisplayFullscreen"
                          icon={<RhUiExpandIcon aria-hidden />}
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
                <MessageBox announcement={announcement}>
                  <ChatbotWelcomePrompt
                    title="Hi, ChatBot User!"
                    description="How can I help you today?"
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
                <div style={{ position: 'relative' }}>
                  {isTagMenuOpen && filteredResources.length > 0 && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: 0,
                        right: 0,
                        marginBottom: '4px',
                        zIndex: 1000
                      }}
                    >
                      <Menu activeItemId={filteredResources[activeTagIndex]?.name}>
                        <MenuContent>
                          <MenuList>
                            {filteredResources.map((resource, index) => (
                              <MenuItem
                                key={resource.name}
                                itemId={resource.name}
                                className={index === activeTagIndex ? 'pf-m-focus' : undefined}
                                onClick={() => insertTag(resource.name)}
                              >
                                {resource.name}{' '}
                                <span style={{ opacity: 0.6, marginLeft: '4px', fontSize: '0.85em' }}>
                                  {resource.type}
                                </span>
                              </MenuItem>
                            ))}
                          </MenuList>
                        </MenuContent>
                      </Menu>
                    </div>
                  )}
                  <MessageBar
                    ref={messageBarRef}
                    onSendMessage={handleSend}
                    hasMicrophoneButton
                    isSendButtonDisabled={isSendButtonDisabled}
                    allowInlineElements
                    onChange={handleMessageBarChange}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </>
          }
        ></ChatbotConversationHistoryNav>
      </Chatbot>
    </>
  );
};
