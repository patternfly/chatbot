import { useEffect, useRef, useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import {
  Bullseye,
  Brand,
  DropdownList,
  DropdownItem,
  DropdownGroup,
  SkipToContent,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  ExpandableSectionVariant,
  Flex,
  FlexItem,
  Label
} from '@patternfly/react-core';
import { CopyIcon, WrenchIcon } from '@patternfly/react-icons';

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

const comprehensiveMarkdownBody = `Here's a comprehensive markdown example with various formatting options:

# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Text Emphasis

**Bold text, formatted with double asterisks**

__Bold text, formatted with double underscores__

*Italic text, formatted with single asterisks*

_Italic text, formatted with single underscores_

~~Strikethrough~~

## Inline Code

Here is an inline code example - \`() => void\`

## Code Blocks

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

## Block Quotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs (>) right next to each other...
> > > ...or with spaces between each sign.

## Lists

### Ordered List

1. Item 1
2. Item 2
3. Item 3

### Unordered List

* Item 1
* Item 2
* Item 3

### More Complex List

You may be wondering whether you can display more complex lists with formatting. In response to your question, I will explain how to spread butter on toast.

1. **Using a \`toaster\`:**

  - Place \`bread\` in a \`toaster\`
  - Once \`bread\` is lightly browned, remove from \`toaster\`

2. **Using a \`knife\`:**

  - Acquire 1 tablespoon of room temperature \`butter\`. Use \`knife\` to spread butter on \`toast\`. Bon appétit!

## Links

A paragraph with a URL: https://reactjs.org.

## Tables

To customize your table, you can use [PatternFly TableProps](/components/table#table)

| Version | GA date | User role
|-|-|-|
| 2.5 | September 30, 2024 | Administrator |
| 2.5 | June 27, 2023 | Editor |
| 3.0 | April 1, 2025 | Administrator

## Images

![Multi-colored wavy lines on a black background](https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif)

## Footnotes

This is some text that has a short footnote[^1] and this is text with a longer footnote.[^bignote]

[^1]: This is a short footnote. To return the highlight to the original message, click the arrow.

[^bignote]: This is a long footnote with multiple paragraphs and formatting.

    To break long footnotes into paragraphs, indent the text.

    Add as many paragraphs as you like. You can include *italic text*, **bold text**, and \`code\`.

    > You can even include blockquotes in footnotes!
`;

// It's important to set a date and timestamp prop since the Message components re-render.
// The timestamps re-render with them.
const date = new Date();

const ToolResponseContent = () => (
  <Flex
    alignItems={{
      default: 'alignItemsCenter'
    }}
    justifyContent={{
      default: 'justifyContentSpaceBetween'
    }}
  >
    <FlexItem>
      <Flex
        direction={{
          default: 'column'
        }}
        gap={{
          default: 'gapXs'
        }}
      >
        <FlexItem
          grow={{
            default: 'grow'
          }}
        >
          <Flex
            gap={{
              default: 'gapXs'
            }}
          >
            <FlexItem>
              <WrenchIcon
                style={{
                  color: 'var(--pf-t--global--icon--color--brand--default'
                }}
              />
            </FlexItem>
            <FlexItem>toolName</FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <Flex
            gap={{
              default: 'gapSm'
            }}
            style={{
              fontSize: '12px',
              fontWeight: '400'
            }}
          >
            <FlexItem>Execution time:</FlexItem>
            <FlexItem>0.12 seconds</FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </FlexItem>
    <FlexItem>
      <Button
        variant="plain"
        aria-label="Copy tool response to clipboard"
        icon={
          <CopyIcon
            style={{
              color: 'var(--pf-t--global--icon--color--subtle)'
            }}
          />
        }
      ></Button>
    </FlexItem>
  </Flex>
);

const ToolResponseCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const onToggle = (_event: ReactMouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <>
      <DescriptionList
        style={{
          '--pf-v6-c-description-list--RowGap': 'var(--pf-t--global--spacer--md)'
        }}
        aria-label="Tool response"
      >
        <DescriptionListGroup
          style={{
            '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)'
          }}
        >
          <DescriptionListTerm>Parameters</DescriptionListTerm>
          <DescriptionListDescription>
            <Flex
              direction={{
                default: 'column'
              }}
            >
              <FlexItem>Optional description text for parameters.</FlexItem>
              <FlexItem>
                <Flex
                  gap={{
                    default: 'gapSm'
                  }}
                >
                  <FlexItem>
                    <Label variant="outline" color="blue">
                      type
                    </Label>
                  </FlexItem>
                  <FlexItem>
                    <Label variant="outline" color="blue">
                      properties
                    </Label>
                  </FlexItem>
                  <FlexItem>
                    <Label variant="outline" color="blue">
                      label
                    </Label>
                  </FlexItem>
                  <FlexItem>
                    <Label variant="outline" color="blue">
                      label
                    </Label>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup
          style={{
            '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)'
          }}
        >
          <DescriptionListTerm>Response</DescriptionListTerm>
          <DescriptionListDescription>
            <ExpandableSection
              variant={ExpandableSectionVariant.truncate}
              toggleTextExpanded="show less of response"
              toggleTextCollapsed="show more of response"
              onToggle={onToggle}
              isExpanded={isExpanded}
              style={{
                '--pf-v6-c-expandable-section__content--Opacity': '1',
                '--pf-v6-c-expandable-section__content--PaddingInlineStart': 0,
                '--pf-v6-c-expandable-section__content--TranslateY': 0,
                '--pf-v6-c-expandable-section--m-expand-top__content--TranslateY': 0
              }}
            >
              Descriptive text about the tool response, including completion status, details on the data that was
              processed, or anything else relevant to the use case.
            </ExpandableSection>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you show me a comprehensive markdown example with tool response?',
    name: 'User',
    avatar: userAvatar,
    timestamp: date.toLocaleString(),
    avatarProps: { isBordered: true }
  },
  {
    id: '2',
    role: 'bot',
    content:
      'This example demonstrates a tool response with a comprehensive markdown body showing all formatting options:',
    name: 'Bot',
    avatar: patternflyAvatar,
    timestamp: date.toLocaleString(),
    toolResponse: {
      shouldRetainStyles: true,
      isToggleContentMarkdown: true,
      toggleContent: '# Tool response: toolName',
      isSubheadingMarkdown: true,
      subheading: '> Thought for 3 seconds',
      body: comprehensiveMarkdownBody,
      isBodyMarkdown: true,
      cardTitle: <ToolResponseContent />,
      cardBody: <ToolResponseCard />
    }
  }
];

const welcomePrompts = [
  {
    title: 'Show markdown example',
    message: 'Can you show me a comprehensive markdown example with tool response?'
  },
  {
    title: 'Formatting options',
    message: 'What formatting options are available in markdown?'
  }
];

const initialConversations = {
  Today: [{ id: '1', text: 'Can you show me a comprehensive markdown example with tool response?' }],
  'This month': [
    {
      id: '2',
      text: 'Markdown formatting guide'
    },
    { id: '3', text: 'Tool response examples' }
  ]
};

export const ChatbotWithMarkdownToolResponseDemo: FunctionComponent = () => {
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

  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSelectModel = (
    _event: ReactMouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string);
  };

  const onSelectDisplayMode = (
    _event: ReactMouseEvent<Element, MouseEvent> | undefined,
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
        avatar: patternflyAvatar,
        timestamp: date.toLocaleString()
      });
      setMessages(loadedMessages);
      // make announcement to assistive devices that new message has loaded
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
