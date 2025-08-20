import {
  CSSProperties,
  useState,
  Fragment,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  Ref
} from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import squareImg from './PF-social-color-square.svg';
import {
  AlertActionLink,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption
} from '@patternfly/react-core';
import { rehypeCodeBlockToggle } from '@patternfly/chatbot/dist/esm/Message/Plugins/rehypeCodeBlockToggle';

export const BotMessageExample: FunctionComponent = () => {
  const [variant, setVariant] = useState<string>('Code');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('Message content type');
  const [isExpandable, setIsExpanded] = useState(false);

  /* eslint-disable indent */
  const renderContent = () => {
    switch (variant) {
      case 'Code':
      case 'Expandable code':
        return code;
      case 'Heading':
        return heading;
      case 'Emphasis':
        return emphasis;
      case 'Block quotes':
        return blockQuotes;
      case 'Ordered list':
        return orderedList;
      case 'Unordered list':
        return unorderedList;
      case 'More complex list':
        return moreComplexList;
      case 'Inline code':
        return inlineCode;
      case 'Link':
        return link;
      case 'Table':
        return table;
      case 'Image':
        return image;
      case 'Footnote':
        return footnote;
      default:
        return;
    }
  };
  /* eslint-enable indent */

  const code = `
Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~

Here is some JavaScript code:

~~~js
const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;

~~~
`;

  const heading = `
# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading
`;

  const emphasis = `
**Bold text, formatted with double asterisks**

__Bold text, formatted with double underscores__

*Italic text, formatted with single asterisks*

_Italic text, formatted with single underscores_

~~Strikethrough~~
`;

  const blockQuotes = `> Blockquotes can also be nested...
>> ...by using additional greater-than signs (>) right next to each other...
> > > ...or with spaces between each sign.`;

  const orderedList = `
  Here is an ordered list:

  1. Item 1
  2. Item 2
  3. Item 3`;

  const unorderedList = `
  Here is an unordered list:

  * Item 1
  * Item 2
  * Item 3`;

  const moreComplexList = `You may be wondering whether you can display more complex lists with formatting. In response to your question, I will explain how to spread butter on toast.

1. **Using a \`toaster\`:**

   - Place \`bread\` in a \`toaster\`.
   - Once \`bread\` is lightly browned, remove from \`toaster\`.

2. **Using a \`knife\`:**

     Acquire 1 tablespoon of room temperature \`butter\`. Use \`knife\` to spread butter on \`toast\`. Bon appétit!
 `;

  const link = `A paragraph with a URL: https://reactjs.org.`;

  const inlineCode = `Here is an inline code - \`() => void\``;

  const table = `To customize your table, you can use [PatternFly TableProps](/components/table#table)

 | Version | GA date | User role 
 |-|-|-|
 | 2.5 | September 30, 2024 | Administrator |
 | 2.5 | June 27, 2023 | Editor |
 | 3.0 | April 1, 2025 | Administrator
 `;

  const image = `![Multi-colored wavy lines on a black background](https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif)`;

  const footnote = `This is some text that has a short footnote[^1] and this is text with a longer footnote.[^bignote]

You can also reference the same footnote multiple times[^1].

  [^1]: This is a short footnote. To return the highlight to the original message, click the arrow. 
  
  [^bignote]: This is a long footnote with multiple paragraphs and formatting.

      To break long footnotes into paragraphs, indent the text. 

      Add as many paragraphs as you like. You can include *italic text*, **bold text**, and \`code\`.

      > You can even include blockquotes in footnotes!`;

  const error = {
    title: 'Could not load chat',
    children: 'Wait a few minutes and check your network settings. If the issue persists: ',
    actionLinks: (
      <Fragment>
        <AlertActionLink component="a" href="#">
          Start a new chat
        </AlertActionLink>
        <AlertActionLink component="a" href="#">
          Contact support
        </AlertActionLink>
      </Fragment>
    )
  };

  const onSelect = (_event: ReactMouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setVariant(value as string);
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Expandable code') {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <MenuToggle
      className="pf-v6-u-mb-md"
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as CSSProperties
      }
    >
      {selected}
    </MenuToggle>
  );

  const handleFootnoteNavigation = (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    // Depending on whether it is a click event or keyboard event, target may be a link or something like a span
    // Look for the closest anchor element (could be a parent)
    const anchorElement = target.closest('a');
    const href = anchorElement?.getAttribute('href');

    // Check if this is a footnote link - we only have internal links in this example, so this is all we need here
    if (href && href.startsWith('#')) {
      // Prevent default behavior to avoid page re-render on click in PatternFly docs framework
      event.preventDefault();

      let targetElement: HTMLElement | null = null;
      const targetId = href.replace('#', '');
      targetElement = document.querySelector(`[id="${targetId}"]`);

      if (targetElement) {
        let focusTarget = targetElement;

        // If we found a footnote definition container, focus on the parent li element
        if (targetElement.id?.startsWith('bot-message-fn-')) {
          // Find the parent li element that contains the footnote
          const parentLi = targetElement.closest('li');
          if (parentLi) {
            focusTarget = parentLi as HTMLElement;
          }
        }

        focusTarget.focus();

        let elementToHighlight = targetElement;

        // If this is a backref link (going back to footnote reference),
        // we want to highlight more of the ref line and not just the link itself
        // since the target is so small
        if (targetElement.id?.startsWith('bot-message-fnref-')) {
          const refLink = targetElement;

          // Walk up the DOM to find a meaningful container
          let parent = refLink.parentElement;
          while (parent && parent.tagName.toLowerCase() !== 'p' && parent !== document.body) {
            parent = parent.parentElement;
          }

          // Use if found, otherwise use the immediate parent or target as a fallback
          elementToHighlight = parent || refLink.parentElement || targetElement;
        }

        // Briefly highlight the target element for fun to show what you can do
        const originalBackground = elementToHighlight.style.backgroundColor;
        const originalTransition = elementToHighlight.style.transition;

        elementToHighlight.style.transition = 'background-color 0.3s ease';
        elementToHighlight.style.backgroundColor = 'var(--pf-t--global--background--color--tertiary--default)';

        setTimeout(() => {
          elementToHighlight.style.backgroundColor = originalBackground;
          setTimeout(() => {
            elementToHighlight.style.transition = originalTransition;
          }, 300);
        }, 1000);
      }
    }
  };

  const onClick = (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
    handleFootnoteNavigation(event);
  };

  return (
    <>
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content={`This is a text-based message from a bot named "Bot."`}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content={`This is a text-based message from "Bot," with an updated timestamp.`}
        timestamp="1 hour ago"
      />
      <Message name="Bot" role="bot" avatar={patternflyAvatar} content="Example content" isLoading />
      <Message role="bot" avatar={patternflyAvatar} content="This message is from a nameless bot." />
      <Message
        name="Default Openshift Container Platform Assistant That Can Help With Any Query You Might Need Help With"
        role="bot"
        avatar={patternflyAvatar}
        content="This is a message from a bot with really long name: it's truncated!"
      />
      <Message
        name="Bot"
        role="bot"
        avatar={squareImg}
        content="This bot has a square avatar. You can further customize the avatar by applying an additional class or passing [PatternFly avatar props](/components/avatar) to the `<Message>` component via `avatarProps`."
        hasRoundAvatar={false}
      />
      <Select
        id="single-select"
        isOpen={isOpen}
        selected={selected}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setIsOpen(isOpen)}
        toggle={toggle}
        shouldFocusToggleOnSelect
      >
        <SelectList>
          <SelectOption value="Code">Code</SelectOption>
          <SelectOption value="Expandable code">Expandable code</SelectOption>
          <SelectOption value="Inline code">Inline code</SelectOption>
          <SelectOption value="Heading">Heading</SelectOption>
          <SelectOption value="Block quotes">Block quotes</SelectOption>
          <SelectOption value="Emphasis">Emphasis</SelectOption>
          <SelectOption value="Link">Link</SelectOption>
          <SelectOption value="Unordered list">Unordered list</SelectOption>
          <SelectOption value="Ordered list">Ordered list</SelectOption>
          <SelectOption value="More complex list">More complex list</SelectOption>
          <SelectOption value="Table">Table</SelectOption>
          <SelectOption value="Image">Image</SelectOption>
          <SelectOption value="Footnote">Footnote</SelectOption>
          <SelectOption value="Error">Error</SelectOption>
        </SelectList>
      </Select>
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content={renderContent()}
        tableProps={
          variant === 'Table' ? { 'aria-label': 'App information and user roles for bot messages' } : undefined
        }
        error={variant === 'Error' ? error : undefined}
        codeBlockProps={{ isExpandable, expandableSectionProps: { truncateMaxLines: isExpandable ? 1 : undefined } }}
        // In this example, custom plugin will override any custom expandedText or collapsedText attributes provided
        // The purpose of this plugin is to provide unique link names for the code blocks
        // Because they are in the same message, this requires a custom plugin to parse the syntax tree
        additionalRehypePlugins={[rehypeCodeBlockToggle]}
        linkProps={{ onClick }}
        // clobberPrefix controls the label ids
        reactMarkdownProps={{
          remarkRehypeOptions: { footnoteLabel: 'Bot message footnotes', clobberPrefix: 'bot-message-' }
        }}
      />
    </>
  );
};
