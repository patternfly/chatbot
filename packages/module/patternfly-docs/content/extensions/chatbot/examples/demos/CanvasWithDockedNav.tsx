import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Avatar,
  Brand,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Label,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  Nav,
  NavItem,
  NavList,
  Select,
  SelectList,
  SelectOption,
  Switch,
  Title,
  PageToggleButton,
  Popover,
  Tooltip
} from '@patternfly/react-core';
import { CodeEditor, CodeEditorControl, Language } from '@patternfly/react-code-editor';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import SettingsForm from '@patternfly/chatbot/dist/dynamic/Settings';
import { RhUiAddIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import { RhUiAiInfoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import { RhUiCalendarFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-calendar-fill-icon';
import { RhUiExportIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-export-icon';
import { RhUiImageFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import { RhUiNotificationFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-notification-fill-icon';
import { RhUiEditFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import { RhUiRedoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-redo-icon';
import { RhUiServerUploadFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-server-upload-fill-icon';
import { RhUiSettingsFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import { RhUiTaskFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-task-fill-icon';
import { RhUiUndoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-undo-icon';
import { RhMicronsCloseIcon } from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
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

const initialMessages = [
  {
    id: '1',
    role: 'bot',
    content: 'Text message from the bot. This message can wrap several lines.',
    name: 'Bot',
    timestamp: '1:30 PM'
  },
  {
    id: '2',
    role: 'user',
    content: 'Canvas mode enabled - I want to live edit code',
    name: 'You',
    avatar: userAvatar,
    avatarProps: { isBordered: true },
    timestamp: '1:30 PM'
  },
  {
    id: '3',
    role: 'bot',
    content: 'The canvas mode text editor is ready. Edit, share or ask me to change something for you.',
    name: 'Bot',
    timestamp: '1:30 PM',
    attachments: [{ name: 'canvas mode.yaml', id: 'canvas-mode' }]
  }
];

const conversations = [
  { id: '1', text: 'Canvas mode enabled - I want to live edit code' },
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
    <div className="pf-chatbot__canvas">
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

export const CanvasWithDockedNavDemo = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [code, setCode] = useState(sampleCode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [showCanvasLabel, setShowCanvasLabel] = useState(true);
  const [isGeneratedAiPopoverOpen, setIsGeneratedAiPopoverOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Granite 7B');
  const [announcement, setAnnouncement] = useState();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const newChatRef = useRef<HTMLAnchorElement>(null);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const messageActionsRef = useRef<HTMLButtonElement>(null);
  const { open, getInputProps } = useDropzone({
    multiple: true,
    // eslint-disable-next-line no-console
    onDropAccepted: () => console.log('fileUploaded')
  });

  const startNewChat = () => {
    setMessages([]);
    setIsDrawerOpen(false);
    setAreSettingsOpen(false);
  };

  const openCanvas = () => {
    setShowCanvasLabel(true);
    setIsCanvasOpen(true);
  };

  const closeCanvasMode = () => {
    setShowCanvasLabel(false);
    setIsCanvasOpen(false);
  };

  const sendMessage = (content) => {
    const date = new Date();
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      name: 'You',
      avatar: userAvatar,
      avatarProps: { isBordered: true },
      timestamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    };
    const newMessages = [...messages, userMessage];
    newMessages.push({
      id: `${Date.now()}-loading`,
      role: 'bot',
      name: 'Bot',
      isLoading: true,
      timestamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    });
    setMessages(newMessages);
    setAnnouncement(`Message from You: ${content}. Message from Bot is loading.`);
    setIsSendButtonDisabled(true);
    setTimeout(() => {
      const loadedMessages = [...newMessages];
      loadedMessages.pop();
      loadedMessages.push({
        id: `${Date.now()}-bot`,
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
      setAnnouncement('Message from Bot: API response from Bot goes here');
      setIsSendButtonDisabled(false);
    }, 5000);
  };

  const attachMenuItems = (
    <>
      <DropdownList>
        <DropdownItem value="Alerts" id="alerts" icon={<RhUiNotificationFillIcon />}>
          Alerts
        </DropdownItem>
        <DropdownItem value="Events" id="events" icon={<RhUiCalendarFillIcon />}>
          Events
        </DropdownItem>
        <DropdownItem value="Logs" id="logs" icon={<RhUiTaskFillIcon />}>
          Logs
        </DropdownItem>
      </DropdownList>
      <Divider />
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
              aria-label="Canvas navigation"
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

  const editorControls = [
    { icon: <RhUiUndoIcon />, label: 'Undo' },
    { icon: <RhUiRedoIcon />, label: 'Redo' },
    { icon: <RhUiExportIcon />, label: 'Export' }
  ].map(({ icon, label }) => (
    <CodeEditorControl key={label} icon={icon} aria-label={label} tooltipProps={{ content: label, aria: 'none' }} />
  ));

  const canvasPanel = (
    <DrawerPanelContent isResizable isGlass defaultSize="60%" minSize="30%" className="pf-chatbot__canvas-panel">
      <section className="pf-chatbot__canvas-section" tabIndex={-1} aria-label="Canvas">
        <DrawerHead className="pf-chatbot__canvas-head">
          <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h2" size="lg">
                Edit code
              </Title>
            </FlexItem>
            <FlexItem>
              <Popover
                headerContent="What is canvas mode?"
                bodyContent="This canvas is a collaborative workspace that blends AI-generated content with manual human edits."
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
              customControls={editorControls}
              code={code}
              language={Language.yaml}
              onCodeChange={setCode}
            />
          </div>
        </div>
      </section>
    </DrawerPanelContent>
  );

  return (
    <>
      <input {...getInputProps()} hidden />
      <Chatbot displayMode={ChatbotDisplayMode.fullscreen} dockedNav={dockedNav}>
        <div className="pf-chatbot__canvas">
          <ChatbotConversationHistoryNav
            displayMode={ChatbotDisplayMode.fullscreen}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            onDrawerToggle={() => setIsDrawerOpen((open) => !open)}
            activeItemId="1"
            conversations={{ Today: conversations }}
            onNewChat={startNewChat}
            drawerCloseButtonProps={{ 'aria-label': 'Close chat history' }}
            drawerContent={
              <div style={{ display: 'contents' }}>
                {areSettingsOpen ? (
                  <SettingsPanel onClose={() => setAreSettingsOpen(false)} />
                ) : (
                  <Drawer isExpanded={isCanvasOpen} isInline position="end">
                    <DrawerContent panelContent={canvasPanel}>
                      <DrawerContentBody className="pf-chatbot__canvas-body">
                        <div className="pf-chatbot__canvas-column">
                          <ChatbotContent className="pf-chatbot__canvas-chat-content">
                            <MessageBox
                              ariaLabel="Scrollable message log for ChatBot"
                              announcement={announcement}
                              position="bottom"
                            >
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
                          <ChatbotFooter className="pf-chatbot__canvas-chat-footer">
                            <MessageBar
                              onSendMessage={sendMessage}
                              attachButtonPosition="start"
                              alwayShowSendButton
                              isSendButtonDisabled={isSendButtonDisabled}
                              attachMenuProps={{
                                isAttachMenuOpen,
                                setIsAttachMenuOpen,
                                attachMenuItems,
                                onAttachMenuOnOpenChangeKeys: ['Escape', 'Tab'],
                                onAttachMenuSelect: (_event, value) => {
                                  if (value === 'canvas') {
                                    if (showCanvasLabel) {
                                      closeCanvasMode();
                                    } else {
                                      openCanvas();
                                    }
                                  }
                                  setIsAttachMenuOpen(false);
                                }
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
                                      icon={<RhUiImageFillIcon aria-hidden />}
                                    >
                                      Canvas
                                    </Label>
                                  )}
                                  <Select
                                    isOpen={isModelSelectOpen}
                                    selected={selectedModel}
                                    onSelect={(_event, value) => {
                                      setSelectedModel(String(value));
                                      setIsModelSelectOpen(false);
                                    }}
                                    onOpenChange={setIsModelSelectOpen}
                                    toggle={(toggleRef) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        variant="plainText"
                                        onClick={() => setIsModelSelectOpen((open) => !open)}
                                        isExpanded={isModelSelectOpen}
                                        aria-label={`${selectedModel}, Select a model`}
                                      >
                                        {selectedModel}
                                      </MenuToggle>
                                    )}
                                  >
                                    <SelectList>
                                      {['Granite 7B', 'Granite 8B', 'Llama 3'].map((option) => (
                                        <SelectOption key={option} value={option}>
                                          {option}
                                        </SelectOption>
                                      ))}
                                    </SelectList>
                                  </Select>
                                </>
                              }
                            />
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
                      </DrawerContentBody>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            }
          />
        </div>
      </Chatbot>
    </>
  );
};
