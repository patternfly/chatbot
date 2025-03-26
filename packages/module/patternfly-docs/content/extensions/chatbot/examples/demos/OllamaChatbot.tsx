import React from 'react';

import { Brand, Bullseye, DropdownGroup, DropdownItem, DropdownList, SkipToContent } from '@patternfly/react-core';

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
  ChatbotHeaderActions,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderTitle
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

const footnoteProps = {
  label: 'Lightspeed uses AI. Check for mistakes.',
  popover: {
    title: 'Verify accuracy',
    description: `While Lightspeed strives for accuracy, there's always a possibility of errors. It's a good practice to verify critical information from reliable sources, especially if it's crucial for decision-making or actions.`,
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

const ollamaServerBaseUrl = 'http://127.0.0.1:11434';

const initialMessages: MessageProps[] = [];

const welcomePrompts = [
  {
    title: 'Models',
    message: 'You can use all models deployed on the Ollama server. Pick a model in the above selector'
  },
  {
    title: 'Server',
    message: 'The current code expects an Ollama server at ' + ollamaServerBaseUrl
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

interface ModelProps {
  name: string;
  model: string;
}

interface OllamaMessage {
  role: string;
  content: string;
}

interface OllamaChatResponse {
  message: OllamaMessage;
  done: string;
  prompt_eval_count: number;
  eval_count: number;
}

const actionEvent2 = 'ActionEvent2';

export const OllamaChatbotDemo: React.FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = React.useState<boolean>(true);
  const [displayMode, setDisplayMode] = React.useState<ChatbotDisplayMode>(ChatbotDisplayMode.default);
  const [messages, setMessages] = React.useState<MessageProps[]>(initialMessages);
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [announcement, setAnnouncement] = React.useState<string>();
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const chatbotRef = React.useRef<HTMLDivElement>(null);
  const historyRef = React.useRef<HTMLButtonElement>(null);
  const [modelList, setModelList] = React.useState<ModelProps[]>([]);

  // Fetch available models from the Ollama server
  function getModels() {
    fetch(ollamaServerBaseUrl + '/api/tags')
      .then((res) => res.json())
      .then((data) => {
        const props: ModelProps[] = [];
        for (const item of data.models) {
          const mp: ModelProps = { name: item.name, model: item.model };
          props.push(mp);
        }
        setSelectedModel(props[0].model);
        setModelList(props);
      });
  }

  // Send the passed messages to the model server and
  // read its response in one go.
  // TODO: support streaming response
  function getResponseFromLLM(mesgs: string[]): Promise<OllamaChatResponse> {
    const mjson: OllamaMessage[] = [];
    mesgs.forEach((msg) => {
      const o: OllamaMessage = { role: 'user', content: msg };
      mjson.push(o);
    });
    const o: OllamaMessage = {
      role: 'system',
      content: 'If you reply with source code, please format code snippets as Markdown'
    };
    mjson.push(o);

    const q = {
      model: selectedModel,
      stream: false,
      messages: mjson
    };

    // eslint-disable-next-line no-console
    console.log('==> Sending ' + JSON.stringify(q));

    const val = fetch(ollamaServerBaseUrl + '/api/chat', {
      method: 'POST',
      body: JSON.stringify(q)
    })
      .then((resp) => resp.json())
      .then((json) => {
        let oo: OllamaChatResponse;
        // See if we get an error back and return that to the user
        if (json.error != null) {
          oo = {
            done: 'true',
            // eslint-disable-next-line camelcase
            eval_count: -1,
            message: {
              role: 'bot',
              content: 'I am sorry: ' + json.error
            },
            // eslint-disable-next-line camelcase
            prompt_eval_count: -1
          };
        } else {
          oo = Object.assign({}, json);
        }
        // eslint-disable-next-line no-console
        console.log('<== Received ' + JSON.stringify(oo));
        return oo;
      });
    return val;
  }

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 1) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      getModels();
    }
  }, [messages]);

  const onSelectModel = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string);
    // Trigger a "no-op" request which makes Ollama load the model
    getResponseFromLLM(['']);
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
      isLoading: true,
      avatar: patternflyAvatar,
      timestamp: date.toLocaleString()
    });
    const messagesToSendToLLM: string[] = newMessages
      .filter((item) => item.role === 'user')
      .map((item: MessageProps) => item.content)
      .filter((item) => typeof item === 'string')
      .map((item) => item);

    // eslint-disable-next-line no-console
    console.log('Messages sent' + JSON.stringify(messagesToSendToLLM));
    const response = getResponseFromLLM(messagesToSendToLLM);
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    response.then((ollamaResponse) => {
      const loadedMessages: MessageProps[] = [];
      // We can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((message) => loadedMessages.push(message));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: ollamaResponse.message.content,
        name: 'Bot',
        isLoading: false,
        avatar: patternflyAvatar,
        timestamp: date.toLocaleString(),
        actions: {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log(actionEvent2, { response: 'Good response' }) },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log(actionEvent2, { response: 'Bad response' }) },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log(actionEvent2, { response: 'Copy' }) },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log(actionEvent2, { response: 'Share' }) },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log(actionEvent2, { response: 'Listen' }) }
        }
      });
      setMessages(loadedMessages);
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    });
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
                      {modelList.map((item) => (
                        <DropdownItem key={item.model} value={item.model}>
                          {item.name}
                        </DropdownItem>
                      ))}
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
