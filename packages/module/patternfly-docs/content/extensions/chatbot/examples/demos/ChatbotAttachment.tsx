import { useState, FunctionComponent, MouseEvent } from 'react';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import { Brand, Bullseye, DropdownGroup, DropdownItem, DropdownList, DropEvent } from '@patternfly/react-core';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
import ChatbotHeader, {
  ChatbotHeaderMenu,
  ChatbotHeaderTitle,
  ChatbotHeaderActions,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderMain
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import ChatbotAlert from '@patternfly/chatbot/dist/dynamic/ChatbotAlert';
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

interface ModalData {
  code: string;
  fileName: string;
}

export const BasicDemo: FunctionComponent = () => {
  const onAttachmentClose = (event, name, id) => {
    const updatedMessages: MessageProps[] = [];
    messages.map((message) => {
      if (message.attachments) {
        const filteredAttachments = message.attachments.filter((attachment) => attachment.id !== id);
        message.attachments = filteredAttachments;
        updatedMessages.push(message);
      } else {
        updatedMessages.push(message);
      }
    });
    setMessages(updatedMessages);
  };

  const onAttachmentClick = () => {
    setCurrentModalData({ fileName: 'auth-operator.yml', code: 'test' });
    setIsEditModalOpen(false);
    setIsPreviewModalOpen(true);
  };

  const initialMessages: MessageProps[] = [
    {
      role: 'user',
      content: "I'm referring to this attachment for added context in our conversation.",
      name: 'User',
      avatar: userAvatar,
      avatarProps: { isBordered: true },
      attachments: [{ name: 'auth-operator.yml', id: '1', onClick: onAttachmentClick, onClose: onAttachmentClose }]
    },
    {
      role: 'bot',
      content: 'Great, I can reference this attachment throughout our conversation.',
      avatar: patternflyAvatar,
      name: 'Bot'
    }
  ];

  const [error, setError] = useState<string>();
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(true);
  const [file, setFile] = useState<File>();
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentModalData, setCurrentModalData] = useState<ModalData>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<ChatbotDisplayMode>(ChatbotDisplayMode.default);

  const onSelectDisplayMode = (
    _event: MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setDisplayMode(value as ChatbotDisplayMode);
  };

  const handleSend = (message) => alert(message);

  // Attachments
  // --------------------------------------------------------------------------
  // example of how you can read a text file
  const readFile = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
      // you can use reader.readAsText(file) for human-readable file types;
    });

  // handle file drop/selection
  const handleFile = (fileArr: File[]) => {
    setIsLoadingFile(true);
    // any custom validation you may want
    if (fileArr.length > 1) {
      setShowAlert(true);
      setFile(undefined);
      setError('Uploaded more than one file.');
      return;
    }
    // this is 25MB in bytes; size is in bytes
    if (fileArr[0].size > 25000000) {
      setShowAlert(true);
      setFile(undefined);
      setError('File is larger than 25MB.');
      return;
    }

    readFile(fileArr[0])
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log(data);
        setFile(fileArr[0]);
        setShowAlert(false);
        setError(undefined);
        // this is just for demo purposes, to make the loading state really obvious
        setTimeout(() => {
          setIsLoadingFile(false);
        }, 1000);
      })
      .catch((error: DOMException) => {
        setError(`Failed to read file: ${error.message}`);
      });
  };

  const handleFileDrop = (event: DropEvent, data: File[]) => {
    handleFile(data);
  };

  const handleAttach = (data: File[]) => {
    handleFile(data);
  };

  const onClose = () => {
    setFile(undefined);
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

  return (
    <>
      <ChatbotToggle
        tooltipLabel="Chatbot"
        isChatbotVisible={chatbotVisible}
        onToggleChatbot={() => {
          setChatbotVisible(!chatbotVisible);
          setIsEditModalOpen(false);
          setIsPreviewModalOpen(false);
        }}
      />
      <Chatbot isVisible={chatbotVisible} displayMode={displayMode}>
        <ChatbotHeader>
          <ChatbotHeaderMain>
            <ChatbotHeaderMenu onMenuToggle={() => alert('Menu toggle clicked')} />
            <ChatbotHeaderTitle displayMode={displayMode} showOnFullScreen={horizontalLogo} showOnDefault={iconLogo} />
          </ChatbotHeaderMain>
          <ChatbotHeaderActions>
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
        <FileDropZone
          onFileDrop={handleFileDrop}
          displayMode={displayMode}
          infoText="Allowed file types are .json, .txt and .yaml and maximum file size is 25 MB."
          allowedFileTypes={{
            'text/plain': ['.txt'],
            'application/json': ['.json'],
            'application/yaml': ['.yaml', '.yml']
          }}
        >
          <ChatbotContent>
            <MessageBox>
              {showAlert && (
                <ChatbotAlert
                  variant="danger"
                  onClose={() => {
                    setShowAlert(false);
                    setError(undefined);
                  }}
                  title="File upload failed"
                >
                  {error}
                </ChatbotAlert>
              )}
              <ChatbotWelcomePrompt title="Hi, ChatBot User!" description="How can I help you today?" />
              {messages.map((message) => (
                <Message key={message.name} {...message} />
              ))}
            </MessageBox>
          </ChatbotContent>
          <ChatbotFooter>
            {file && (
              <div>
                <FileDetailsLabel fileName={file.name} isLoading={isLoadingFile} onClose={onClose} />
              </div>
            )}
            <MessageBar onSendMessage={handleSend} hasAttachButton handleAttach={handleAttach} />
            <ChatbotFootnote label="ChatBot uses AI. Check for mistakes." />
          </ChatbotFooter>
        </FileDropZone>
      </Chatbot>
      {currentModalData && (
        <PreviewAttachment
          code={currentModalData?.code}
          fileName={currentModalData?.fileName}
          isModalOpen={isPreviewModalOpen}
          onEdit={() => {
            setIsPreviewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDismiss={() => setCurrentModalData(undefined)}
          handleModalToggle={() => setIsPreviewModalOpen(false)}
          displayMode={displayMode}
        />
      )}
      {currentModalData && (
        <AttachmentEdit
          code={currentModalData?.code}
          fileName={currentModalData?.fileName}
          isModalOpen={isEditModalOpen}
          onSave={() => {
            setIsEditModalOpen(false);
          }}
          onCancel={() => setCurrentModalData(undefined)}
          handleModalToggle={() => setIsEditModalOpen(false)}
          displayMode={displayMode}
        />
      )}
    </>
  );
};
