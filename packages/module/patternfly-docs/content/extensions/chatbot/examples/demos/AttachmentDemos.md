---
# Sidenav top-level section
# should be the same for all markdown files
section: PatternFly-AI
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: Messages
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: demo
sourceLink: https://github.com/patternfly/chatbot/blob/main/packages/module/patternfly-docs/content/extensions/chatbot/examples/demos/demos.md
---

import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import SourceDetailsMenuItem from '@patternfly/chatbot/dist/dynamic/SourceDetailsMenuItem';
import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
import { BellIcon, CalendarAltIcon, ClipboardIcon, CodeIcon, UploadIcon } from '@patternfly/react-icons';
import { useDropzone } from 'react-dropzone';
import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import ChatbotHeader, {
ChatbotHeaderMenu,
ChatbotHeaderMain,
ChatbotHeaderTitle,
ChatbotHeaderActions,
ChatbotHeaderSelectorDropdown,
ChatbotHeaderOptionsDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import ChatbotAlert from '@patternfly/chatbot/dist/dynamic/ChatbotAlert';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import { FunctionComponent, useState, useRef, isValidElement, cloneElement, Children, ReactNode, MouseEvent } from 'react';
import { getTrackingProviders } from "@patternfly/chatbot/dist/dynamic/tracking";
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';

## Demos

### Message feedback

When a user selects a positive or negative message action, you can display a message feedback card that acknowledges their response and provides space for additional written feedback. These cards can be manually dismissed via the close button and the thank-you card can be configured to time out automatically.

The following example demonstrates a full feedback flow, which accepts written feedback submission and displays a thank you card.

It also demonstrates how to handle focus appropriately for accessibility. The card will be focused when it appears in the DOM. When the card closes, place the focus back on the launching button. To provide additional context on what the button controls, you can also add `aria-expanded` and `aria-controls` attributes to the feedback buttons.

It is also important to announce when new content appears onscreen for accessibility purposes. `isLiveRegion` is set to true by default on `<Message>` so it will make appropriate announcements for you when the feedback card appears.

```js file="./Feedback.tsx"

```

### Message auto-scrolling

This demo displays automatic scrolling to the bottom of the MessageBox:

1. [`<MessageBox>`](/patternfly-ai/chatbot/ui#message-box) component provides an optional smart scroll behavior via the `enableSmartScroll` prop.

#### `enableSmartScroll` (optional)

When enabled:

- Scroll position is automatically managed based on user interaction.
- Scrolling is _not_ forced to the bottom on new messages unless explicitly triggered via the `scrollToBottom()` method.
- If the user scrolls up or interacts with UI controls like "Back to top" or "Back to bottom", the component pauses auto-scroll to respect user intent.
- Auto-scroll resumes only when the user scrolls back down manually or programmatically via the `scrollToBottom({resumeSmartScroll: true})` method.

#### Imperative Methods via `ref`

When using `ref`, the component exposes the following methods:

- `scrollToBottom()` – Scrolls to the bottom of the message container.
- `scrollToTop()` – Scrolls to the top of the message container.
- `isSmartScrollActive()` – Returns `true` if smart auto-scroll is currently active.
- Native `HTMLDivElement` methods like `scrollTo()` are also available.

This demo includes broader ChatBot features, including:

1. A [`<ChatbotToggle>`](/patternfly-ai/chatbot/ui#toggle) that controls the [`<Chatbot>`](/patternfly-ai/chatbot/ui#container) container.
2. A `<ChatbotContent>` and [`<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) with:
   - A `<ChatbotWelcomePrompt>`
   - An initial user message and initial bot message
3. A [`<ChatbotFooter>`](/patternfly-ai/chatbot/ui#footer) with a [`<ChatbotFootnote>`](/patternfly-ai/chatbot/ui#footnote-with-popover) and a `<MessageBar>`

```js file="./ChatbotScrolling.tsx" isFullscreen

```

### Attach via upload button in message bar

This demo displays unique attachment features, including:

1. [`<ChatbotContent>` and `<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) components that contain:
   - An initial [user `<Message>`](/patternfly-ai/chatbot/messages#user-messages) with an attachment.
   - The ability to preview or edit the attachment using the [`<PreviewAttachment>` and `<AttachmentEdit>` components.](/patternfly-ai/chatbot/messages##file-attachments)
   - A [PatternFly `<Alert>`](/components/alert), customized to be sticky within the ChatBot window, which provides success or error messages for attachments.
2. `<ChatbotContent>` and `<ChatbotFooter>`, wrapped in a `<FileDropZone>` component to support drag and drop attachments. The footer also:
   - Displays attached files, using a [`<FileDetailsLabel>`](/patternfly-ai/chatbot/messages#attachment-label) component.
   - Demonstrates custom handling of file uploads, using the `handleAttach` in `<MessageBar>` and `handleFileDrop` in `<FileDropZone>`.

This demo includes broader ChatBot features, including:

1. A [`<ChatbotToggle>`](/patternfly-ai/chatbot/ui#toggle) that controls the [`<Chatbot>`](/patternfly-ai/chatbot/ui#container) container.
2. A [`<ChatbotHeader>`](/patternfly-ai/chatbot/ui#header) that updates based on the display mode, with sub-components (including a `<ChatbotHeaderTitle>`).
3. The ability to swap display modes via the `<ChatbotHeaderOptionsDropdown>`
4. A `<ChatbotContent>` and [`<MessageBox>`](/patternfly-ai/chatbot/uir#content-and-message-box) with:
   - A `<ChatbotWelcomePrompt>`
   - The ability to preview or edit the attachment.
   - An initial bot message
5. A [`<ChatbotFooter>`](/patternfly-ai/chatbot/ui#footer) with a [`<ChatbotFootnote>`](/patternfly-ai/chatbot/ui#footnote-with-popover) and a `<MessageBar>`

```js file="./ChatbotAttachment.tsx" isFullscreen

```

### Attach via menu of options in message bar

This demo displays unique attachment features, including:

1. [`<ChatbotContent>` and `<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) components that contain:
   - A PatternFly [`<Alert>`](/components/alert) to provide success or error messages for attachments.
2. `<ChatbotContent>` and `<ChatbotFooter>`, wrapped in a `<FileDropZone>` component to support drag and drop attachments. The footer also:

   - Displays attached files, using a [`<FileDetailsLabel>`](/patternfly-ai/chatbot/ui#attachment-label) component.
   - Demonstrates custom handling of file uploads, using the `handleAttach` in `<MessageBar>` and `handleFileDrop` in `<FileDropZone>`.
   - Demonstrates how to define the `attachMenuProps` in the `<MessageBar>` to create a menu that allows users to select the source of an item they're attaching.

This demo includes broader ChatBot features, including:

1. A [`<ChatbotToggle>`](/patternfly-ai/chatbot/ui#toggle) that controls the [`<Chatbot>`](/patternfly-ai/chatbot/ui#container) container.
2. A `<ChatbotContent>` and [`<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) with:
   - A `<ChatbotWelcomePrompt>`
   - An initial user message and initial bot message
3. A [`<ChatbotFooter>`](/patternfly-ai/chatbot/ui#footer) with a [`<ChatbotFootnote>`](/patternfly-ai/chatbot/ui#footnote-with-popover) and a `<MessageBar>`

```js file="./ChatbotAttachmentMenu.tsx" isFullscreen

```
