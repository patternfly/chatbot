---
id: Canvas
section: patterns
source: demo
---

import { useState, useRef, useCallback, useEffect, FunctionComponent, ReactNode } from 'react';
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
DropdownItem,
DropdownList,
Flex,
FlexItem,
Label,
MenuToggle,
Nav,
NavItem,
NavList,
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
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {
ChatbotHeaderActions,
ChatbotHeaderCloseButton,
ChatbotHeaderMain,
ChatbotHeaderMenu,
ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import SettingsForm from '@patternfly/chatbot/dist/dynamic/Settings';
import RhUiImageFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-image-fill-icon';
import RhUiAddIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-add-icon';
import RhUiTaskFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-task-fill-icon';
import RhUiEditFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-edit-fill-icon';
import RhUiSettingsFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-settings-fill-icon';
import RhUiUploadIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-upload-icon';
import RhUiCopyFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-copy-fill-icon';
import RhUiDownloadIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-download-icon';
import RhUiPlayFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-play-fill-icon';
import RhUiBackupIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-backup-icon';
import RhUiNotificationFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-notification-fill-icon';
import RhUiCalendarFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-calendar-fill-icon';
import RhUiSaveIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-save-icon';
import RhUiRedoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-redo-icon';
import RhUiUndoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-undo-icon';
import RhUiServerUploadFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-server-upload-fill-icon';
import RhUiAiInfoIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import RhMicronsCloseIcon from '@patternfly/react-icons/dist/esm/icons/rh-microns-close-icon';
import { useDropzone } from 'react-dropzone';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';

**Canvas** lets users work with generated or editable content alongside a conversation. Canvas content is fully flexible, allowing you to render any content suitable for your use case. It is recommended to only utilize canvas mode with a fullscreen Chatbot.

## Composable structure

When utilizing a canvas layout, it's recommended to use a PatternFly [drawer](/components/drawer). You must apply the `pf-chatbot__canvas*` classes from `@patternfly/chatbot` so the drawer matches ChatBot backgrounds and fills the fullscreen layout.

The general recommended structure is as follows:

```noLive
<Chatbot displayMode={ChatbotDisplayMode.fullscreen}>
  <div className="pf-chatbot__canvas">
    <Drawer className="pf-chatbot__canvas-drawer" isExpanded={...} isInline position="end">
      <DrawerContent panelContent={/* CodeEditor or other canvas content */}>
        <DrawerContentBody className="pf-chatbot__canvas-body">
          <div className="pf-chatbot__canvas-column">
            <ChatbotHeader .../>
            <ChatbotContent ... />
            <ChatbotFooter ... >
          </div>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  </div>
</Chatbot>
```

## Class names

| Class name                      | Purpose                                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| `pf-chatbot__canvas`            | Container for the fullscreen canvas layout and its background.        |
| `pf-chatbot__canvas-drawer`     | Styles the drawer that contains the canvas panel.                     |
| `pf-chatbot__canvas-section`    | Styles the section used within the drawer for focus.                  |
| `pf-chatbot__canvas-body`       | Ensures the drawer content body fills the available height.           |
| `pf-chatbot__canvas-column`     | Arranges the canvas header, content, and footer vertically.           |
| `pf-chatbot__canvas-panel`      | Styles the canvas drawer panel and removes the default panel spacing. |
| `pf-chatbot__canvas-panel-body` | Provides the canvas panel content area and its spacing.               |
| `pf-chatbot__canvas-head`       | Styles and positions the canvas panel header and close action.        |
| `pf-chatbot__canvas-editor`     | Makes the code editor fill the available canvas space.                |
| `pf-chatbot__canvas-docked-nav` | Optional vertical navigation rail for a canvas layout.                |

## Demos

### With code editor

This demo shows canvas mode being used to render a PatternFly [code editor](/components/code-editor). Canvas mode is launched by clicking a file chip below a message or the "Canvas" label below the message bar. You can also enable or disable canvas mode from the attach menu and dismiss the label to exit canvas mode.

```js file="./Canvas.tsx" isFullscreen

```

### With docked navigation

This demo shows canvas mode with an optional docked navigation rail. The rail can toggle chat history and start a new chat without closing the canvas.

```js file="./CanvasWithDockedNav.tsx" isFullscreen

```
