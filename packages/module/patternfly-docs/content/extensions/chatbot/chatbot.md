---
id: Overview
title: ChatBot overview
section: extensions
subsection: ChatBot
sortValue: 1
source: ChatBot
---

**Note:** The PatternFly ChatBot extension lives in its own package [`@patternfly/chatbot`](https://www.npmjs.com/package/@patternfly/chatbot).

The PatternFly **ChatBot** extension contains a React implementation of an AI-focused chatbot, providing users with access to convenient and persistent help. This extension is inteneed to remain in alignment with our [AI principles and design guidelines](/ai/overview).

*Only use this ChatBot when it adds value to your users' experiences.* Don't use it simply for the sake of novelty&mdash;it must directly help users reach their goals.

---

## How do I use ChatBot? 

To get started:
1. Install the `@patternfly/chatbot` package by following [the README instructions](https://github.com/patternfly/chatbot).
2. To use a ChatBot component in your project, import the ChatBot and the  component you need. For example: `import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';`
3. To build out and customize your ChatBot experience, refer to our extensive documentation on PatternFly.org.

## What does a built-out ChatBot look like?

To illustrate holistic ChatBot solutions, we offer these interactive demos: 
- [Basic ChatBot](/extensions/chatbot/overview/demo#basic-chatbot): A standard ChatBot that can swap between display modes.
- [Compact ChatBot](/extensions/chatbot/overview/demo#compact-chatbot): A compact version of a standard ChatBot that allows for more information density. 
- [Embedded ChatBot](/extensions/chatbot/overview/demo#embedded-chatbot): A ChatBot experience that can be embedded into a page within an application.
- [Inline drawer ChatBot](/extensions/chatbot/overview/demo#inline-drawer-chatbot): A ChatBot placed within a drawer that is inline with page content, rather than one that overlays the page.

## How do I build a ChatBot for my product?

To learn how to design ChatBot experiences, refer to [the design guidelines](/extensions/chatbot/overview/design-guidelines) and our [conversation design guidelines](/ai/conversation-design/).

Explore our documentation, which covers both the components you'll need to build your ChatBot and the guidance to follow for different functionality:
- UI: Structural, core components
    - [Structural elements](/extensions/chatbot/ui#structure)
    - [Toggle](/extensions/chatbot/ui#toggle)
    - [Header](/extensions/chatbot/ui#header)
    - [Footer](/extensions/chatbot/ui#footer)
    - [Navigation](/extensions/chatbot/ui#navigation)
    - [Modals](/extensions/chatbot/ui#modals)
- Messages: Components that customize features related to the conversation  
    - [Bot and user messages](/extensions/chatbot/messages)
    - [File attachments](/extensions/chatbot/messages#attachments)
- [Analytics](/extensions/chatbot/analytics): Tracking for ChatBot interactions
- [Customizing messages](/extensions/chatbot/customizing-messages): Details for the implementation of custom messages

---

We will continue to grow and evolve our ChatBot. If you notice a bug or have any suggestions, feel free to file an issue in our [GitHub repository!](https://github.com/patternfly/chatbot/issues) Make sure to check if there is already a pre-existing issue before creating a new one.