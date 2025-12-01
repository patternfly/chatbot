---
# Sidenav top-level section
# should be the same for all markdown files
section: extensions
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: Overview
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: demo
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
propComponents:
  [
    'Chatbot',
    'ChatbotToggle',
    'ChatbotContent',
    'ChatbotWelcomePrompt',
    'ChatbotFooter',
    'MessageBar',
    'ChatbotFootnote',
    'MessageBox',
    'Message',
    'MessageBarWithAttachMenuProps',
    'CompareProps'
  ]
sortValue: 2
---

import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import Compare from '@patternfly/chatbot/dist/dynamic/Compare';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';

import ChatbotHeader, {
ChatbotHeaderMain,
ChatbotHeaderMenu,
ChatbotHeaderTitle,
ChatbotHeaderActions,
ChatbotHeaderSelectorDropdown,
ChatbotHeaderOptionsDropdown,
ChatbotHeaderCloseButton,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { CopyIcon } from '@patternfly/react-icons/dist/esm/icons/copy-icon';
import { WrenchIcon } from '@patternfly/react-icons/dist/esm/icons/wrench-icon';
import {
Button,
DescriptionList,
DescriptionListDescription,
DescriptionListGroup,
DescriptionListTerm,
ExpandableSection,
ExpandableSectionVariant,
Flex,
FlexItem,
Label
} from '@patternfly/react-core';
import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import { getTrackingProviders } from "@patternfly/chatbot/dist/dynamic/tracking";
import { useEffect,useCallback, useRef, useState, FunctionComponent, MouseEvent, MouseEvent as ReactMouseEvent } from 'react';
import saveAs from 'file-saver';

### Basic ChatBot

This demo displays a basic ChatBot, which includes:

1. The [`<ChatbotToggle>`](/extensions/chatbot/ui#toggle) that controls the [`<Chatbot>` container.](/extensions/chatbot/ui#container)
2. A [`<ChatbotHeader>`](/extensions/chatbot/ui#header) with all built sub-components laid out, including a `<ChatbotHeaderTitle>` that changes its presentation depending on the display mode.
3. The ability to swap display modes via `<ChatbotHeaderOptionsDropdown>`
4. [`<ChatbotContent>` and `<MessageBox>`](/extensions/chatbot/ui#content-and-message-box) with:

- A `<ChatbotWelcomePrompt>`
- An initial [user `<Message>`](/extensions/chatbot/messages#user-messages) and an initial bot message with [message actions.](/extensions/chatbot/messages#message-actions)
- Logic for enabling auto-scrolling to the most recent message whenever a new message is sent or received using a `scrollToBottomRef`

5. A [`<ChatbotFooter>`](/extensions/chatbot/ui#footer) with a [`<ChatbotFootNote>`](/extensions/chatbot/ui#footnote-with-popover) and a `<MessageBar>` that contains the abilities of:

- [Speech to text.](/extensions/chatbot/ui#message-bar-with-speech-recognition-and-file-attachment)
- Sending a message to the ChatBot.
- Receiving a response from a backend AI tool with a loading message state.

6. A [`<ChatbotConversationHistoryNav>`](/extensions/chatbot/ui#navigation) toggled open and closed by the `<ChatbotHeaderMenu`> in the `<ChatbotHeader>`.

7. A "Skip to chatbot" button that allows you to skip to the chatbot content via the [PatternFly skip to content component](/extensions/chatbot/ui#skip-to-content). To display this button you must tab into the main window.

```js file="./Chatbot.tsx" isFullscreen

```

### Compact ChatBot

This demo displays a basic compact ChatBot

```js file="./ChatbotCompact.tsx" isFullscreen

```

### Embedded ChatBot

This demo displays an embedded ChatBot. Embedded ChatBots are meant to be placed within a page in your product. This demo includes:

1. A [PatternFly page](/components/page) with a sidebar, "Skip to chatbot" button, and masthead. To display the "Skip to chatbot" button you must tab into the main window.
2. A [`<Chatbot>`](/extensions/chatbot/ui#container) container.
3. A [`<ChatbotHeader>`](/extensions/chatbot/ui#header) with all built sub-components laid out, including a `<ChatbotHeaderTitle>`
4. [`<ChatbotContent>` and `<MessageBox>`](/extensions/chatbot/ui#content-and-message-box) with:
   - A `<ChatbotWelcomePrompt>`
   - An initial [user `<Message>`](/extensions/chatbot/messages#user-messages) and an initial bot message with [message actions.](/extensions/chatbot/messages/#message-actions)
   - Logic for enabling auto-scrolling to the most recent message whenever a new message is sent or received using a `scrollToBottomRef`
5. A [`<ChatbotFooter>`](/extensions/chatbot/ui#footer) with a [`<ChatbotFootNote>`](/extensions/chatbot/ui#footnote-with-popover) and a `<MessageBar>` that contains the abilities of:
   - [Speech to text.](/extensions/chatbot/ui#message-bar-with-speech-recognition-and-file-attachment)
   - Sending a message to the ChatBot.
   - Receiving a response from a backend AI tool with a loading message state.
6. A [`<ChatbotConversationHistoryNav>`](/extensions/chatbot/ui#navigation) that can be toggled by the `<ChatbotHeaderMenu`> in the `<ChatbotHeader>`.

```js file="./EmbeddedChatbot.tsx" isFullscreen

```

### Inline drawer ChatBot

This demo displays a ChatBot in a static, inline drawer. This demo includes:

1. An empty [PatternFly page](/components/page) with a sidebar and masthead.
2. A [basic ChatBot](#basic-chatbot), placed beside the page content. It does not overlay the page content and does not allow you to change the display mode by default.

**Note:** The inline drawer ChatBot is built to fit and perform within a drawer, but the implementation of the drawer is up to you. This drawer can look different for each product, but will often be placed to the side of the page, inline with the page content.

```js file="./ChatbotInDrawer.tsx" isFullscreen

```

### Primary color background

This demo displays an embedded ChatBot with a [primary background color](/design-foundations/colors#background-colors). This example includes the same features as the [Embedded ChatBot demo](/extensions/chatbot/overview/demo/#embedded-chatbot)&mdash;the only differences are that the background color is adjusted via the `isPrimary` prop and some of the sample Messages have changed. You can use the same logic to adjust the background color in any ChatBot layout.

```js file="./WhiteEmbeddedChatbot.tsx" isFullscreen

```

### Display mode switcher

This demo showcases how the ChatBot can be rendered in different display modes to suit various application layouts. It demonstrates how to dynamically change the page structure in response to the user's selection. This demo includes:

1. The ability to switch between overlay, drawer, and fullscreen modes using the [`<ChatbotHeaderOptionsDropdown>`](/extensions/chatbot/ui#header-options) in the header.
2. A conditional page layout that renders the ChatBot for each display mode option:
   - **Overlay:** As a floating window on top of the page content.
   - **Drawer:** Inside an inline PatternFly `<Drawer>` as a side panel.
   - **Fullscreen:** As a top-level component that covers the entire screen for an embedded experience.
3. Logic to show or hide the `<ChatbotToggle>` button, which is only present in the default overlay mode.
4. A [basic ChatBot](#basic-chatbot) with a header, welcome prompt, and message bar to populate the different layouts.

```js file="./ChatbotDisplayMode.tsx" isFullscreen

```

### Comparing ChatBots

To let users compare how different ChatBots respond to the same prompt, you can add multiple ChatBots within the same window. The following demo illustrates a comparison view pattern that allows users to toggle between different conversations in a single ChatBot window.
<br /><br />
Your code structure should look like this:

```noLive
<Page ... >
  <div className="pf-chatbot__compare-container">
    <Compare ... />
    <ChatbotFooter ... >
      <MessageBar ... />
    </ChatbotFooter>
  </div>
</Page>
```

```js file="./EmbeddedComparisonChatbot.tsx" isFullscreen

```

### Chat transcripts

This demo illustrates how you could add downloadable transcripts to your ChatBot, which outline conversation details in a Markdown file. This approach allows users to easily share information from a conversation with others.

A message transcript includes details from a single chat message. To download a sample message transcript in this demo, click the "Download" action under a bot message.

A conversation transcript includes details from the entirety of a ChatBot conversation. To download a sample conversation transcript in this demo, open the chat history menu and click "Download" in the options menu for the conversation.

In this example, file download is implemented with [file-saver](https://www.npmjs.com/package/file-saver).

```js file="./ChatbotTranscripts.tsx" isFullscreen

```
