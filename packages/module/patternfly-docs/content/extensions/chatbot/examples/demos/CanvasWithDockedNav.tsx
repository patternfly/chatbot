import { useState } from 'react';
import {
  Avatar,
  Brand,
  Divider,
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
  MenuToggle,
  Nav,
  NavItem,
  NavList,
  Select,
  SelectList,
  SelectOption,
  Title
} from '@patternfly/react-core';
import { CodeEditor, CodeEditorControl, Language } from '@patternfly/react-code-editor';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { RhUiAddIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import { RhUiCopyFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-copy-fill-icon';
import { RhUiDownloadIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-download-icon';
import { RhUiEditFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import { RhUiImageFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import { RhUiBackupIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-backup-icon';
import { RhUiPlayFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-play-fill-icon';
import { RhUiSettingsFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import { RhUiUploadIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-upload-icon';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
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

const iconLogo = (
  <>
    <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
    <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
  </>
);

export const CanvasWithDockedNavDemo = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [code, setCode] = useState(sampleCode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Granite 7B');
  const [announcement, setAnnouncement] = useState();

  const startNewChat = () => {
    setMessages([]);
    setIsDrawerOpen(false);
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
    <Nav variant="docked" aria-label="Canvas navigation" className="pf-chatbot__canvas-docked-nav pf-v6-u-h-100">
      <Flex direction={{ default: 'column' }} className="pf-v6-u-h-100 pf-v6-u-p-sm">
        <NavList>
          <NavItem
            itemId="history"
            isActive={isDrawerOpen}
            icon={<BarsIcon />}
            component="button"
            preventDefault
            onClick={() => setIsDrawerOpen((open) => !open)}
          >
            Chat history
          </NavItem>
        </NavList>
        <Brand
          className="pf-v6-u-my-md"
          src={PFIconLogoColor}
          alt="PatternFly"
          widths={{ default: '37px' }}
          heights={{ default: '37px' }}
        />
        <Divider />
        <NavList>
          <NavItem
            itemId="new-chat"
            icon={<RhUiEditFillIcon />}
            component="button"
            preventDefault
            onClick={startNewChat}
          >
            New chat
          </NavItem>
        </NavList>
        <NavList className="pf-v6-u-mt-auto">
          <NavItem itemId="settings" icon={<RhUiSettingsFillIcon />} component="button" preventDefault>
            Settings
          </NavItem>
        </NavList>
        <Avatar className="pf-v6-u-mt-md pf-v6-u-mb-md pf-v6-u-mx-auto" src={userAvatar} alt="User profile" size="md" />
      </Flex>
    </Nav>
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
            <Drawer isExpanded={isCanvasOpen} isInline position="end">
              <DrawerContent panelContent={canvasPanel}>
                <DrawerContentBody className="pf-chatbot__canvas-body">
                  <div className="pf-chatbot__canvas-column">
                    <ChatbotHeader>
                      <ChatbotHeaderMain>
                        <ChatbotHeaderMenu
                          aria-expanded={isDrawerOpen}
                          onMenuToggle={() => setIsDrawerOpen((open) => !open)}
                          tooltipContent="Chat history"
                          menuAriaLabel="Chat history"
                        />
                        <ChatbotHeaderTitle>{iconLogo}</ChatbotHeaderTitle>
                      </ChatbotHeaderMain>
                    </ChatbotHeader>
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
          }
        />
      </div>
    </Chatbot>
  );
};
