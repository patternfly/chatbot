import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import squareImg from './PF-social-color-square.svg';
import { Form, FormGroup, Radio } from '@patternfly/react-core';

export const BotMessageExample: React.FunctionComponent = () => {
  const [variant, setVariant] = React.useState('code');

  /* eslint-disable indent */
  const renderContent = () => {
    switch (variant) {
      case 'code':
        return code;
      case 'heading':
        return heading;
      case 'emphasis':
        return emphasis;
      case 'blockQuotes':
        return blockQuotes;
      case 'orderedList':
        return orderedList;
      case 'unorderedList':
        return unorderedList;
      case 'moreComplexList':
        return moreComplexList;
      case 'inlineCode':
        return inlineCode;
      case 'link':
        return link;
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
import React from 'react';

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
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content={`Text-based message from a bot named "Bot," with updated timestamp`}
        timestamp="1 hour ago"
      />
      <Message name="Bot" role="bot" avatar={patternflyAvatar} content="Example content" isLoading />

      <Form>
        <FormGroup role="radiogroup" isInline fieldId="bot-message-type" label="Message content type">
          <Radio
            isChecked={variant === 'code'}
            onChange={() => setVariant('code')}
            name="bot-message-type"
            label="Code"
            id="code"
          />
          <Radio
            isChecked={variant === 'inlineCode'}
            onChange={() => setVariant('inlineCode')}
            name="bot-message-type"
            label="Inline code"
            id="inline-code"
          />
          <Radio
            isChecked={variant === 'heading'}
            onChange={() => setVariant('heading')}
            name="bot-message-type"
            label="Heading"
            id="heading"
          />
          <Radio
            isChecked={variant === 'blockQuotes'}
            onChange={() => setVariant('blockQuotes')}
            name="bot-message-type"
            label="Block quote"
            id="block-quotes"
          />
          <Radio
            isChecked={variant === 'emphasis'}
            onChange={() => setVariant('emphasis')}
            name="bot-message-type"
            label="Emphasis"
            id="emphasis"
          />
          <Radio
            isChecked={variant === 'link'}
            onChange={() => setVariant('link')}
            name="bot-message-type"
            label="Link"
            id="link"
          />
          <Radio
            isChecked={variant === 'unorderedList'}
            onChange={() => setVariant('unorderedList')}
            name="bot-message-type"
            label="Unordered list"
            id="unordered-list"
          />
          <Radio
            isChecked={variant === 'orderedList'}
            onChange={() => setVariant('orderedList')}
            name="bot-message-type"
            label="Ordered list"
            id="ordered-list"
          />
          <Radio
            isChecked={variant === 'moreComplexList'}
            onChange={() => setVariant('moreComplexList')}
            name="bot-message-type"
            label="More complex list"
            id="more-complex-list"
          />
        </FormGroup>
      </Form>
      <Message name="Bot" role="bot" avatar={patternflyAvatar} content={renderContent()} />
    </>
  );
};
