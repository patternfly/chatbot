import { useRef, useState } from 'react';
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
import { RhUiCopyFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-copy-fill-icon';
import { RhUiDownloadIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-download-icon';
import { RhUiEditFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import { RhUiImageFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import { RhUiBackupIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-backup-icon';
import { RhUiPlayFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-play-fill-icon';
import { RhUiSettingsFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import { RhUiUploadIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-upload-icon';
import { RhMicronsCloseIcon } from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import userAvatar from '../Messages/user_avatar.svg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const sampleCode = `<!DOCTYPE html>
<html>
  <body>
    <p>This is a paragraph.</p>
    <p>This is another paragraph.</p>
  </body>
</html>`;

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
  }
];

const conversations = [
  { id: '1', text: 'Canvas mode enabled - I want to live edit code' },
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

export const CanvasWithDockedNavDemo = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [code, setCode] = useState(sampleCode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Granite 7B');
  const [announcement, setAnnouncement] = useState();
  const newChatRef = useRef<HTMLAnchorElement>(null);

  const startNewChat = () => {
    setMessages([]);
    setIsDrawerOpen(false);
    setAreSettingsOpen(false);
  };

  const sendMessage = (content) => {
    const message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      name: 'You',
      avatar: userAvatar,
      avatarProps: { isBordered: true },
      timestamp: new Date().toLocaleTimeString()
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
            />
          </MastheadContent>
        </Masthead>
      </div>
    </>
  );

  const editorControls = [
    { icon: <RhUiUploadIcon />, label: 'Upload' },
    { icon: <RhUiCopyFillIcon />, label: 'Copy' },
    { icon: <RhUiDownloadIcon />, label: 'Download' },
    { icon: <RhUiPlayFillIcon />, label: 'Run' },
    { icon: <RhUiBackupIcon />, label: 'Backup' }
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
              <Label variant="outline" icon={<RhUiImageFillIcon aria-hidden />}>
                Generated with AI
              </Label>
            </FlexItem>
          </Flex>
          <DrawerActions>
            <DrawerCloseButton aria-label="Exit canvas mode" onClose={() => setIsCanvasOpen(false)} />
          </DrawerActions>
        </DrawerHead>
        <div className="pf-chatbot__canvas-panel-body">
          <div className="pf-chatbot__canvas-editor">
            <CodeEditor
              isFullHeight
              isLineNumbersVisible
              isLanguageLabelVisible
              downloadFileName="canvas-mode"
              customControls={editorControls}
              code={code}
              language={Language.html}
              onCodeChange={setCode}
            />
          </div>
        </div>
      </section>
    </DrawerPanelContent>
  );

  return (
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
            <div className="pf-chatbot__canvas">
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
                              <Message key={message.id} {...message} />
                            ))}
                          </MessageBox>
                        </ChatbotContent>
                        <ChatbotFooter className="pf-chatbot__canvas-chat-footer">
                          <MessageBar
                            onSendMessage={sendMessage}
                            attachButtonPosition="start"
                            alwayShowSendButton
                            buttonProps={{
                              attach: {
                                icon: <RhUiAddIcon />,
                                tooltipContent: 'Message actions',
                                'aria-label': 'Message actions'
                              }
                            }}
                            additionalActions={
                              <>
                                <Label icon={<RhUiImageFillIcon aria-hidden />}>Canvas</Label>
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
                          <ChatbotFootnote label="Always review AI-generated content prior to use." />
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
  );
};
