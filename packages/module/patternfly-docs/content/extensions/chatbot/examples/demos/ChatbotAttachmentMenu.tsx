import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import SourceDetailsMenuItem from '@patternfly/chatbot/dist/dynamic/SourceDetailsMenuItem';
import ChatbotAlert from '@patternfly/chatbot/dist/dynamic/ChatbotAlert';
import { Divider, DropdownGroup, DropdownItem, DropdownList, DropEvent } from '@patternfly/react-core';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import { BellIcon, CalendarAltIcon, ClipboardIcon, CodeIcon, UploadIcon } from '@patternfly/react-icons';
import { useDropzone } from 'react-dropzone';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import { cloneElement, FunctionComponent, isValidElement, ReactNode, useState, Children } from 'react';

const initialMenuItems = [
  <DropdownList key="attachment-menu-example-initial-menu-items">
    <DropdownItem value="auth-operator Pod" id="0" className="pf-chatbot-source-details-dropdown-item">
      <SourceDetailsMenuItem
        icon={
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 12.5C0 5.87258 5.37258 0.5 12 0.5C18.6274 0.5 24 5.87258 24 12.5C24 19.1274 18.6274 24.5 12 24.5C5.37258 24.5 0 19.1274 0 12.5Z"
              fill="currentColor"
            />
            <g clipPath="url(#clip0_3280_27488)">
              <path
                d="M8.25 8.75C8.25 7.92266 8.92266 7.25 9.75 7.25H12C14.0719 7.25 15.75 8.92812 15.75 11C15.75 13.0719 14.0719 14.75 12 14.75H9.75V17C9.75 17.4148 9.41484 17.75 9 17.75C8.58516 17.75 8.25 17.4148 8.25 17V14V8.75ZM9.75 13.25H12C13.2422 13.25 14.25 12.2422 14.25 11C14.25 9.75781 13.2422 8.75 12 8.75H9.75V13.25Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_3280_27488">
                <rect width="7.5" height="12" fill="white" transform="translate(8.25 6.5)" />
              </clipPath>
            </defs>
          </svg>
        }
        name="auth-operator"
        type="Pod"
      />
    </DropdownItem>
  </DropdownList>,
  <DropdownGroup key="attachment-menu-example-initial-group">
    <DropdownList>
      <DropdownItem value="Alerts" id="1" icon={<BellIcon />}>
        Alerts
      </DropdownItem>
      <DropdownItem value="Events" id="2" icon={<CalendarAltIcon />}>
        Events
      </DropdownItem>
      <DropdownItem value="Logs" id="3" icon={<ClipboardIcon />}>
        Logs
      </DropdownItem>
      <DropdownItem value="YAML - Status" id="4" icon={<CodeIcon />}>
        YAML - Status
      </DropdownItem>
      <DropdownItem value="YAML - All contents" id="5" icon={<CodeIcon />}>
        YAML - All contents
      </DropdownItem>
    </DropdownList>
  </DropdownGroup>
];

const messages: MessageProps[] = [
  {
    role: 'user',
    content: 'Hello, can you give me an example of what you can do?',
    name: 'User',
    avatar: userAvatar,
    avatarProps: { isBordered: true }
  },
  {
    role: 'bot',
    content: 'I sure can!',
    name: 'Bot',
    avatar: patternflyAvatar
  }
];

export const AttachmentMenuDemo: FunctionComponent = () => {
  const [chatbotVisible, setChatbotVisible] = useState<boolean>(true);
  const [file, setFile] = useState<File>();
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [userFacingMenuItems, setUserFacingMenuItems] = useState<ReactNode>([]);
  const [error, setError] = useState<string>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { open, getInputProps } = useDropzone({
    onDropAccepted: (files: File[]) => {
      setIsLoadingFile(true);
      setIsOpen(false);
      // any custom validation you may want
      if (files.length > 1) {
        setShowAlert(true);
        setFile(undefined);
        setError('Uploaded more than one file.');
        return;
      }
      // this is 25MB in bytes; size is in bytes
      if (files[0].size > 25000000) {
        setShowAlert(true);
        setFile(undefined);
        setError('File is larger than 25MB.');
        return;
      }

      setFile(files[0]);
      setShowAlert(false);
      setError(undefined);
      // this is just for demo purposes, to make the loading state really obvious
      setTimeout(() => {
        setIsLoadingFile(false);
      }, 1000);
    }
  });

  const handleSend = (message) => alert(message);

  // Attachments
  // --------------------------------------------------------------------------
  const handleFileDrop = (event: DropEvent, data: File[]) => {
    setIsOpen(false);
    setFile(data[0]);
    setIsLoadingFile(true);
    setTimeout(() => {
      setIsLoadingFile(false);
    }, 1000);
  };

  const onClose = () => {
    setFile(undefined);
  };

  // Attachmenu menu
  // --------------------------------------------------------------------------
  const uploadMenuItems = [
    <Divider key="divider" />,
    <DropdownList key="list-2">
      <DropdownItem
        onClick={() => {
          open();
          setIsOpen(!isOpen);
        }}
        key="upload"
        value="upload"
        id="upload"
        icon={<UploadIcon />}
      >
        Upload from computer
      </DropdownItem>
    </DropdownList>
  ];

  const onToggleClick = () => {
    setUserFacingMenuItems(initialMenuItems.concat(uploadMenuItems));
  };

  const findMatchingElements = (elements: ReactNode[], targetValue: string) => {
    let matchingElements = [] as ReactNode[];

    elements.forEach((element) => {
      if (isValidElement(element)) {
        // Check if the element's value matches the targetValue
        if (element.props.value && element.props.value.toLowerCase().includes(targetValue.toLowerCase())) {
          matchingElements.push(cloneElement(element, { key: element.props.value }));
        }

        // Recursively check the element's children
        const children = Children.toArray(element.props.children);
        matchingElements = matchingElements.concat(findMatchingElements(children, targetValue));
      }
    });

    return matchingElements;
  };

  const onTextChange = (textValue: string) => {
    if (textValue === '') {
      setUserFacingMenuItems(initialMenuItems.concat(uploadMenuItems));
      return;
    }

    const newMenuItems = findMatchingElements(initialMenuItems, textValue);
    // this is necessary because the React nodes we find traversing the recursive search
    // aren't correctly wrapped in a DropdownList. This leads to problems with the
    // auth-operator item where it winds up floating in a bad place in the DOM and never
    // gets removed
    setUserFacingMenuItems(
      <>
        <DropdownList>
          {newMenuItems.length === 0 ? (
            <DropdownItem key="no-items">No results found</DropdownItem>
          ) : (
            newMenuItems.map((item) => item)
          )}
        </DropdownList>
        {uploadMenuItems.map((item) => item)}
      </>
    );
  };

  // Main return statement
  // --------------------------------------------------------------------------
  return (
    <>
      {/* this is required for react-dropzone to work in Safari and Firefox */}
      <input {...getInputProps()} hidden />
      <ChatbotToggle
        tooltipLabel="Chatbot"
        isChatbotVisible={chatbotVisible}
        onToggleChatbot={() => setChatbotVisible(!chatbotVisible)}
      />
      <Chatbot isVisible={chatbotVisible}>
        <FileDropZone onFileDrop={handleFileDrop}>
          <>
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
              <MessageBar
                onSendMessage={handleSend}
                attachMenuProps={{
                  isAttachMenuOpen: isOpen,
                  setIsAttachMenuOpen: setIsOpen,
                  attachMenuItems: userFacingMenuItems,
                  onAttachMenuSelect: (_ev, value) => {
                    // eslint-disable-next-line no-console
                    console.log('selected', value);
                  },
                  attachMenuInputPlaceholder: 'Search cluster resources...',
                  onAttachMenuInputChange: onTextChange,
                  onAttachMenuToggleClick: onToggleClick
                }}
              />
              <ChatbotFootnote label="ChatBot uses AI. Check for mistakes." />
            </ChatbotFooter>
          </>
        </FileDropZone>
      </Chatbot>
    </>
  );
};
