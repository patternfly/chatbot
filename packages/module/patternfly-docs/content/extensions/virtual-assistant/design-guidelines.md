---
section: PatternFly-AI
subsection: ChatBot
id: Overview
sortValue: 1
source: design-guidelines
---

import "./images.css"

## Elements 

<div class="ws-docs-content-img">
![Main elements of a ChatBot.](./img/chatbot-elements.svg)
</div>

1. **Container:** The window that contains the entire ChatBot experience and all of its components.
1. **Header:** A persistent region at the top of the ChatBot window that contains navigation, branding, and actions.
1. **Options menu:** Contains display options and other settings. More details can be found in the [ChatBot variations section](#variations). 
1. **Navigation:** A menu that contains navigational options, including access to the conversation history.
1. **Messages:** Elements of the conversation between a ChatBot and user. More details can be found in the [message guidelines](#messages).
1. **Attachments:** Details about files that a user has uploaded to the ChatBot.
1. **Footer:** A persistent region at the bottom of the ChatBot window that contains the message bar and the footnote.
1. **Footnote (optional):** A persistent, short message that contains any legal disclaimers or important information about the ChatBot. Footnotes are optional, but strongly recommended. More details can be found in the [footnote guidelines](#footnotes).
1. **Toggle:** The button that allows users to open and close the ChatBot window. When the ChatBot is opened, the toggle should appear below the ChatBot window. The toggle shape and icon can be customized as needed, as shown in these [ChatBot toggle examples](/patternfly-ai/chatbot/ui#custom-toggle-icon). More details can be found in the [guidelines for accessing a ChatBot](#accessing-a-chatbot).

### Messages 

<div class="ws-docs-content-img">
![A basic user message, bot message, and quick reply buttons.](./img/message-elements.svg)
</div>

1. **User message:** Messages that the user has sent to the ChatBot.
1. **Bot message:** Messages from the ChatBot, which are marked with an "AI" label to communicate the use of AI to users. You should choose a descriptive name for your ChatBot.
1. **Avatar:** Representative image for your ChatBot and the user. ChatBot avatars should align with your product's brand and any existing brand standards.
1. **Name:** Identifier for your ChatBot and the user. Choose a name for your ChatBot that users can easily identify as a bot. 
1. **Label:** Labels ChatBot messages as "AI."
1. **Timestamp:** The relative or absolute time that a message was sent.
1. **Quick responses:** Programmable, clickable actions that allow users to quickly answer questions from the ChatBot.
1. **Sources:** Cards that link to documentation or other external resources. When multiple sources are included, users can paginate through the different options. 
1. **Response actions:** Actions that allow users to interact with a bot message. these typically include providing feedback, copying, sharing, or reading aloud, but [custom message actions](/patternfly-ai/chatbot/messages#custom-message-actions) are also supported.

### Message bar 

To message the ChatBot, users can type directly into the message bar in the footer or click any included actions. 

<div class="ws-docs-content-img">
![Elements of a message bar, including input actions.](./img/message-bar-elements.svg)
</div>

1. **Attach button:** Allows users to upload files from their computer. 
1. **Use microphone button:** Supports speech recognition to allow users to use voice input. This feature is currently only available in Chrome and Safari.
1. **Send button:** Allows users to send a typed message. This button should be disabled until a user has input text. 

When a user chooses to use speech input via the microphone button, the button will display an animation to indicate that the ChatBot is listening to the user (as shown in [this speech recognition example](/patternfly-ai/chatbot/ui#message-bar-with-speech-recognition-and-file-attachment)). To stop voice input, users will need to select the microphone button again.

<div class="ws-docs-content-img">
![Active listening button in the message bar.](./img/listening.svg)
</div>

When a user selects the "listen" [message action](/patternfly-ai/chatbot/messages#messages-actions) on a bot message, the message contents will be read aloud and a stop button will be displayed as the only action in the message bar. Selecting this button will halt the message playback.

<div class="ws-docs-content-img">
![Stop button in the message bar.](./img/stop-button.svg)
</div>

### Footnotes 

The footnote provides a persistent space to display messaging about your product's Terms and Conditions, which focus on the rules of using the service, and Privacy Policy, which focuses on the handling of personal data.

Though footnotes are not required, they are highly recommended to ensure legal compliance, establish user trust, and clearly define the usage guidelines and data handling practices. 

When users select the footnote, you can display a popover that provides more information than would fit in the footnote:

<div class="ws-docs-content-img">
![Selected footnote, with an informative popover.](./img/footnote.svg)
</div>

## Usage

When ChatBots are designed to meet the needs of your users, they can improve the overall UX of your product by offering convenient, efficient, and persistent support. When your ChatBot cannot find an answer for your users, you must provide them with a method to contact human support.

Before building a ChatBot, make sure that you have justified it as an appropriate solution by asking yourself these questions:
- What are the users’ goals?
- How in-depth is the assistance the user will need?
- Does human assistance better serve your users?
- How is a ChatBot superior to online documentation, contextual support or wizards?
- What data sources or abilities can this ChatBot leverage to assist your users?

Do not create a ChatBot simply for the sake of novelty.

### When to use a ChatBot 

Use a ChatBot to offer your users on-demand help at any time, including:
- Technical support and troubleshooting.
- Product information and documentation.
- Sales and product recommendations.
- Training and onboarding.
- System monitoring and alerts.
- Community engagement .
- Feedback collection and surveys.

### When not to use a ChatBot

Do not use a ChatBot when: 
- A task could be accomplished more efficiently through the UI. 
- A process is very complex or could take a long time.
- A real human is needed for sensitive or emotional topics.

## Behavior 

### Accessing a ChatBot

Users can enter a conversation with a ChatBot by clicking on the toggle. Once the ChatBot window opens, the toggle will change to display an "angle down" icon to indicate that clicking the toggle again will minimize the ChatBot. Users can select the toggle at any point in their journey to open and close the ChatBot as needed.

<div class="ws-docs-content-img">
![2 toggles with open and closed icons.](./img/chatbot-toggle.svg)
</div>

When there is an unread message from the ChatBot, a notification badge should be placed on the toggle.

<div class="ws-docs-content-img">
![Toggle with notification badge.](./img/chatbot-toggle-notification.svg)
</div>

### Using the navigation menu

The ChatBot navigation menu primarily contains a users' conversation history with the ChatBot. Clicking the menu icon opens a side drawer in the ChatBot window. 

By clicking into the navigation menu, users can search through previous conversations and perform additional actions, such as sharing a conversation with others. 

<div class="ws-docs-content-img">
![Conversation history with an options menu opened on a previous conversation.](./img/conversation-history.svg)
</div>

### Attaching files 

Using [the attach button](/patternfly-ai/chatbot/overview/design-guidelines#message-bar) in the message bar, users can [attach files](/patternfly-ai/chatbot/messages#file-attachments) to their message to share with the ChatBot. 

The attach button can follow a couple of patterns, including: 
- Opening the file explorer for a user's operating system
- Opening a menu with attachment options that are chosen by designers and developers

<div class="ws-docs-content-img">
![Menu with file attachment options.](./img/attachment-menu.svg)
</div>

If a message attachment is successful, a label with the file details will be displayed in the message:

<div class="ws-docs-content-img">
![File attached to user message.](./img/attached-file.svg)
</div>

Users can select the file label to either preview or edit their attachment, as shown in these [attachment examples](/patternfly-ai/chatbot/messages#attachment-preview).

If a message attachment fails, an error message should share the reason for failure:

<div class="ws-docs-content-img">
![Error alert for failed attachment.](./img/attachment-error.svg)
</div>

## Variations 

### Display modes

There are a few display modes that users can choose when interacting with a ChatBot.

<div class="ws-docs-content-img">
![Menu of display options.](./img/display-menu.svg)
</div>

1. **Overlay:** The default display mode, which floats the ChatBot window on top of a product's UI. In overlay mode, the ChatBot can be opened and minimized with the toggle. 

<div class="ws-docs-content-img">
![ChatBot in overlay mode.](./img/overlay.svg)
</div>

2. **Docked:** Anchors the ChatBot to the side of the page content. When docked, the ChatBot window is persistent, and cannot be toggled.

<div class="ws-docs-content-img">
![ChatBot in docked mode.](./img/docked.svg)
</div>

3. **Full screen:** Fills the screen with the ChatBot window.

<div class="ws-docs-content-img">
![ChatBot in full-screen mode.](./img/fullscreen.svg)
</div>

4. **Embedded:** Places the ChatBot within a product as its own page with its own item navigation menu.

<div class="ws-docs-content-img">
![ChatBot embedded in a product.](./img/embedded.svg)
</div>

## Placement

Your users will expect your ChatBot to be in a reliable, permanent location. Overlay displays are placed in the bottom right of the screen by default. If you're using a full screen or embedded ChatBot, stick to a consistent access location, like a button in the masthead or an item in the navigation menu.

## Content considerations

For guidance on writing ChatBot content, refer to our [conversation design guidelines](/patternfly-ai/conversation-design).

## Accessibility 

Although accessibility has been integrated into the design of our ChatBot components, it is important to ensure that your implementation is inclusive of all users. For more guidance, refer to [our accessibility guidelines](/accessibility/about-accessibility).