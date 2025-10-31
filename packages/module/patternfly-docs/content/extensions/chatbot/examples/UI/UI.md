---
# Sidenav top-level section
# should be the same for all markdown files
section: PatternFly-AI
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: UI
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: react
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
propComponents:
  [
    'Chatbot',
    'ChatbotContent',
    'MessageBox',
    'ChatbotWelcomePrompt',
    'WelcomePrompt',
    'ChatbotToggle',
    'ChatbotHeader',
    'ChatbotHeaderMain',
    'ChatbotHeaderMenu',
    'ChatbotHeaderActions',
    'ChatbotHeaderTitle',
    'ChatbotHeaderOptionsDropdown',
    'ChatbotHeaderSelectorDropdown',
    'ChatbotFooter',
    'MessageBar',
    'ChatbotFootnote',
    'ChatbotFootnotePopover',
    'ChatbotFootnotePopoverCTA',
    'ChatbotFootnotePopoverBannerImage',
    'ChatbotFootnotePopoverLink',
    'MessageBarWithAttachMenuProps',
    'SourceDetailsMenuItem',
    'ChatbotConversationHistoryNav',
    'Conversation'
  ]
sortValue: 2
---

import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
import FileDetails from '@patternfly/chatbot/dist/dynamic/FileDetails';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import { PreviewAttachment } from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import ChatbotAlert from '@patternfly/chatbot/dist/dynamic/ChatbotAlert';
import TermsOfUse from '@patternfly/chatbot/dist/dynamic/TermsOfUse';
import {
ChatbotHeader,
ChatbotHeaderCloseButton,
ChatbotHeaderMain,
ChatbotHeaderMenu,
ChatbotHeaderActions,
ChatbotHeaderTitle,
ChatbotHeaderOptionsDropdown,
ChatbotHeaderSelectorDropdown,
ChatbotHeaderNewChatButton
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { ChatbotFooter, ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import SourceDetailsMenuItem from '@patternfly/chatbot/dist/dynamic/SourceDetailsMenuItem';
import { ChatbotModal } from '@patternfly/chatbot/dist/dynamic/ChatbotModal';
import SettingsForm from '@patternfly/chatbot/dist/dynamic/Settings';
import { BellIcon, CalendarAltIcon, ClipboardIcon, CodeIcon, ThumbtackIcon, UploadIcon } from '@patternfly/react-icons';
import { useDropzone } from 'react-dropzone';

import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { DropdownItem, DropdownList, Checkbox } from '@patternfly/react-core';

import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import CogIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import PenToSquareIcon from '@patternfly/react-icons/dist/esm/icons/pen-to-square-icon';
import PFHorizontalLogoColor from './PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from './PF-HorizontalLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import termsAndConditionsHeader from './PF-TermsAndConditionsHeader.svg';
import { CloseIcon, SearchIcon, OutlinedCommentsIcon } from '@patternfly/react-icons';
import { FunctionComponent, FormEvent, useState, useRef, MouseEvent, isValidElement, cloneElement, Children, ReactNode, Ref, MouseEvent as ReactMouseEvent, CSSProperties, useEffect} from 'react';
import FilePreview from '@patternfly/chatbot/dist/dynamic/FilePreview';

## Structure

### Container

The PatternFly ChatBot is a separate window that overlays or is embedded within other UI content. This container can be shown and hidden via [the ChatBot toggle.](/patternfly-ai/chatbot/ui#toggle)

The `<Chatbot>` component is the container that encompasses the ChatBot experience. It adapts to various display modes (overlay/default, docked, fullscreen, and embedded) and supports both light and dark themes.

The "embedded" display mode is meant to be used within a [PatternFly page](/components/page) or other container within your product.

```js file="./ChatbotContainer.tsx" isFullscreen

```

### Content and message box

The `<ChatbotContent>` component is the container that is placed within the `<Chatbot>`, between the [`<ChatbotHeader>`](/patternfly-ai/chatbot/ui#header) and [`<ChatbotFooter>`.](/patternfly-ai/chatbot/ui#footer)

`<ChatbotContent>` usually contains a `<ChatbotMessageBox>` for displaying messages.

Your code structure should look like this:

```noLive
<Chatbot>
  <ChatbotHeader ... />
  <ChatbotContent>
    <ChatbotMessageBox>
    ...
    <ChatbotMessageBox>
  </ChatbotContent>
  <ChatbotFooter ... />
</Chatbot>
```

**Note**: When messages update, it is important to announce new messages to users of assistive technology. To do this, make sure to set the `announcement` prop on `<MessageBox>` whenever you display a new message in `<MessageBox>`. You can view this in action in our [basic ChatBot](/patternfly-ai/chatbot/overview/demo#basic-chatbot) and [embedded ChatBot](/patternfly-ai/chatbot/overview/demo#embedded-chatbot) demos.

### Welcome message

To introduce users to the ChatBot experience, display a welcome message before they input their first message. This brief message should follow our [conversation design guidelines](/patternfly-ai/conversation-design) to welcome users to the ChatBot experience and encourage them to interact.

This message can be dismissed once a user sends their first message. To change the arrangement of the message within the message box, specify the `position` in the `<MessageBox>` component.

```js file="./ChatbotWelcomeInteraction.tsx" isFullscreen

```

### Welcome prompt

To provide users with a more specific direction, you can also include optional welcome prompts.

```js file="./ChatbotWelcomePrompt.tsx"

```

### Skip to content

To provide page context, we recommend using a "Skip to chatbot" button. This allows you to skip past other content on the page, directly to the ChatBot content, using a [PatternFly skip to content component](/components/skip-to-content). To display this button, you must tab into the main window.

When using default or docked modes, we recommend putting focus on the toggle if the ChatBot is closed, and the ChatBot when it is open. For fullscreen and embedded, we recommend putting the focus on the first focusable item in the ChatBot, such as a menu toggle. This can be seen in our more fully-featured demos for the [default, embedded, and fullscreen ChatBot](/patternfly-ai/chatbot/overview/demo#basic-chatbot) and the [embedded ChatBot](/patternfly-ai/chatbot/overview/demo#embedded-chatbot).

```js file="./SkipToContent.tsx" isFullscreen

```

## Toggle

### Basic toggle

To allow users to open and close the ChatBot window as needed, add a toggle.

```js file="./ChatbotToggleBasic.tsx" isFullscreen

```

### Custom toggle icon

A custom icon can be passed to the toggle. To ensure the icon is visible in both light and dark themes, use an SVG image and set `fill="currentColor"`.

```js file="./CustomClosedIcon.tsx" isFullscreen

```

### Custom toggle shape

A custom shape can be set for the toggle. To override the default circle shape, set `isRound` to `false`. This will set the toggle to a square shape, but you can pass in additional classes to further customize the shape.

```js file="./SquareChatbotToggle.tsx" isFullscreen

```

## Header

### Header sections

The ChatBot header is persistent, and contains the title for the ChatBot window, as well as any related controls and actions.

The `<ChatbotHeader>` has 2 sections:

- `<ChatbotHeaderMain>` contains the title and an optional menu toggle or new chat button:
  - `<ChatbotHeaderTitle>` handles the layout and display of a title or image at different responsive sizes.
  - `<ChatbotHeaderMenu>` (optional) is placed on the left side of the header and used to toggle a chat history menu.
  - `<ChatbotHeaderNewChatButton>` (optional) is placed on the left side of the header and used to initiate a new chat.
- `<ChatbotHeaderActions>` contains any additional controls:
  - The `<ChatbotHeaderSelectorDropdown>` component is a standard PatternFly dropdown that matches the ChatBot styles.
  - The `<ChatbotHeaderOptionsDropdown>` component is a dropdown with a menu toggle that is intended to be used to update ChatBot settings (like the display mode).

Your `<ChatbotHeader>` code structure should look like this:

```noLive
<ChatbotHeader>
  <ChatbotHeaderMain>
    <ChatbotHeaderMenu ... />
    <ChatbotHeaderNewChatButton ... />
    <ChatbotHeaderTitle ... />
  </ChatbotHeaderMain>
  <ChatbotHeaderActions>
    <ChatbotHeaderSelectorDropdown ... />
    <ChatbotHeaderOptionsDropdown ... />
  </ChatbotHeaderActions>
</ChatbotHeader>
```

### Header title

By default, `<HeaderTitle>` renders any children that are passed in. Optionally, you can pass in a `displayMode`, `showOnEmbedded`, `showOnDocked`, `showOnFullScreen`, and/or `showOnDefault` to render content conditionally.

```js file="./ChatbotHeaderTitle.tsx"

```

### Header options

There are a variety of options and customizations you can make to the header, to adjust how information is displayed, or to add additional controls.

In this example, select the respective checkbox to toggle these features:

- **Menu:** Users can select the menu toggle to open a menu of additional options or actions.
- **New chat button:** Used to start a new chat session. The header button can be used in addition to or in place of a new chat button within the [conversation history drawer](/patternfly-ai/chatbot/ui/#drawer-with-search-and-new-chat-button).
- **Left-aligned logo**
- **Centered logo**
- **Selector dropdown:** Users can choose from preselected options in a dropdown menu. For example, they can toggle between AI models.
- **Options dropdown:** Users can select ChatBot options from a menu. For example, they can switch between ChatBot display modes.

```js file="./ChatbotHeaderBasic.tsx"

```

## Footer

### Footnote with popover

A footnote can be placed in the ChatBot footer to communicate any legal disclaimers or information about the ChatBot.
Footnotes can be static text or a button that opens a popover.

```js file="./ChatbotFootnote.tsx"

```

### Message bar with speech recognition and file attachment

In Safari and Chrome, you will see a microphone button in the message bar if `hasMicrophoneButton` is passed to `<MessageBar>`. The button will only appear if `'SpeechRecognition'` or `'webkitSpeechRecognition'` are available in `window`. This does not currently work in Firefox.

By default the message bar supports file uploads via an attach button. Setting `hasAttachButton` to `false` will disable that feature.

```js file="./ChatbotMessageBar.tsx"

```

### Message bar with speech recognition in a different language

Speech recognition defaults to en-US. You can update the locale as needed. Locale codes are a combination of the [ISO 639-1 language code](https://www.iso.org/iso-639-language-code) and the [ISO 3166-1 country code](https://www.iso.org/iso-3166-country-codes.html), separated by a hyphen.

In this example, the locale is set to to ja-JP. You can try it out by saying "hajimemashite" (初めまして).

```js file="./ChatbotMessageBarLanguage.tsx"

```

### Message bar with always-shown send button

By default, the send button is only shown once a user has entered a valid message. If you choose to keep the send button visible at all times, disable the button when there is no valid message to send.

To always show the send button in the message bar, use the `alwaysShowSendButton` prop. Use the `isSendButtonDisabled` prop to disable the button as needed. If you want to enable or disable the send button based on the presence of text in the message bar, you can detect text via the `onChange` prop for `<MessageBar>`.

To disable the send button in the following example, select the "Disable send button" checkbox. When the button is disabled, you also cannot send via the enter key.

```js file="./ChatbotMessageBarDisabled.tsx"

```

### Message bar with attach menu appended to attach button

You can change the behavior of the attach button to open a menu, rather than the default file viewer for your operating system. This menu can display different actions related to attachments.

Attachments can also be added to the ChatBot via [drag and drop.](/patternfly-ai/chatbot/messages#attachment-dropzone)

```js file="./ChatbotMessageBarAttach.tsx"

```

### Footer with message bar and footnote

A simple footer with a message bar and footnote would have this code structure:

```noLive
<ChatbotFooter>
  <MessageBar ... />
  <ChatbotFootnote .../>
</ChatbotFooter>
```

```js file="./ChatbotFooter.tsx"

```

### Message bar with stop button

If you are using streaming, you can add a stop button to the message bar that allows users to stop a response from a ChatBot.

To enable the stop button, set `hasStopButton` to `true` and pass in a `handleStopButton` callback function. You can use this callback to trigger an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) configured as part of your API call.

```js file="./ChatbotMessageBarStop.tsx"

```

### Message bar with indicator and animation

You can pass the `hasAiIndicator` property to the `<MessageBar>` to give it a more pronounced AI indicator style. You can also pass the `isThinking` property to enable a "thinking" animation.

The following example shows a simplified way of how you might hanbdle the "thinking" animation: when you send a message, the `isThinking` property is set to `true`, then after 10 seconds it is set back to false to disable the animation again.

```ts file="./ChatbotMessageBarIndicatorThinking.tsx"

```

## Navigation

### Side nav in a drawer

The ChatBot conversation history is contained in an interactive drawer, where users can interact with previous conversations or start a new conversation.

The `<ChatbotConversationHistoryNav>` component is a wrapper placed within `<Chatbot>`, which contains all other ChatBot components in `drawerContent`. There is a focus trap so users can only tab within the drawer while it is open.

The code structure will look like this:

```noLive
<Chatbot>
  <ChatbotConversationHistoryNav
    ...
    drawerContent={
        <>
            <ChatbotContent>
                <ChatbotMessageBox>
                ...
                <ChatbotMessageBox>
            </ChatbotContent>
            <ChatbotFooter ... />
        </>
    }>
  </ChatbotConversationHistoryNav>
</Chatbot>
```

The conversation history drawer looks different depending on the `displayMode` of the parent `<Chatbot>`. (As shown in the [main ChatBot demo](/patternfly-ai/chatbot/overview/demo#basic-chatbot).):

- `Default` and `docked` display modes display the conversation history on top of the rest of the ChatBot content, with a PatternFly backdrop between the drawer panel and drawer content.
- `Fullscreen` and `embedded` display modes display the conversation history in line with the drawer content.

### Drawer with search and "new chat" button

In the conversation history drawer, users can search previous ChatBot conversations via an input field. To customize the placeholder text, use `searchInputPlaceholder`. Provide an aria label via `searchInputAriaLabel`.

They can also start new conversations via a "New chat" button. To customize the button label, use `newChatButtonText`.

Both the search input field and "New chat" buttons are optional. The `reverseButtonOrder` prop allows you to invert the positions of the Close and "New chat" buttons within the drawer when set to `true`.

```js file="./ChatbotHeaderDrawer.tsx"

```

### Drawer with conversation actions

Actions can be added to conversations with `menuItems`. Optionally, you can also add a `className` to the menu via `menuClassName`, change the default aria-label and tooltip content via `label`, or add an `onSelect` callback for when a user selects an item.

```js file="./ChatbotHeaderDrawerWithActions.tsx"

```

### Pinning conversations

To help users track important conversations, add a "pin" option to the conversation action menus. This action moves a conversation to a dedicated "pinned" section at the top of the history drawer for quick access. Pinned items should contain an "unpin" option, so that users can remove pinned conversations as needed.

```js file="./ChatbotHeaderDrawerWithPin.tsx"

```

### Renaming conversations in history drawer

You can allow users to rename a conversation in the history drawer by implementing a modal that opens upon clicking a "Rename" (or similar) action. When doing so, you must ensure the following:

- When the modal opens, focus is placed at the end of the text input.
- When the modal closes, focus goes back to the action toggle that was previously opened.
- Changes can be canceled via the **<kbd>Escape</kbd>** key or clicking a "Cancel" button.
- Changes can be saved via the **<kbd>Enter</kbd>** key or by clicking a "Save" button.

```js file="./ChatbotConversationEditing.tsx"

```

### Drawer with active conversation

If you're showing a conversation that is already active, you can set the `activeItemId` prop on your `<ChatbotConversationHistoryNav>` to apply an active visual state.

```js file="./ChatbotHeaderDrawerWithSelection.tsx"

```

### Resizable drawer

By default, the conversation history drawer has a fixed width (384px) and a focus trap. To provide users with more flexibility as they navigate their conversation history, or to better support embedded ChatBots on tablet-sized devices or smaller browser windows, you can instead make the drawer resizable. By default, even resizable drawers will still open to their full width on mobile devices.

In this example, the drawer can be resized up to the max size of the parent and resized down to 200px wide. To customize this behavior further (including width, style, and focus behavior) use PatternFly [`<Drawer>` props](/components/drawer#props), [`<DrawerPanelContent>` props](/components/drawer/#drawerpanelcontent), or any other drawer subcomponents.

```js file="./ChatbotHeaderDrawerResizable.tsx"

```

### Drawer with simple menu

The drawer can also be used to display a list of basic menu items.

```js file="./ChatbotHeaderDrawerNavigation.tsx"

```

### Terms of use

Based on the [PatternFly modal](/components/modal), this modal adapts to the ChatBot display mode and is meant to display terms and conditions for using a ChatBot in your project. The image in the header can be toggled on or off depending on whether the `image` and `altText` props are provided.

This example also includes an example of how to use [skip to content](/patternfly-ai/chatbot/ui#skip-to-content). When the terms of use modal is open, focus is placed on the terms of use container. When it is closed, focus is placed on the ChatBot. In a real example with a functioning ChatBot toggle, you would also want to place focus on the toggle when appropriate.

```js file="./TermsOfUse.tsx" isFullscreen

```

### Compact terms of use

To apply compact styling to the terms of use modal, pass `isCompact` to `<TermsOfUse>`. This will remove the header image and adjust the spacing of text, so that there is less white space in the modal.

```js file="./TermsOfUseCompact.tsx" isFullscreen

```

### Settings

To contain user preference controls and other ChatBot setting options, you can create a separate settings page that can accept any number of buttons, dropdown menus, toggles, labels, and so on. This settings page will render all components appropriately within all 4 display modes.

In this demo, you can toggle the settings page by clicking the "Settings" button in the display mode menu.

```js file="./Settings.tsx" isFullscreen

```

### Compact settings

To make the settings menu compact, with less spacing between the menu contents, pass `isCompact` to the `<SettingsForm>`.

```js file="./CompactSettings.tsx" isFullscreen

```

## Modals

### Modal

Based on the [PatternFly modal](/components/modal), this modal adapts to the ChatBot display mode and accepts components typically used in a modal. It is primarily used and tested in the context of the attachment modals, but you can customize this modal to adapt it to other use cases as needed. The modal will overlay the ChatBot in default and docked modes, and will behave more like a traditional PatternFly modal in fullscreen and embedded modes.

```js file="./ChatbotModal.tsx" isFullscreen

```
