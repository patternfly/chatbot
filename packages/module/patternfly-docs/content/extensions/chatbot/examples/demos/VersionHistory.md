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
import RhUiSaveIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-save-icon';
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

**Version history** allows users to view, compare, and restore previous versions of AI-generated or user-edited content in canvas mode. This pattern is essential for collaborative AI workflows where users need to track changes over time and recover earlier states of their work. It is recommended to use version history and canvas mode in full width and fullscreen layouts only.

## Use cases

Version history is useful when:
- Users need to track changes made by both AI and humans over time
- Users want to restore a previous version of their work
- Users need to compare different iterations of AI-generated content
- Teams collaborate on AI-assisted documents or code

## Version list features

Each version in the list displays:
- **Version name**: A user editable name for each version
- **Author**: Who created the version (user or AI bot)
- **Timestamp**: Meta data that displays relative time since the version was created
- **AI label**: A badge indicating AI-generated edits

Version actions include:
- **Name this version**: Rename a version for easier identification
- **Restore this version**: Revert the canvas to a past version's content
- **Duplicate**: Create a copy of the version

## Class names

This demo reuses the [canvas](/patterns/canvas) `pf-chatbot__canvas*` classes from `@patternfly/chatbot` for the canvas and editor chrome. The classes below are defined in this demo's stylesheet (`VersionHistory.css`) and are used for the version history panel and split-screen layout. They are not exported from `@patternfly/chatbot`.

| Class name                          | Purpose                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `version-history-panel`             | Flex column container for the version history panel and its spacing.    |
| `version-history-header`            | Styles the panel header and its bottom border.                          |
| `version-history-content`           | Scrollable area that holds the version list.                            |
| `version-history-split-screen-demo` | Full-viewport flex row that hosts the split-screen layout.              |
| `version-history-split-canvas`      | Left pane that contains the read-only canvas preview.                   |
| `version-history-split-panel`       | Fixed-width right pane that contains the version history panel.         |

## Demo

### Fullscreen version history

This demo shows a read-only code preview (canvas view) on the left and version history list on the right, utilizing a split-screen layout. Open the version history with the split menu toggle in the canvas panel header (next to close)—click the main button or **Show full history** in the dropdown. The chatbot panel is automatically hidden when the version history toggle is triggered. Close the version history with the X icon button to return to the chatbot and canvas.

```js file="./VersionHistorySplitScreen.tsx" isFullscreen

```
