---
# Sidenav top-level section
# should be the same for all markdown files
section: PatternFly-AI
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
ChatbotHeaderOptionsDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import PFIconLogoColor from '../UI/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '../UI/PF-IconLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import { getTrackingProviders } from "@patternfly/chatbot/dist/dynamic/tracking";


### Basic ChatBot

This demo displays a basic ChatBot, which includes:

1. The [`<ChatbotToggle>`](/patternfly-ai/chatbot/ui#toggle) that controls the [`<Chatbot>` container.](/patternfly-ai/chatbot/ui#container)
2. A [`<ChatbotHeader>`](/patternfly-ai/chatbot/ui#header) with all built sub-components laid out, including a `<ChatbotHeaderTitle>` that changes its presentation depending on the display mode.
3. The ability to swap display modes via `<ChatbotHeaderOptionsDropdown>`
4. [`<ChatbotContent>` and `<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) with:

- A `<ChatbotWelcomePrompt>`
- An initial [user `<Message>`](/patternfly-ai/chatbot/messages#user-messages) and an initial bot message with [message actions.](/patternfly-ai/chatbot/messages#message-actions)
- Logic for enabling auto-scrolling to the most recent message whenever a new message is sent or received using a `scrollToBottomRef`

5. A [`<ChatbotFooter>`](/patternfly-ai/chatbot/ui#footer) with a [`<ChatbotFootNote>`](/patternfly-ai/chatbot/ui#footnote-with-popover) and a `<MessageBar>` that contains the abilities of:

- [Speech to text.](/patternfly-ai/chatbot/ui#message-bar-with-speech-recognition-and-file-attachment)
- Sending a message to the ChatBot.
- Receiving a response from a backend AI tool with a loading message state.

6. A [`<ChatbotConversationHistoryNav>`](/patternfly-ai/chatbot/ui#navigation) toggled open and closed by the `<ChatbotHeaderMenu`> in the `<ChatbotHeader>`.

7. A "Skip to chatbot" button that allows you to skip to the chatbot content via the [PatternFly skip to content component](/patternfly-ai/chatbot/ui#skip-to-content). To display this button you must tab into the main window.

```js file="./Chatbot.tsx" isFullscreen

```

### Embedded ChatBot

This demo displays an embedded ChatBot. Embedded ChatBots are meant to be placed within a page in your product. This demo includes:

1. A [PatternFly page](/components/page) with a sidebar, "Skip to chatbot" button, and masthead. To display the "Skip to chatbot" button you must tab into the main window.
2. A [`<Chatbot>`](/patternfly-ai/chatbot/ui#container) container.
3. A [`<ChatbotHeader>`](/patternfly-ai/chatbot/ui#header) with all built sub-components laid out, including a `<ChatbotHeaderTitle>`
4. [`<ChatbotContent>` and `<MessageBox>`](/patternfly-ai/chatbot/ui#content-and-message-box) with:
   - A `<ChatbotWelcomePrompt>`
   - An initial [user `<Message>`](/patternfly-ai/chatbot/messages#user-messages) and an initial bot message with [message actions.](/patternfly-ai/chatbot/messages/#message-actions)
   - Logic for enabling auto-scrolling to the most recent message whenever a new message is sent or received using a `scrollToBottomRef`
5. A [`<ChatbotFooter>`](/patternfly-ai/chatbot/ui#footer) with a [`<ChatbotFootNote>`](/patternfly-ai/chatbot/ui#footnote-with-popover) and a `<MessageBar>` that contains the abilities of:
   - [Speech to text.](/patternfly-ai/chatbot/ui#message-bar-with-speech-recognition-and-file-attachment)
   - Sending a message to the ChatBot.
   - Receiving a response from a backend AI tool with a loading message state.
6. A [`<ChatbotConversationHistoryNav>`](/patternfly-ai/chatbot/ui#navigation) that can be toggled by the `<ChatbotHeaderMenu`> in the `<ChatbotHeader>`.

```js file="./EmbeddedChatbot.tsx" isFullscreen

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
