import { useState, useRef, useCallback, useEffect, FunctionComponent, ReactNode } from 'react';
import {
  Brand,
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  Popover,
  Select,
  SelectList,
  SelectOption,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CodeEditor, CodeEditorControl, Language } from '@patternfly/react-code-editor';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {
  ChatbotHeaderActions,
  ChatbotHeaderCloseButton,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import RhUiAiInfoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import RhUiImageFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import RhUiAddIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import RhUiTaskFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-task-fill-icon';
import RhUiSaveIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-save-icon';
import RhUiRedoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-redo-icon';
import RhUiUndoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-undo-icon';
import RhUiServerUploadFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-server-upload-fill-icon';
import RhUiNotificationFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-notification-fill-icon';
import RhUiCalendarFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-calendar-fill-icon';
import { useDropzone } from 'react-dropzone';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const sampleCode = `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
data:
  greeting: Hello, how can I help you today?
`;

const date = new Date();

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'bot',
    content: 'How can I help?',
    name: 'Bot',
    timestamp: date.toLocaleString()
  },
  {
    id: '2',
    role: 'user',
    content: 'I want to live edit YAML code using canvas mode',
    name: 'You',
    avatar: userAvatar,
    avatarProps: { isBordered: true },
    timestamp: date.toLocaleString()
  },
  {
    id: '3',
    role: 'bot',
    content: 'The canvas mode text editor is ready. Edit, share or ask me to change something for you.',
    name: 'Bot',
    timestamp: date.toLocaleString(),
    attachments: [{ name: 'canvas mode.yaml', id: 'canvas-mode' }]
  }
];

const initialConversations = {
  Today: [{ id: '1', text: 'I want to live edit YAML code using canvas mode' }],
  'This month': [
    { id: '2', text: 'Enterprise Linux installation and setup' },
    { id: '3', text: 'Troubleshoot system crash' }
  ]
};

const footnoteProps = {
  label: 'Always review AI-generated content prior to use.'
};

const modelOptions = ['GPT-4', 'GPT-3.5', 'Claude', 'Llama 2'];

interface CanvasEditor {
  trigger: (source: string, handlerId: string, payload?: unknown) => void;
}

const iconLogo = (
  <>
    <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
    <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
  </>
);

export const Canvas: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [announcement, setAnnouncement] = useState<string>();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [showCanvasLabel, setShowCanvasLabel] = useState(true);
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [isGeneratedAiPopoverOpen, setIsGeneratedAiPopoverOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(true);
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [code, setCode] = useState(sampleCode);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<CanvasEditor>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messageActionsRef = useRef<HTMLButtonElement>(null);
  const canvasSectionRef = useRef<HTMLElement>(null);
  const wasCanvasOpen = useRef(isCanvasOpen);
  const shouldFocusCanvasCloseButton = useRef(false);
  const displayMode = ChatbotDisplayMode.fullscreen;

  const { open, getInputProps } = useDropzone({
    multiple: true,
    // eslint-disable-next-line no-console
    onDropAccepted: () => console.log('fileUploaded')
  });

  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = useCallback(
    (input: string) => {
      const date = new Date();
      const newMessages: MessageProps[] = [];
      messages.forEach((message) => newMessages.push(message));
      newMessages.push({
        avatar: userAvatar,
        avatarProps: { isBordered: true },
        id: generateId(),
        name: 'You',
        role: 'user',
        content: input,
        timestamp: `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`
      });
      newMessages.push({
        id: generateId(),
        name: 'Bot',
        role: 'bot',
        timestamp: `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`,
        isLoading: true
      });
      setMessages(newMessages);
      setAnnouncement(`Message from You: ${input}. Message from Bot is loading.`);
      setIsSendButtonDisabled(true);

      setTimeout(() => {
        const loadedMessages: MessageProps[] = [];
        newMessages.forEach((message) => loadedMessages.push(message));
        loadedMessages.pop();
        loadedMessages.push({
          id: generateId(),
          role: 'bot',
          content: 'API response from Bot goes here',
          name: 'Bot',
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
        setAnnouncement('Message from Bot: API response goes here');
        setIsSendButtonDisabled(false);
      }, 5000);
    },
    [messages]
  );

  useEffect(() => {
    if (messages.length > 3) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages]);

  const onModelSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string);
    setIsModelSelectOpen(false);
  };

  const openCanvas = () => {
    setShowCanvasLabel(true);
    setIsCanvasOpen(true);
  };

  const closeCanvasMode = () => {
    setShowCanvasLabel(false);
    setIsCanvasOpen(false);
    window.requestAnimationFrame(() => messageInputRef.current?.focus());
  };

  const focusCanvasSection = () => {
    canvasSectionRef.current?.focus();
  };

  useEffect(() => {
    const wasClosed = !wasCanvasOpen.current;
    wasCanvasOpen.current = isCanvasOpen;

    if (isCanvasOpen && wasClosed) {
      shouldFocusCanvasCloseButton.current = true;
    } else if (!isCanvasOpen) {
      shouldFocusCanvasCloseButton.current = false;
    }
  }, [isCanvasOpen]);

  const onCanvasExpand = () => {
    if (shouldFocusCanvasCloseButton.current) {
      shouldFocusCanvasCloseButton.current = false;
      focusCanvasSection();
    }
  };

  const focusMessageActions = () => {
    window.requestAnimationFrame(() => messageActionsRef.current?.focus());
  };

  const handleGeneratedAiLabelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
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

  const attachMenuItems: ReactNode = (
    <>
      <DropdownList>
        <DropdownItem value="Alerts" id="logs" icon={<RhUiNotificationFillIcon />}>
          Alerts
        </DropdownItem>
        <DropdownItem value="Events" id="events" icon={<RhUiCalendarFillIcon />}>
          Events
        </DropdownItem>
        <DropdownItem value="Logs" id="logs" icon={<RhUiTaskFillIcon />}>
          Logs
        </DropdownItem>
      </DropdownList>
      <Divider key="divider-1" />
      <DropdownList>
        <DropdownItem value="Upload from computer" id="upload" icon={<RhUiServerUploadFillIcon />} onClick={open}>
          Upload from computer
        </DropdownItem>
        <DropdownItem value="canvas" id="canvas" icon={<RhUiImageFillIcon />}>
          {`${isCanvasOpen ? 'Disable' : 'Enable'} canvas mode`}
        </DropdownItem>
      </DropdownList>
    </>
  );

  const customControls = [
    <CodeEditorControl
      key="undo"
      icon={<RhUiUndoIcon />}
      aria-label="Undo"
      tooltipProps={{
        content: 'Undo',
        // prevents VO announcements of both aria label and tooltip
        aria: 'none'
      }}
      onClick={() => editorRef.current?.trigger('keyboard', 'undo', null)}
    />,
    <CodeEditorControl
      key="redo"
      icon={<RhUiRedoIcon />}
      aria-label="Redo"
      tooltipProps={{
        content: 'Redo',
        // prevents VO announcements of both aria label and tooltip
        aria: 'none'
      }}
      onClick={() => editorRef.current?.trigger('keyboard', 'redo', null)}
    />,
    <CodeEditorControl
      key="export"
      icon={<RhUiSaveIcon />}
      aria-label="Save"
      tooltipProps={{
        content: 'Save',
        // prevents VO announcements of both aria label and tooltip
        aria: 'none'
      }}
      onClick={(value) => {
        // eslint-disable-next-line no-console
        console.log('Export', value);
      }}
    />
  ];

  const panelContent = (
    <DrawerPanelContent
      isResizable
      isGlass
      defaultSize="50%"
      minSize="20%"
      id="chatbot-canvas-panel"
      resizeAriaLabel="Resize canvas"
      className="pf-chatbot__canvas-panel"
    >
      <section
        ref={canvasSectionRef}
        className="pf-chatbot__canvas-section"
        tabIndex={-1}
        aria-label="Canvas"
        aria-labelledby="chatbot-canvas-section chatbot-canvas-title"
        id="chatbot-canvas-section"
      >
        <DrawerHead className="pf-chatbot__canvas-head">
          <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title id="chatbot-canvas-title" headingLevel="h2" size="lg">
                Edit code
              </Title>
            </FlexItem>
            <FlexItem>
              <Popover
                headerContent={
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <RhUiAiInfoIcon aria-hidden />
                    </FlexItem>
                    <FlexItem>What is canvas mode?</FlexItem>
                  </Flex>
                }
                bodyContent={
                  <>
                    <div className="pf-v6-u-font-size-sm pf-v6-u-mb-md">
                      This canvas is a collaborative workspace that blends AI-generated content with manual human edits.
                      You can accept an AI-generated baseline and immediately mold it with direct keystrokes, creating a
                      seamless partnership over a shared deliverable.
                    </div>
                    <div className="pf-v6-u-font-size-xs">Always review AI-generated code prior to use.</div>
                  </>
                }
                onShow={() => setIsGeneratedAiPopoverOpen(true)}
                onHide={() => setIsGeneratedAiPopoverOpen(false)}
              >
                <Label
                  isClickable
                  variant="outline"
                  icon={<RhUiAiInfoIcon aria-hidden />}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isGeneratedAiPopoverOpen}
                  onKeyDown={handleGeneratedAiLabelKeyDown}
                >
                  Generated with AI
                </Label>
              </Popover>
            </FlexItem>
          </Flex>
          <DrawerActions>
            <Tooltip content="Close canvas" position="bottom" aria="none">
              <span>
                <DrawerCloseButton aria-label="Exit canvas mode" onClose={closeCanvasMode} />
              </span>
            </Tooltip>
          </DrawerActions>
        </DrawerHead>
        <div className="pf-chatbot__canvas-panel-body">
          <div className="pf-chatbot__canvas-editor">
            <CodeEditor
              isFullHeight
              isLineNumbersVisible
              isLanguageLabelVisible
              isCopyEnabled
              isDownloadEnabled
              downloadFileName="canvas-mode"
              customControls={customControls}
              code={code}
              language={Language.yaml}
              onCodeChange={setCode}
              onEditorDidMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>
      </section>
    </DrawerPanelContent>
  );

  return (
    <>
      {/* This is required for react-dropzone to work in Safari and Firefox */}
      <input {...getInputProps()} hidden />
      <Chatbot displayMode={displayMode} isVisible={chatbotVisible}>
        <div className="pf-chatbot__canvas">
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
            drawerCloseButtonProps={{ 'aria-label': 'Close chat history' }}
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
              <Drawer
                className="pf-chatbot__canvas-drawer"
                isExpanded={isCanvasOpen}
                isInline
                position="end"
                onExpand={onCanvasExpand}
              >
                <DrawerContent panelContent={panelContent}>
                  <DrawerContentBody className="pf-chatbot__canvas-body">
                    <div className="pf-chatbot__canvas-column">
                      <ChatbotHeader>
                        <ChatbotHeaderMain>
                          <ChatbotHeaderMenu
                            ref={historyRef}
                            aria-expanded={isDrawerOpen}
                            onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                            tooltipContent="Chat history"
                            menuAriaLabel="Chat history"
                          />
                          <ChatbotHeaderTitle>{iconLogo}</ChatbotHeaderTitle>
                        </ChatbotHeaderMain>
                        <ChatbotHeaderActions>
                          <ChatbotHeaderCloseButton
                            tooltipContent="Close ChatBot"
                            menuAriaLabel="Close ChatBot"
                            onClick={() => setChatbotVisible(false)}
                          />
                        </ChatbotHeaderActions>
                      </ChatbotHeader>
                      <ChatbotContent>
                        <MessageBox ariaLabel="Scrollable message log for ChatBot" announcement={announcement}>
                          {messages.map((message) => (
                            <Message
                              key={message.id}
                              {...message}
                              attachments={message.attachments?.map((attachment) => ({
                                ...attachment,
                                onClick: openCanvas
                              }))}
                            />
                          ))}
                          <div ref={scrollToBottomRef}></div>
                        </MessageBox>
                      </ChatbotContent>
                      <ChatbotFooter>
                        <MessageBar
                          onSendMessage={handleSend}
                          innerRef={messageInputRef}
                          attachButtonPosition="start"
                          alwayShowSendButton
                          isSendButtonDisabled={isSendButtonDisabled}
                          attachMenuProps={{
                            isAttachMenuOpen,
                            setIsAttachMenuOpen,
                            attachMenuItems,
                            onAttachMenuOnOpenChangeKeys: ['Escape', 'Tab'],
                            onAttachMenuSelect: (_ev, value) => {
                              // eslint-disable-next-line no-console
                              console.log('selected', value);
                              if (value === 'canvas') {
                                if (showCanvasLabel) {
                                  closeCanvasMode();
                                } else {
                                  setShowCanvasLabel(true);
                                  setIsCanvasOpen(true);
                                }
                              }
                              setIsAttachMenuOpen(false);
                              focusMessageActions();
                            },
                            onAttachMenuToggleClick: () => setIsAttachMenuOpen(!isAttachMenuOpen)
                          }}
                          buttonProps={{
                            attach: {
                              innerRef: messageActionsRef,
                              icon: <RhUiAddIcon />,
                              tooltipContent: 'Message actions',
                              'aria-label': 'Message actions'
                            }
                          }}
                          additionalActions={
                            <>
                              {showCanvasLabel && (
                                <Label
                                  closeBtnAriaLabel="Exit canvas mode"
                                  onClose={closeCanvasMode}
                                  icon={<RhUiImageFillIcon />}
                                >
                                  Canvas
                                </Label>
                              )}
                              <Select
                                isOpen={isModelSelectOpen}
                                selected={selectedModel}
                                shouldFocusToggleOnSelect
                                onSelect={onModelSelect}
                                onOpenChange={(isOpen) => setIsModelSelectOpen(isOpen)}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="plainText"
                                    className="pf-chatbot__canvas-model-toggle"
                                    onClick={() => setIsModelSelectOpen(!isModelSelectOpen)}
                                    isExpanded={isModelSelectOpen}
                                    aria-label={`${selectedModel}, Select a model`}
                                  >
                                    {selectedModel}
                                  </MenuToggle>
                                )}
                              >
                                <SelectList>
                                  {modelOptions.map((option) => (
                                    <SelectOption key={option} value={option}>
                                      {option}
                                    </SelectOption>
                                  ))}
                                </SelectList>
                              </Select>
                            </>
                          }
                        />
                        <ChatbotFootnote {...footnoteProps} />
                      </ChatbotFooter>
                    </div>
                  </DrawerContentBody>
                </DrawerContent>
              </Drawer>
            }
          />
        </div>
      </Chatbot>
    </>
  );
};
