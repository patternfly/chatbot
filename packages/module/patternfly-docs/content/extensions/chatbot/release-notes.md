---
id: Release notes
title: Release notes
section: extensions
subsection: ChatBot
sortValue: 10
---

## Version 6.5

### New features and enhancements

#### Message components

- **Custom message structure** - Messages now support more composable structures, allowing for greater flexibility in message layouts ([#785](https://github.com/patternfly/chatbot/pull/785))
- **Markdown support** - Added support for Markdown rendering in ToolCall, ToolResponse, and DeepThinking components ([#759](https://github.com/patternfly/chatbot/pull/759), [#783](https://github.com/patternfly/chatbot/pull/783))
- **Optional avatars** - Messages can now be displayed without avatars when needed ([#752](https://github.com/patternfly/chatbot/pull/752))
- **Code block custom actions** - Added support for custom actions in code blocks, enabling users to add custom message content ([#719](https://github.com/patternfly/chatbot/pull/719))
- **Default expand states** - ToolCall, ToolResponse, and DeepThinking components now support handling default expand states ([#777](https://github.com/patternfly/chatbot/pull/777))

#### Response actions

- **Persistent selections** - Added option for persistent selections in ResponseActions, allowing selections to remain visible after being made ([#740](https://github.com/patternfly/chatbot/pull/740))
- **Grouped actions** - Added response action groups, allowing each group to have its own unique selection state, separate from other response action groups for a message ([#764](https://github.com/patternfly/chatbot/pull/764))

#### Message bar

- **AI indicator styles** - Added AI indicator border and thinking animation to MessageBar ([#749](https://github.com/patternfly/chatbot/pull/749))
- **Custom attach button icons** - AttachButton now supports custom icons, enabling more flexible UI designs ([#751](https://github.com/patternfly/chatbot/pull/751))
- **AttachMenu enhancements** - Added ability to disable search input in AttachMenu and pass additional props for greater customization ([#750](https://github.com/patternfly/chatbot/pull/750), [#718](https://github.com/patternfly/chatbot/pull/718))

#### Conversation history

- **Search actions** - Added support for search actions in ConversationHistoryNav, allowing for filtering and sorting options ([#774](https://github.com/patternfly/chatbot/pull/774))

#### User feedback

- **Compact style and privacy statement** - Updated UserFeedback component with improved compact styling and added privacy statement support ([#771](https://github.com/patternfly/chatbot/pull/771))

#### Onboarding

- **Onboarding modal** - Added new Onboarding modal component for introducing users to the ChatBot ([#732](https://github.com/patternfly/chatbot/pull/732))

#### Background variants

- **Primary background support** - Added white/primary background variants for ChatbotContent, ChatbotFooter, and MessageBar, enabling better integration in embedded layouts ([#689](https://github.com/patternfly/chatbot/pull/689), [#690](https://github.com/patternfly/chatbot/pull/690), [#691](https://github.com/patternfly/chatbot/pull/691))

### Accessibility improvements

#### High contrast mode support

Added comprehensive high contrast mode support across multiple components:

- **Chatbot container** - Full high contrast support for all display modes (overlay, docked, fullscreen, embedded, and drawer) ([#711](https://github.com/patternfly/chatbot/pull/711))
- **Conversation history** - High contrast borders and styling for ConversationHistoryNav ([#729](https://github.com/patternfly/chatbot/pull/729))
- **Header toggle** - Updated border radius styling in high contrast mode ([#730](https://github.com/patternfly/chatbot/pull/730))
- **Message snippets** - Added high contrast borders to message snippets ([#733](https://github.com/patternfly/chatbot/pull/733))
- **ToolCall, DeepThinking, and ToolResponse** - Enhanced high contrast borders for better visibility ([#728](https://github.com/patternfly/chatbot/pull/728))
- **MessageLoading** - Added high contrast borders to loading indicators ([#712](https://github.com/patternfly/chatbot/pull/712))
- **UserFeedback** - Added high contrast borders to feedback components ([#713](https://github.com/patternfly/chatbot/pull/713))

### Bug fixes and improvements

#### Code handling

- **New syntax highlighter** - Replaced vulnerable react-syntax-highlighter with rehype-highlight for secure code highlighting ([#682](https://github.com/patternfly/chatbot/pull/682))
- **Monaco lazy loading** - Switched CodeModal to lazy load Monaco editor, significantly reducing bundle size for applications like Red Hat Developer Hub ([#763](https://github.com/patternfly/chatbot/pull/763))
- **CDN removal** - CodeEditor no longer relies on CDN for loading Monaco, improving compatibility with restricted environments ([#743](https://github.com/patternfly/chatbot/pull/743))
- **ResizeObserver fix** - Fixed ResizeObserver loop error that occurred in CodeModal ([#688](https://github.com/patternfly/chatbot/pull/688))

#### Styling and layout

- **MessageBar padding** - Updated padding on action buttons for better visual consistency ([#773](https://github.com/patternfly/chatbot/pull/773))
- **Message padding** - Updated padding for messages and avatars to improve spacing ([#753](https://github.com/patternfly/chatbot/pull/753))
- **Compact message avatars** - Fixed avatar size in compact message layout ([#754](https://github.com/patternfly/chatbot/pull/754))
- **ResponseActions focus state** - Adjusted focus background color for better accessibility ([#739](https://github.com/patternfly/chatbot/pull/739))
- **Footnote backref links** - Adjusted width of footnote backref links for improved readability ([#683](https://github.com/patternfly/chatbot/pull/683))
- **Header menu tooltip** - Fixed tooltip behavior when conversation history drawer is animating ([#758](https://github.com/patternfly/chatbot/pull/758))

#### Accessibility

- **Conversation history dropdown** - Added separate prop for aria-label to improve screen reader experience ([#684](https://github.com/patternfly/chatbot/pull/684))

---

For the complete list of changes, issues, and PRs, visit the [GitHub repository](https://github.com/patternfly/chatbot).
