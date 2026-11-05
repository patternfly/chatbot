import React, { useState, useRef, useCallback, useEffect, FunctionComponent, ReactNode } from 'react';
import {
  Brand,
  Button,
  Divider,
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  Select,
  SelectList,
  SelectOption,
  Title,
  Tooltip,
  TextInput,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  DataListAction,
  Content,
  ContentVariants
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
import { RhUiAiInfoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import { RhUiImageFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import { RhUiAddIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import { RhUiTaskFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-task-fill-icon';
import { RhUiHistoryIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-history-icon';
import { CheckIcon } from '@patternfly/react-icons/dist/esm/icons/check-icon';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import { RhUiRedoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-redo-icon';
import { RhUiUndoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-undo-icon';
import { RhUiServerUploadFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-server-upload-fill-icon';
import { RhUiNotificationFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-notification-fill-icon';
import { RhUiCalendarFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-calendar-fill-icon';
import { RhMicronsCloseIcon } from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
import { useDropzone } from 'react-dropzone';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import './VersionHistory.css';

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

interface Version {
  id: string;
  timestamp: Date;
  author: 'user' | 'bot';
  authorName: string;
  code: string;
  name: string;
}

const initialVersions: Version[] = [
  {
    id: 'v1',
    timestamp: new Date(Date.now() - 3600000 * 2),
    author: 'bot',
    authorName: 'Bot',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
data:
  greeting: Hello, how can I help you today?
`,
    name: 'Initial configuration'
  },
  {
    id: 'v2',
    timestamp: new Date(Date.now() - 3600000),
    author: 'user',
    authorName: 'You',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
  labels:
    app: my-app
data:
  greeting: Hello, how can I help you today?
  environment: development
`,
    name: 'Added labels and environment'
  },
  {
    id: 'v3',
    timestamp: new Date(Date.now() - 1800000),
    author: 'bot',
    authorName: 'Bot',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
  labels:
    app: my-app
    version: "1.0"
data:
  greeting: Hello, how can I help you today?
  environment: development
  logLevel: info
`,
    name: 'Bot added version label and logLevel'
  }
];

const iconLogo = (
  <>
    <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
    <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
  </>
);

export const VersionHistorySplitScreenV1: FunctionComponent = () => {
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
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [openMenuVersionId, setOpenMenuVersionId] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<Version | null>(null);
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<CanvasEditor>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messageActionsRef = useRef<HTMLButtonElement>(null);
  const canvasCloseButtonRef = useRef<HTMLButtonElement>(null);
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
    (input: string | number) => {
      const inputStr = String(input);
      const newDate = new Date();
      const newMessages: MessageProps[] = [];
      messages.forEach((message) => newMessages.push(message));
      newMessages.push({
        avatar: userAvatar,
        avatarProps: { isBordered: true },
        id: generateId(),
        name: 'You',
        role: 'user',
        content: inputStr,
        timestamp: `${newDate?.toLocaleDateString()} ${newDate?.toLocaleTimeString()}`
      });
      newMessages.push({
        id: generateId(),
        name: 'Bot',
        role: 'bot',
        timestamp: `${newDate?.toLocaleDateString()} ${newDate?.toLocaleTimeString()}`,
        isLoading: true
      });
      setMessages(newMessages);
      setAnnouncement(`Message from You: ${inputStr}. Message from Bot is loading.`);
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
          timestamp: newDate.toLocaleString()
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

  const handleGeneratedAiLabelKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  };

  const openVersionHistory = () => {
    setIsVersionHistoryOpen(true);
    const sortedVersions = [...versions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (sortedVersions.length > 0) {
      setSelectedVersionId(sortedVersions[0].id);
      setPreviewCode(sortedVersions[0].code);
    } else {
      setSelectedVersionId(null);
      setPreviewCode(null);
    }
  };

  const closeVersionHistory = () => {
    setIsVersionHistoryOpen(false);
    setSelectedVersionId(null);
    setEditingVersionId(null);
    setOpenMenuVersionId(null);
    setPreviewCode(null);
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setPreviewCode(version.code);
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setVersionToRestore(version);
      setIsRestoreModalOpen(true);
      setOpenMenuVersionId(null);
    }
  };

  const confirmRestore = () => {
    if (versionToRestore) {
      setCode(versionToRestore.code);
      setIsRestoreModalOpen(false);
      setVersionToRestore(null);
      closeVersionHistory();
    }
  };

  const cancelRestore = () => {
    setIsRestoreModalOpen(false);
    setVersionToRestore(null);
  };

  const formatModalTimestamp = (timestamp: Date) =>
    timestamp.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    }) +
    ' at ' +
    timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

  const handleStartRename = (versionId: string, currentName: string) => {
    setEditingVersionId(versionId);
    setEditingName(currentName);
    setOpenMenuVersionId(null);
  };

  const handleSaveRename = (versionId: string) => {
    setVersions((prev) => prev.map((v) => (v.id === versionId ? { ...v, name: editingName } : v)));
    setEditingVersionId(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingVersionId(null);
    setEditingName('');
  };

  const handleDuplicateVersion = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      const newVersion: Version = {
        ...version,
        id: `v${Date.now()}`,
        name: `${version.name} (copy)`,
        timestamp: new Date()
      };
      setVersions((prev) => [newVersion, ...prev]);
    }
    setOpenMenuVersionId(null);
  };

  const handleMenuToggle = (versionId: string) => {
    setOpenMenuVersionId((prev) => (prev === versionId ? null : versionId));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    return timestamp.toLocaleString();
  };

  const findMatchingItems = (targetValue: string) => {
    const filteredConversations: { [key: string]: Conversation[] } = Object.entries(initialConversations).reduce(
      (acc: { [key: string]: Conversation[] }, [key, items]) => {
        const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
        if (filteredItems.length > 0) {
          acc[key] = filteredItems;
        }
        return acc;
      },
      {}
    );

    if (Object.keys(filteredConversations).length === 0) {
      return [{ id: '13', noIcon: true, text: 'No results found' }] as unknown as { [key: string]: Conversation[] };
    }
    return filteredConversations;
  };

  const attachMenuItems: ReactNode = (
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
      tooltipProps={{ content: 'Undo', aria: 'none' }}
      onClick={() => editorRef.current?.trigger('keyboard', 'undo', null)}
    />,
    <CodeEditorControl
      key="redo"
      icon={<RhUiRedoIcon />}
      aria-label="Redo"
      tooltipProps={{ content: 'Redo', aria: 'none' }}
      onClick={() => editorRef.current?.trigger('keyboard', 'redo', null)}
    />
  ];

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  const versionHistoryPanel = (
    <div className="version-history-panel">
      <div className="version-history-header">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h2" size="lg">
              Version History
            </Title>
          </FlexItem>
          <FlexItem>
            <Button
              variant="plain"
              aria-label="Close version history"
              icon={<RhMicronsCloseIcon />}
              onClick={closeVersionHistory}
            />
          </FlexItem>
        </Flex>
      </div>

      <div className="version-history-content">
        <DataList aria-label="Version history list" isCompact>
          {[...versions]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map((version) => (
              <DataListItem
                key={version.id}
                id={version.id}
                aria-labelledby={`version-${version.id}`}
                isExpanded={selectedVersionId === version.id}
                className={selectedVersionId === version.id ? 'pf-m-selected' : ''}
                onClick={() => handleVersionSelect(version.id)}
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="primary">
                        {editingVersionId === version.id ? (
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              <TextInput
                                value={editingName}
                                onChange={(_event, value) => setEditingName(value)}
                                aria-label="Version name"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveRename(version.id);
                                  }
                                  if (e.key === 'Escape') {
                                    handleCancelRename();
                                  }
                                }}
                              />
                            </FlexItem>
                            <FlexItem>
                              <Button
                                variant="plain"
                                aria-label="Save name"
                                icon={<CheckIcon />}
                                onClick={() => handleSaveRename(version.id)}
                              />
                            </FlexItem>
                            <FlexItem>
                              <Button
                                variant="plain"
                                aria-label="Cancel rename"
                                icon={<TimesIcon />}
                                onClick={handleCancelRename}
                              />
                            </FlexItem>
                          </Flex>
                        ) : (
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>
                              <Content component={ContentVariants.p} className="pf-v6-u-font-weight-bold">
                                {version.name}
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <Flex
                                spaceItems={{ default: 'spaceItemsSm' }}
                                alignItems={{ default: 'alignItemsCenter' }}
                              >
                                <FlexItem>
                                  <Content component={ContentVariants.small}>
                                    {version.author === 'bot' ? 'Bot' : 'You'} · {formatTimestamp(version.timestamp)}
                                  </Content>
                                </FlexItem>
                                {version.author === 'bot' && (
                                  <FlexItem>
                                    <Label isCompact variant="outline">
                                      AI
                                    </Label>
                                  </FlexItem>
                                )}
                              </Flex>
                            </FlexItem>
                          </Flex>
                        )}
                      </DataListCell>
                    ]}
                  />
                  {editingVersionId !== version.id && (
                    <DataListAction
                      aria-labelledby={`version-${version.id}`}
                      id={`version-action-${version.id}`}
                      aria-label="Version actions"
                    >
                      <Dropdown
                        isOpen={openMenuVersionId === version.id}
                        onOpenChange={(isOpen) => setOpenMenuVersionId(isOpen ? version.id : null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuToggle(version.id);
                            }}
                            isExpanded={openMenuVersionId === version.id}
                            aria-label="Version options"
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        popperProps={{ position: 'right' }}
                      >
                        <DropdownList>
                          <DropdownItem key="name" onClick={() => handleStartRename(version.id, version.name)}>
                            Name this version
                          </DropdownItem>
                          <DropdownItem key="restore" onClick={() => handleRestoreVersion(version.id)}>
                            Restore this version
                          </DropdownItem>
                          <DropdownItem key="duplicate" onClick={() => handleDuplicateVersion(version.id)}>
                            Duplicate
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </DataListAction>
                  )}
                </DataListItemRow>
              </DataListItem>
            ))}
        </DataList>
      </div>
    </div>
  );

  const panelContent = (
    <DrawerPanelContent
      isResizable
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
            <Tooltip content="Version history">
              <Button
                variant="plain"
                aria-label="Version history"
                icon={<RhUiHistoryIcon />}
                onClick={openVersionHistory}
              />
            </Tooltip>
            <Tooltip triggerRef={canvasCloseButtonRef} content="Close canvas" position="bottom" aria="none" />
            <div className="pf-v6-c-drawer__close">
              <Button
                ref={canvasCloseButtonRef}
                variant="plain"
                aria-label="Exit canvas mode"
                icon={<RhMicronsCloseIcon />}
                onClick={closeCanvasMode}
              />
            </div>
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

  // Matches localhost option 2: chatbot hides; canvas + version history side by side
  if (isVersionHistoryOpen) {
    return (
      <>
        <Modal
          isOpen={isRestoreModalOpen}
          onClose={cancelRestore}
          aria-labelledby="restore-modal-title"
          aria-describedby="restore-modal-body"
          variant="small"
          appendTo={document.body}
        >
          <ModalHeader title="Restore this version?" labelId="restore-modal-title" />
          <ModalBody id="restore-modal-body">
            {versionToRestore && (
              <p>
                {`Your current document will revert to the version from ${formatModalTimestamp(
                  versionToRestore.timestamp
                )}.`}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button key="cancel" variant="link" onClick={cancelRestore}>
              Cancel
            </Button>
            <Button key="restore" variant="primary" onClick={confirmRestore}>
              Restore
            </Button>
          </ModalFooter>
        </Modal>

        <div className="version-history-split-screen-demo">
          <div className="version-history-split-canvas pf-chatbot__canvas-panel">
            <section className="pf-chatbot__canvas-section" tabIndex={-1} aria-label="Canvas">
              <div className="pf-chatbot__canvas-head">
                <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="lg">
                      {selectedVersion?.name || 'Edit code'}
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <Label variant="outline" icon={<RhUiAiInfoIcon aria-hidden />}>
                      Preview mode
                    </Label>
                  </FlexItem>
                </Flex>
              </div>
              <div className="pf-chatbot__canvas-panel-body">
                <div className="pf-chatbot__canvas-editor">
                  <CodeEditor
                    isFullHeight
                    isLineNumbersVisible
                    isLanguageLabelVisible
                    isReadOnly
                    code={previewCode || code}
                    language={Language.yaml}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="version-history-split-panel">{versionHistoryPanel}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={cancelRestore}
        aria-labelledby="restore-modal-title"
        aria-describedby="restore-modal-body"
        variant="small"
        appendTo={document.body}
      >
        <ModalHeader title="Restore this version?" labelId="restore-modal-title" />
        <ModalBody id="restore-modal-body">
          {versionToRestore && (
            <p>
              {`Your current document will revert to the version from ${formatModalTimestamp(
                versionToRestore.timestamp
              )}.`}
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button key="cancel" variant="link" onClick={cancelRestore}>
            Cancel
          </Button>
          <Button key="restore" variant="primary" onClick={confirmRestore}>
            Restore
          </Button>
        </ModalFooter>
      </Modal>

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
