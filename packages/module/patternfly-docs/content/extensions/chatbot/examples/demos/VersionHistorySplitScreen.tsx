import { useState, useRef, useCallback, useEffect, FunctionComponent, ReactNode } from 'react';
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
  Form,
  FormGroup,
  Label,
  MenuToggle,
  MenuToggleAction,
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
import { ChatbotModal } from '@patternfly/chatbot/dist/dynamic/ChatbotModal';
import { RhUiAiInfoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import { RhUiImageFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import { RhUiAddIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import { RhUiTaskFillIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-task-fill-icon';
import { RhUiHistoryIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-history-icon';
import { RhUiSaveIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-save-icon';
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

const sampleCode = `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
data:
  greeting: Hello, how can I help you today?
`;

const date = new Date();

const longTimestampFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

// RelativeTimeFormat handles the unit, pluralization, and the word "ago" for us, so the list labels
// stay correct without hand-rolled `${count} minute${count === 1 ? '' : 's'}` strings.
const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const GENERATED_WITH_AI_LABEL_ID = 'generated-with-ai-label';
const GENERATED_WITH_AI_TEXT = 'Generated with AI';

// Long enough for a short message to finish being announced, short enough that stale text isn't
// re-read when someone navigates back through the page later.
const ANNOUNCEMENT_CLEAR_DELAY_MS = 10000;

const CANVAS_TITLE = 'Edit code';
const NEW_CANVAS_TITLE = 'Untitled version';

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

// Unnamed saves all start from the same default, so number later ones to keep the list distinguishable.
const getUniqueVersionName = (baseName: string, existingVersions: Version[]) => {
  const existingNames = new Set(existingVersions.map((version) => version.name));
  if (!existingNames.has(baseName)) {
    return baseName;
  }
  let suffix = 2;
  while (existingNames.has(`${baseName} ${suffix}`)) {
    suffix += 1;
  }
  return `${baseName} ${suffix}`;
};

// Copies follow the same pattern so repeated duplicates stay distinguishable. Duplicating an existing
// copy continues its series rather than producing names like "Untitled version (copy) (copy)".
const getUniqueCopyName = (baseName: string, existingVersions: Version[]) => {
  const existingNames = new Set(existingVersions.map((version) => version.name));
  const rootName = baseName.replace(/ \(copy(?: \d+)?\)$/, '');
  let suffix = 1;
  let candidate = `${rootName} (copy)`;
  while (existingNames.has(candidate)) {
    suffix += 1;
    candidate = `${rootName} (copy ${suffix})`;
  }
  return candidate;
};

const iconLogo = (
  <>
    <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
    <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
  </>
);

export const VersionHistorySplitScreen: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [announcement, setAnnouncement] = useState<string>();
  // Version actions have their own live region, rendered in both views, so the message can be
  // announced even when the action switches views (as save and restore do).
  const [versionAnnouncement, setVersionAnnouncement] = useState<string>();
  // Restoring closes a modal; an update made in that same tick can be swallowed while the dialog
  // unmounts and focus is restored, so hold the message until the modal is gone.
  const [pendingVersionAnnouncement, setPendingVersionAnnouncement] = useState<string>();
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
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameVersionId, setRenameVersionId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');
  const [openMenuVersionId, setOpenMenuVersionId] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<Version | null>(null);
  const [isRestoringLatest, setIsRestoringLatest] = useState(false);
  const [isVersionHistoryMenuOpen, setIsVersionHistoryMenuOpen] = useState(false);

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<CanvasEditor>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messageActionsRef = useRef<HTMLButtonElement>(null);
  const canvasCloseButtonRef = useRef<HTMLButtonElement>(null);
  const versionHistoryCloseButtonRef = useRef<HTMLButtonElement>(null);
  const canvasSectionRef = useRef<HTMLElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
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
      const newDate = new Date();
      const newMessages: MessageProps[] = [];
      messages.forEach((message) => newMessages.push(message));
      newMessages.push({
        avatar: userAvatar,
        avatarProps: { isBordered: true },
        id: generateId(),
        name: 'You',
        role: 'user',
        content: input,
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

  // Flush modal announcements only once the dialog has actually left the DOM. aria-modal makes
  // everything outside an open dialog invisible to assistive tech, and a closing modal stays
  // mounted for its exit animation, so announce only after it is gone.
  useEffect(() => {
    if (isRestoreModalOpen || !pendingVersionAnnouncement) {
      return;
    }
    let frameId = 0;
    const announceWhenClosed = () => {
      if (document.querySelector('.pf-v6-c-modal-box')) {
        frameId = window.requestAnimationFrame(announceWhenClosed);
        return;
      }
      setVersionAnnouncement(pendingVersionAnnouncement);
      setPendingVersionAnnouncement(undefined);
    };
    frameId = window.requestAnimationFrame(announceWhenClosed);
    return () => window.cancelAnimationFrame(frameId);
  }, [isRestoreModalOpen, pendingVersionAnnouncement]);

  // A live region keeps its last message in the accessibility tree indefinitely, so clear it once it
  // has had time to be announced. This also lets an identical message be announced again next time,
  // since setting the same text on an unchanged region is otherwise not announced.
  useEffect(() => {
    if (!versionAnnouncement) {
      return;
    }
    const timeoutId = window.setTimeout(() => setVersionAnnouncement(undefined), ANNOUNCEMENT_CLEAR_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [versionAnnouncement]);

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

  const focusVersionHistoryOptionsToggle = () => {
    window.requestAnimationFrame(() => document.getElementById('version-history-options-toggle')?.focus());
  };

  const focusVersionOptionsToggle = (versionId: string) => {
    window.requestAnimationFrame(() => document.getElementById(`version-options-toggle-${versionId}`)?.focus());
  };

  const focusVersionItem = (versionId: string) => {
    window.requestAnimationFrame(() => document.getElementById(`version-${versionId}`)?.focus());
  };

  const handleGeneratedAiLabelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  };

  const openVersionHistory = (availableVersions = versions) => {
    setIsVersionHistoryOpen(true);
    const sortedVersions = [...availableVersions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const latestVersion = sortedVersions[0];
    setSelectedVersionId(latestVersion ? latestVersion.id : null);
    window.requestAnimationFrame(() => document.getElementById('version-history-heading')?.focus());
  };

  const closeVersionHistory = () => {
    setIsVersionHistoryOpen(false);
    setSelectedVersionId(null);
    setIsRenameModalOpen(false);
    setRenameVersionId(null);
    setRenameName('');
    setOpenMenuVersionId(null);
    window.requestAnimationFrame(() => document.getElementById('version-history-split-action')?.focus());
  };

  const handleVersionSelect = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setSelectedVersionId(versionId);
      setVersionAnnouncement(`Version "${version.name}" selected.`);
    }
  };

  const handleRestoreVersion = (versionId: string, isLatest = false) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setVersionToRestore(version);
      setIsRestoringLatest(isLatest);
      setIsRestoreModalOpen(true);
      setOpenMenuVersionId(null);
    }
  };

  const handleRestoreLatestVersion = () => {
    const sortedVersions = [...versions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (sortedVersions.length > 0) {
      handleRestoreVersion(sortedVersions[0].id, true);
    } else {
      setVersionAnnouncement('There are no versions to restore.');
      focusVersionHistoryOptionsToggle();
    }
  };

  const handleSaveCurrentVersion = () => {
    const newVersion: Version = {
      id: `v${Date.now()}`,
      timestamp: new Date(),
      author: 'user',
      authorName: 'You',
      code,
      name: getUniqueVersionName(NEW_CANVAS_TITLE, versions)
    };
    // Generate the name and write the state from the same snapshot so the name stays unique in the
    // list we persist and announce.
    const nextVersions = [newVersion, ...versions];
    setVersions(nextVersions);
    openVersionHistory(nextVersions);
    setVersionAnnouncement(`Version "${newVersion.name}" saved.`);
  };

  const confirmRestore = () => {
    if (versionToRestore) {
      const restoredName = versionToRestore.name;
      setCode(versionToRestore.code);
      setIsRestoreModalOpen(false);
      setVersionToRestore(null);
      closeVersionHistory();
      // Flushed by the effect above once the modal has closed.
      setPendingVersionAnnouncement(
        isRestoringLatest ? `Latest version "${restoredName}" restored.` : `Version "${restoredName}" restored.`
      );
      setIsRestoringLatest(false);
    }
  };

  const cancelRestore = () => {
    const restoreOriginId = versionToRestore?.id;
    setIsRestoreModalOpen(false);
    setVersionToRestore(null);
    setIsRestoringLatest(false);
    if (isVersionHistoryOpen) {
      if (restoreOriginId) {
        focusVersionOptionsToggle(restoreOriginId);
      }
    } else {
      focusVersionHistoryOptionsToggle();
    }
  };

  const formatModalTimestamp = (timestamp: Date) => longTimestampFormatter.format(timestamp);

  const handleStartRename = (versionId: string, currentName: string) => {
    setRenameVersionId(versionId);
    setRenameName(currentName);
    setIsRenameModalOpen(true);
    setOpenMenuVersionId(null);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setRenameVersionId(null);
    setRenameName('');
  };

  const handleSaveRename = () => {
    if (!renameVersionId) {
      return;
    }
    const renamedVersionId = renameVersionId;
    const otherVersions = versions.filter((v) => v.id !== renamedVersionId);
    const nextName = renameName.trim() || getUniqueVersionName(NEW_CANVAS_TITLE, otherVersions);
    // Keep the rename on the same snapshot the name was checked against.
    setVersions(versions.map((v) => (v.id === renamedVersionId ? { ...v, name: nextName } : v)));
    // The open modal hides the page from assistive tech, so hold the message until it closes.
    setPendingVersionAnnouncement(`Version renamed to "${nextName}".`);
    closeRenameModal();
    focusVersionOptionsToggle(renamedVersionId);
  };

  const handleCancelRename = () => {
    const cancelledVersionId = renameVersionId;
    closeRenameModal();
    if (cancelledVersionId) {
      focusVersionOptionsToggle(cancelledVersionId);
    }
  };

  const handleRenameInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveRename();
    }
  };

  const handleDuplicateVersion = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    let duplicatedVersionId = versionId;
    if (version) {
      const newVersion: Version = {
        ...version,
        id: `v${Date.now()}`,
        name: getUniqueCopyName(version.name, versions),
        timestamp: new Date()
      };
      duplicatedVersionId = newVersion.id;
      // Name and state come from one snapshot so the copy name stays unique in the persisted list.
      setVersions([newVersion, ...versions]);
      setSelectedVersionId(newVersion.id);
      setVersionAnnouncement(`Version "${version.name}" duplicated.`);
    }
    setOpenMenuVersionId(null);
    focusVersionItem(duplicatedVersionId);
  };

  const handleMenuToggle = (versionId: string) => {
    setOpenMenuVersionId((prev) => (prev === versionId ? null : versionId));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    // A future timestamp should not read as "Just now".
    if (diff < 0) {
      return longTimestampFormatter.format(timestamp);
    }
    if (diff < MINUTE_MS) {
      return 'Just now';
    }
    if (diff < HOUR_MS) {
      return relativeTimeFormatter.format(-Math.floor(diff / MINUTE_MS), 'minute');
    }
    if (diff < DAY_MS) {
      return relativeTimeFormatter.format(-Math.floor(diff / HOUR_MS), 'hour');
    }
    return longTimestampFormatter.format(timestamp);
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
    />,
    <CodeEditorControl
      key="save"
      icon={<RhUiSaveIcon />}
      aria-label="Save"
      tooltipProps={{ content: 'Save', aria: 'none' }}
      onClick={handleSaveCurrentVersion}
    />
  ];

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  const previewCode = selectedVersion?.code ?? null;

  const canvasTitleHeading = (
    <Title id="chatbot-canvas-title" headingLevel="h2" size="lg">
      {CANVAS_TITLE}
    </Title>
  );

  const versionHistoryPanel = (
    <div className="pf-chatbot__version-history-panel">
      <div className="pf-chatbot__version-history-header">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title id="version-history-heading" headingLevel="h2" size="lg" tabIndex={-1}>
              Version History
            </Title>
          </FlexItem>
          <FlexItem>
            <Tooltip
              content="Close version history"
              triggerRef={versionHistoryCloseButtonRef}
              position="bottom"
              aria="none"
            />
            <Button
              ref={versionHistoryCloseButtonRef}
              variant="plain"
              aria-label="Close version history"
              icon={<RhMicronsCloseIcon />}
              onClick={closeVersionHistory}
            />
          </FlexItem>
        </Flex>
      </div>

      <div className="pf-chatbot__version-history-content">
        <DataList aria-label="Version history list" isCompact>
          {[...versions]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map((version) => (
              <DataListItem
                key={version.id}
                id={version.id}
                className={selectedVersionId === version.id ? 'pf-m-selected' : undefined}
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="primary">
                        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                          <FlexItem>
                            <Button
                              id={`version-${version.id}`}
                              variant="link"
                              isInline
                              className="pf-v6-u-font-weight-bold"
                              aria-current={selectedVersionId === version.id ? 'true' : undefined}
                              onClick={() => handleVersionSelect(version.id)}
                            >
                              {version.name}
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
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
                      </DataListCell>
                    ]}
                  />
                  <DataListAction id={`version-action-${version.id}`}>
                    <Dropdown
                      isOpen={openMenuVersionId === version.id}
                      onOpenChange={(isOpen) => setOpenMenuVersionId(isOpen ? version.id : null)}
                      shouldFocusFirstItemOnOpen
                      toggle={(toggleRef) => (
                        <>
                          <Tooltip content="Version options" triggerRef={toggleRef} position="bottom" aria="none" />
                          <MenuToggle
                            ref={toggleRef}
                            id={`version-options-toggle-${version.id}`}
                            variant="plain"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuToggle(version.id);
                            }}
                            isExpanded={openMenuVersionId === version.id}
                            aria-label={`Version options for ${version.name}`}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        </>
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
            <FlexItem>{canvasTitleHeading}</FlexItem>
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
                  id={GENERATED_WITH_AI_LABEL_ID}
                  isClickable
                  variant="outline"
                  icon={<RhUiAiInfoIcon aria-hidden />}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isGeneratedAiPopoverOpen}
                  onKeyDown={handleGeneratedAiLabelKeyDown}
                >
                  {GENERATED_WITH_AI_TEXT}
                </Label>
              </Popover>
            </FlexItem>
          </Flex>
          <DrawerActions>
            <Dropdown
              isOpen={isVersionHistoryMenuOpen}
              onOpenChange={(isOpen) => setIsVersionHistoryMenuOpen(isOpen)}
              onSelect={() => setIsVersionHistoryMenuOpen(false)}
              shouldFocusFirstItemOnOpen
              popperProps={{ position: 'right' }}
              toggle={(toggleRef) => (
                <>
                  {/*
                    The split-button MenuToggle's ref points at the wrapper <div>; focus lands on the inner
                    caret <button> and the focus event does not bubble, so a tooltip bound to the wrapper never
                    shows on keyboard focus. Target the caret button (the only one with aria-expanded) instead.
                  */}
                  <Tooltip
                    content="Version history options"
                    triggerRef={() => toggleRef.current?.querySelector('button[aria-expanded]') as HTMLElement}
                    position="bottom"
                    aria="none"
                  />
                  <MenuToggle
                    ref={toggleRef}
                    id="version-history-options-toggle"
                    isExpanded={isVersionHistoryMenuOpen}
                    onClick={() => setIsVersionHistoryMenuOpen(!isVersionHistoryMenuOpen)}
                    aria-label="Version history options"
                    splitButtonItems={[
                      <MenuToggleAction
                        id="version-history-split-action"
                        key="version-history-action"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsVersionHistoryMenuOpen(false);
                          openVersionHistory();
                        }}
                      >
                        <span className="pf-chatbot__version-history-action">
                          <RhUiHistoryIcon className="pf-chatbot__version-history-action-icon" aria-hidden />
                          <span>Version history</span>
                        </span>
                      </MenuToggleAction>
                    ]}
                  />
                </>
              )}
            >
              <DropdownList>
                <DropdownItem key="show-full-history" onClick={() => openVersionHistory()}>
                  Show full history
                </DropdownItem>
                <DropdownItem key="restore-latest-version" onClick={handleRestoreLatestVersion}>
                  Restore latest version
                </DropdownItem>
                <DropdownItem key="save-current-version" onClick={handleSaveCurrentVersion}>
                  Save current version
                </DropdownItem>
              </DropdownList>
            </Dropdown>
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

  const restoreModal = (
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
            )}.`}{' '}
            Unsaved changes will be permanently discarded.
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
  );

  const renameModal = (
    <ChatbotModal displayMode={displayMode} isOpen={isRenameModalOpen} onClose={handleCancelRename}>
      <ModalHeader title="Name this version" labelId="chatbot-modal-title" />
      <ModalBody id="chatbot-modal">
        <Form>
          <FormGroup label="Version name" fieldId="rename-version-name" isRequired>
            <TextInput
              isRequired
              ref={renameInputRef}
              id="rename-version-name"
              value={renameName}
              onChange={(_event, value) => setRenameName(value)}
              onKeyDown={handleRenameInputKeyDown}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="save" variant="primary" onClick={handleSaveRename}>
          Save
        </Button>
        <Button key="cancel" variant="link" onClick={handleCancelRename}>
          Cancel
        </Button>
      </ModalFooter>
    </ChatbotModal>
  );

  // Rendered by both views under the same key, so this element stays mounted when an action
  // switches views. A live region that mounts with its text already set is not announced.
  const versionAnnouncementRegion = (
    <div
      key="version-announcement"
      className="pf-chatbot__version-history-announcement pf-chatbot-m-hidden"
      aria-live="polite"
    >
      {versionAnnouncement}
    </div>
  );

  if (isVersionHistoryOpen) {
    return (
      <>
        {versionAnnouncementRegion}
        {restoreModal}
        {renameModal}

        <div className="pf-chatbot__version-history-split-screen-demo">
          <div className="pf-chatbot__version-history-split-canvas pf-chatbot__canvas-panel">
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
                    isCopyEnabled
                    isDownloadEnabled
                    downloadFileName="canvas-mode"
                    code={previewCode ?? code}
                    language={Language.yaml}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="pf-chatbot__version-history-split-panel">{versionHistoryPanel}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {versionAnnouncementRegion}
      {restoreModal}
      {renameModal}

      <input {...getInputProps()} hidden />

      <Chatbot displayMode={displayMode} isVisible={chatbotVisible}>
        <div className="pf-chatbot__canvas pf-chatbot__version-history-demo">
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
