import React from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import { AlertActionLink, Form, FormGroup, Radio } from '@patternfly/react-core';

export const UserMessageExample: React.FunctionComponent = () => {
  const [variant, setVariant] = React.useState('code');
  const [isEditable, setIsEditable] = React.useState(true);

  /* eslint-disable indent */
  const renderContent = () => {
    switch (variant) {
      case 'code':
        return code;
      case 'inlineCode':
        return inlineCode;
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
      case 'link':
        return link;
      case 'table':
        return table;
      case 'image':
        return image;
      default:
        return '';
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

  - Place \`bread\` in a \`toaster\`
  - Once \`bread\` is lightly browned, remove from \`toaster\`

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

  const error = {
    title: 'Could not load chat',
    children: 'Wait a few minutes and check your network settings. If the issue persists: ',
    actionLinks: (
      <React.Fragment>
        <AlertActionLink component="a" href="#">
          Start a new chat
        </AlertActionLink>
        <AlertActionLink component="a" href="#">
          Contact support
        </AlertActionLink>
      </React.Fragment>
    )
  };

  return (
    <>
      <Message
        name="User"
        role="user"
        content="This is a user message with an updated timestamp."
        timestamp="1 hour ago"
        avatar={userAvatar}
      />
      <Message
        name="User"
        role="user"
        content="This is a user message with `avatarProps` set to add a border."
        avatar={userAvatar}
        avatarProps={{ isBordered: true }}
      />
      <Form>
        <FormGroup role="radiogroup" isInline fieldId="user-message-type" label="Message content type">
          <Radio
            isChecked={variant === 'code'}
            onChange={() => {
              setVariant('code');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Code"
            id="user-code"
          />
          <Radio
            isChecked={variant === 'inlineCode'}
            onChange={() => {
              setVariant('inlineCode');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Inline code"
            id="user-inline-code"
          />
          <Radio
            isChecked={variant === 'heading'}
            onChange={() => {
              setVariant('heading');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Heading"
            id="user-heading"
          />
          <Radio
            isChecked={variant === 'blockQuotes'}
            onChange={() => {
              setVariant('blockQuotes');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Block quote"
            id="user-block-quotes"
          />
          <Radio
            isChecked={variant === 'emphasis'}
            onChange={() => {
              setVariant('emphasis');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Emphasis"
            id="user-emphasis"
          />
          <Radio
            isChecked={variant === 'link'}
            onChange={() => {
              setVariant('link');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Link"
            id="user-link"
          />
          <Radio
            isChecked={variant === 'unorderedList'}
            onChange={() => {
              setVariant('unorderedList');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Unordered list"
            id="user-unordered-list"
          />
          <Radio
            isChecked={variant === 'orderedList'}
            onChange={() => {
              setVariant('orderedList');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Ordered list"
            id="user-ordered-list"
          />
          <Radio
            isChecked={variant === 'moreComplexList'}
            onChange={() => {
              setVariant('moreComplexList');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="More complex list"
            id="user-more-complex-list"
          />
          <Radio
            isChecked={variant === 'table'}
            onChange={() => {
              setVariant('table');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Table"
            id="user-table"
          />
          <Radio
            isChecked={variant === 'image'}
            onChange={() => {
              setVariant('image');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Image"
            id="user-image"
          />
          <Radio
            isChecked={variant === 'error'}
            onChange={() => {
              setVariant('error');
              setIsEditable(true);
            }}
            name="user-message-type"
            label="Error"
            id="user-error"
          />
          <Radio
            isChecked={variant === 'editable'}
            onChange={() => setVariant('editable')}
            name="user-message-type"
            label="Editable"
            id="user-edit"
          />
        </FormGroup>
      </Form>
      <Message
        name="User"
        role="user"
        content={renderContent()}
        avatar={userAvatar}
        tableProps={
          variant === 'table' ? { 'aria-label': 'App information and user roles for user messages' } : undefined
        }
        isEditable={variant === 'editable' ? isEditable : false}
        error={variant === 'error' ? error : undefined}
        onEditUpdate={() => setIsEditable(false)}
        onEditCancel={() => setIsEditable(false)}
      />
    </>
  );
};
