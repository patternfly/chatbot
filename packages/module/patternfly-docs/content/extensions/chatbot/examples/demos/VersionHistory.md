---
id: Version history
section: patterns
source: demo
---

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
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
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
import RhUiHistoryIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-history-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import RhUiRedoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-redo-icon';
import RhUiUndoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-undo-icon';
import RhUiServerUploadFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-server-upload-fill-icon';
import RhUiNotificationFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-notification-fill-icon';
import RhUiCalendarFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-calendar-fill-icon';
import RhMicronsCloseIcon from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
import { useDropzone } from 'react-dropzone';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';

**Version history** allows users to view, compare, and restore previous versions of AI-generated or user-edited content in canvas mode. This pattern is essential for collaborative AI workflows where users need to track changes over time and recover earlier states of their work.

## Use cases

Version history is useful when:
- Users need to track changes made by both AI and humans over time
- Users want to restore a previous version of their work
- Users need to compare different iterations of AI-generated content
- Teams collaborate on AI-assisted documents or code

## Version list features

Each version in the list displays:
- **Version name**: A user-editable name for the version
- **Author**: Who created the version (user or AI bot)
- **Timestamp**: Relative time since the version was created
- **AI label**: A badge indicating AI-generated versions

Version actions include:
- **Name this version**: Rename a version for easier identification
- **Restore this version**: Revert the canvas to this version's content
- **Duplicate**: Create a copy of the version

## Demos

### Split-screen

Matches the canvas split-screen layout: chatbot and canvas side by side by default. Open version history with the **Version history** split button in the canvas panel header (next to close)—click the main button or **Show full history** in the dropdown. The chatbot hides and the screen splits into a read-only code preview on the left and version history on the right. Close with the X to return to the chatbot and canvas.

```js file="./VersionHistorySplitScreen.tsx" isFullscreen

```

### Split-screen (v1)

Previous trigger: a plain history icon button in the canvas header. Kept for comparison.

```js file="./VersionHistorySplitScreenV1.tsx" isFullscreen

```
