---
# Sidenav top-level section
# should be the same for all markdown files
section: PatternFly-AI
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: Messages
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: react
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
propComponents:
  [
    'AttachMenu',
    'AttachmentEdit',
    'FileDetailsProps',
    'FileDetailsLabelProps',
    'FileDropZone',
    'PreviewAttachment',
    'Message',
    'MessageExtraContent',
    'PreviewAttachment',
    'ActionProps',
    'SourcesCardProps',
    'UserFeedbackProps',
    'UserFeedbackCompleteProps',
    'QuickResponseProps'
  ]
sortValue: 3
---

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import MessageDivider from '@patternfly/chatbot/dist/dynamic/MessageDivider';
import { rehypeCodeBlockToggle } from '@patternfly/chatbot/dist/esm/Message/Plugins/rehypeCodeBlockToggle';
import SourcesCard from '@patternfly/chatbot/dist/dynamic/SourcesCard';
import { ArrowCircleDownIcon, ArrowRightIcon, CheckCircleIcon, CopyIcon, CubeIcon, CubesIcon, DownloadIcon, InfoCircleIcon, OutlinedQuestionCircleIcon, RedoIcon, RobotIcon, WrenchIcon } from '@patternfly/react-icons';
import patternflyAvatar from './patternfly_avatar.jpg';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
import FileDetails from '@patternfly/chatbot/dist/dynamic/FileDetails';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import { PreviewAttachment } from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import ChatbotAlert from '@patternfly/chatbot/dist/dynamic/ChatbotAlert';
import { explorePipelinesQuickStart } from './explore-pipeline-quickstart.ts';
import { monitorSampleAppQuickStart } from '@patternfly/chatbot/src/Message/QuickStarts/monitor-sampleapp-quickstart.ts';
import userAvatar from './user_avatar.svg';
import squareImg from './PF-social-color-square.svg';
import { CSSProperties, useState, Fragment, FunctionComponent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent, Ref, isValidElement, cloneElement, Children, ReactNode, useRef, useEffect } from 'react';
import FilePreview from '@patternfly/chatbot/dist/dynamic/FilePreview';
import ImagePreview from '@patternfly/chatbot/dist/dynamic/ImagePreview';
import filePreview from './file-preview.svg';

The `content` prop of the `<Message>` component is passed to a `<Markdown>` component (from [react-markdown](https://remarkjs.github.io/react-markdown/)), which is configured to translate plain text strings into PatternFly [`<Content>` components](/components/content) and code blocks into PatternFly [`<CodeBlock>` components.](/components/code-block)

## Messages

### Bot messages

Messages from the ChatBot will be marked with an "AI" label to clearly communicate the use of AI to users. The ChatBot can display different `content` types, including plain text, code, or a loading animation (via `isLoading`).

By default, a date and timestamp is displayed with each message. We recommend using the `timestamp` prop in real ChatBots, since it will allow you to set persistent dates and times on messages, even if the messages re-render. You can update `timestamp` with a different [date and time format](/ux-writing/numerics) as needed.

You can further customize the avatar by applying an additional class or passing [PatternFly avatar props](/components/avatar) to the `<Message>` component via `avatarProps`.

```js file="./BotMessage.tsx"

```

### Message dividers

To provide users with important contextual updates, you can add dividers between messages.

For example, you can use the default divider to display a "timestamp" for more significant gaps in the conversation, or you can pass `variant="fullWidth"` to a divider to announce that an agent has joined the chat.

```js file="./MessageWithDividers.tsx"

```

### Message actions

You can add actions to a message, to allow users to interact with the message content. These actions can include:

- Feedback responses that allow users to rate a message as "good" or "bad".
- Copy and share controls that allow users to share the message content with others.
- An edit action to allow users to edit a message they previously sent. This should only be applied to user messages - see the [user messages example](#user-messages) for details on how to implement this action.
- A listen action, that will read the message content out loud.

**Note:** The logic for the actions is not built into the component and must be implemented by the consuming application.

```js file="./MessageWithResponseActions.tsx"

```

### Message actions clicked state

You can apply a clicked state to message actions, to convey that the action has previously been selected.

To define which message response action should show a clicked state when the `<ResponseActions>` component first renders, use the `isClicked` boolean property within each action's configuration object.

To make an action button appear active by default, set `isClicked: true`. Only 1 action can be visually active at any given time.

If you unintentionally set `isClicked: true` for multiple buttons, the component will apply a predefined internal precedence order to resolve the conflict. The button encountered first in this order will be displayed as clicked, while other buttons will sustain their default appearance. The default precedence of button actions is: "positive", "negative", "copy", "share", "listen", followed by any other custom actions (in object key order).

Once the component has rendered, user interactions will take precedence over the initial `isClicked` prop. Clicking a button will activate it and deactivate any other active button. The `isDisabled` prop for each action button specifies if a button is interactive or not.

```js file="./MessageWithClickedResponseActions.tsx"

```

### Message actions selection options

By default, message actions will automatically deselect when clicking outside the component or clicking a different action button. You can opt-in to persist the selection by setting `persistActionSelection` to `true`.

When `persistActionSelection` is `true`:

- The selected action will remain selected even when clicking outside the component
- Clicking the same button again will toggle the selection off, though you will have to move your focus elsewhere to see a visual state change
- Clicking a different button will switch the selection to that button

```js file="./MessageWithPersistedActions.tsx"

```

### Custom message actions

Beyond the standard message actions (good response, bad response, copy, share, or listen), you can add custom actions to a bot message by passing an `actions` object to the `<Message>` component. This object can contain the following customizations:

- `ariaLabel`
- `onClick`
- `className`
- `isClicked`
- `isDisabled`
- `tooltipContent`
- `tooltipContent`
- `tooltipProps`
- `icon`

You can apply a `clickedAriaLabel` and `clickedTooltipContent` once a button is clicked. If either of these props are omitted, their values will default to the `ariaLabel` or `tooltipContent` supplied.

```js file="./MessageWithCustomResponseActions.tsx"

```

### Message feedback

When a user selects a positive or negative [message action](#message-actions), you can display a message feedback card that acknowledges their response and provides space for additional written feedback. These cards can be manually dismissed via the close button and the thank-you card can be [configured to time out automatically](/patternfly-ai/chatbot/messages#message-feedback-with-timeouts).

You can see the full feedback flow [in the message demos](/patternfly-ai/chatbot/messages/demo#message-feedback).

The message feedback cards will immediately receive focus by default, but you can remove this behavior by passing `focusOnLoad: false` to the `<Message>` (as shown in the following examples). For better usability, you should generally keep the default focus behavior.

The following examples demonstrate:

- A basic feedback card. To toggle the text input area, select the **Has text area** checkbox.
- A thank-you card. To toggle the close button, select the **Has close button** checkbox.

```js file="./MessageWithFeedback.tsx"

```

### Message feedback with timeouts

The feedback thank-you message can be configured to time out and automatically close after a period of time. The default time-out period is 8000 ms, but it can be customized via `timeout`.

To display the thank-you message in this example, click **Show card**.

The card will not dismiss within the default time if a user is hovering over it or if it has keyboard focus. Instead, it will dismiss after they remove focus, via `timeoutAnimation`, which is 3000 ms by default. You can adjust this duration and set an `onTimeout` callback, as well as optional `onMouseEnter` and `onMouseLeave` callbacks.

For accessibility purposes, be sure to announce when new content appears onscreen. `isLiveRegion` is set to true by default on `<Message>` so it will make appropriate announcements for you when the thank-you card appears.

```js file="./MessageWithFeedbackTimeout.tsx"

```

### Messages with quick responses

You can offer convenient, clickable responses to messages in the form of quick actions. Quick actions are [PatternFly labels](/components/label/) in a label group, configured to display up to 5 visible labels. Only 1 response can be selected at a time.

To add quick actions, pass `quickResponses` to `<Message>`. This can be overridden by passing additional `<LabelGroup>` props to `quickResponseContainerProps`, or additional `<Label>` props to `quickResponses`.

```js file="./MessageWithQuickResponses.tsx"

```

### Messages with sources

If you are using Retrieval-Augmented Generation, you may want to display sources in a message. Passing `sources` to `<Message>` allows you to paginate between the sources you provide.

If a source will open outside of the ChatBot window, add an external link icon via `isExternal`.

The API for a source requires a link at minimum, but we strongly recommend providing a more descriptive title and body description so users have enough context. For the best clarity and readability, we strongly recommend limiting the title to 1 line and the body to 2 lines. If the body description is more than 2 lines, use the "long sources" or "very long sources" variant.

```js file="./MessageWithSources.tsx"

```

### Messages with tool responses

If you are using [model context protocol (MCP)](https://www.redhat.com/en/blog/model-context-protocol-discover-missing-link-ai-integration), you may find it useful to display information on tool responses as part of a message. Passing `toolResponse` to `<Message>` allows you to display a card with an optional subheading and body, as well as custom card content. Content is intentionally left fully customizable for now as this is an evolving area.

```js file="./MessageWithToolResponse.tsx"

```

### Messages with deep thinking

You can share details about the "thought process" behind an LLM's response, also known as deep thinking. To display a customizable, expandable card with these details, pass `deepThinking` to `<Message>` and provide a subheading (optional) and content body.

Because this is an evolving area, this card content is currently fully customizable.

```js file="./MessageWithDeepThinking.tsx"

```

### Messages with tool calls

If you are using [model context protocol (MCP)](https://www.redhat.com/en/blog/model-context-protocol-discover-missing-link-ai-integration), you can share tool call information with users as part of a message. To display a tool card card, pass `toolCalls` to `<Message>`. This card contains a title, actions for running the tool and cancelling, and optional descriptive text.

You can also display a loading animation until the tool call can be run. To visualize loading behavior in this example, select the "Tool calls are loading" checkbox.

```js file="./MessageWithToolCall.tsx"

```

### Messages with quick start tiles

[Quick start](/extensions/quick-starts/) tiles can be added to messages via the `quickStarts` prop. Users can initiate the quick start from a link within the message tile.

The quick start tile displayed below the message is based on the tile included in the [PatternFly quick starts extension](https://github.com/patternfly/patternfly-quickstarts), but with slightly more limited functionality. For example, it does not track the state of the extension. However, it supports an additional `onSelectQuickStart` prop, so that the name of the quick start can be captured on click. This can be used to trigger other behavior in your application, such as launching that quick start in your main UI.

```js file="./MessageWithQuickStart.tsx"

```

### User messages

Messages from users have a different background color to differentiate them from bot messages. You can also display a custom avatar that is uploaded by the user. You can further customize the avatar by applying an additional class or passing [PatternFly avatar props](/components/avatar) to the `<Message>` component via `avatarProps`.

User messages can also be made editable by passing an "edit" object to the `actions` property. When editing is enabled focus should be placed on the text area. When editing is completed or canceled the focus should be moved back to the edit button.

```js file="./UserMessage.tsx"

```

### Custom message content

**Caution:** Take care when using this feature. It can cause you to stray from accessibility and design best practice standards. If you frequently need add the same component via custom message content, reach out to the PatternFly team. If there's a consistent need for a certain component, we can look into adding native support for additional features.

You can add custom content to specific parts of a `<Message>` via the `extraContent` prop, including additional components (like timestamps, badges, or custom elements). This prop allows you to create dynamic and reusable elements for various use cases, without changing the default message layout.

```js file="./UserMessageWithExtraContent.tsx"

```

## File attachments

### Messages with attachments

When [attachments](/patternfly-ai/chatbot/messages#file-attachments) are shared and displayed in the ChatBot window, users will see a selectable and dismissible message that contains file details in a label. Selecting the file label can open a preview modal, which allows users to view or make edits to the file contents.

The `<PreviewAttachment>` component displays a modal with a read-only view of the attached file's contents. Selecting the "edit" button will open the `<AttachmentEdit>` component, which provides an interactive environment where users can make changes to the file.

If a `displayMode` is not passed to `<PreviewAttachment>` or `<AttachmentEdit>`, they both default to overlaying the default `displayMode` of the `<Chatbot>` component.

**Note:** This example does not actually apply any edits to the attached file. That logic depends on the implementation.

```js file="./MessageWithAttachment.tsx"

```

We are using [react-dropzone](https://react-dropzone.js.org) for opening the file dialog and handling drag and drop. It does not process files or provide any way to make HTTP requests to a server. If you need this, [react-dropzone](https://react-dropzone.js.org) suggests [filepond](https://pqina.nl/filepond/) or [uppy.io.](https://uppy.io/). To handle edge cases, like restricting the number or size of files, you can pass a function to the `handleAttach` prop on `MessageBar` or `onFileDrop` prop in `FileDropZone.`

### Attachment label

When an attachment is successfully uploaded, a label will appear in the message box. There are several label variants that cover different attachment states, including:

- **Plain:** Default attachment labels, which display the filename and extension.
- **Closeable:** Attachments that can be dismissed.
- **Clickable:** Attachments that can be selected, typically to open file details.
- **Loading:** Attachments that are still being uploaded.

```js file="./FileDetailsLabel.tsx"

```

### Attachment preview

To allow users to preview the contents of an attachment, load a read-only view of the file contents in a new modal.

```js file="./PreviewAttachment.tsx"

```

### Editable attachments

To allow users to edit an attached file, load a new code editor within the ChatBot window. On this screen, you can allow users to edit a file and save changes if they'd like. Return users to the main ChatBot window once they dismiss the editor.

```js file="./AttachmentEdit.tsx"

```

### Image preview

To allow users to preview images, load a modal that contains a view of the file name, file size, and the image. Users can toggle between multiple images by using pagination controls at the bottom of the modal. Return users to the main ChatBot window once they close the modal.

```js file="./ImagePreview.tsx"

```

### File preview

If the contents of an attachment cannot be previewed, load a file preview modal with a view of the file name and an unavailable message. When users close the modal, return to the main ChatBot window.

```js file="./FilePreview.tsx"

```

### Failed attachment error

When an attachment upload fails, a [danger alert](/components/alert) is displayed to provide details about the reason for failure.

```js file="./AttachmentError.tsx"

```

### Attachment dropzone

An attachment dropzone allows users to upload files via drag and drop.

```js file="./FileDropZone.tsx"

```
