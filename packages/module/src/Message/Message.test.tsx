import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Message from './Message';
import userEvent from '@testing-library/user-event';
import { monitorSampleAppQuickStart } from './QuickStarts/monitor-sampleapp-quickstart';
import { monitorSampleAppQuickStartWithImage } from './QuickStarts/monitor-sampleapp-quickstart-with-image';

const ALL_ACTIONS = [
  { label: /Good response/i },
  { label: /Bad response/i },
  { label: /Copy/i },
  { label: /Share/i },
  { label: /Listen/i }
];

const UNORDERED_LIST = `
  Here is an unordered list:

  * Item 1
  * Item 2
  * Item 3
`;

const ORDERED_LIST = `
  Here is an ordered list:

  1. Item 1
  2. Item 2
  3. Item 3
`;

const CODE_MESSAGE = `
Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~`;

const CODE = `
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
`;

const INLINE_CODE = `Here is an inline code - \`() => void\``;

const ORDERED_LIST_WITH_CODE = `
1. Item 1
2. Item 2

\`\`\`yaml
- name: Hello World Playbook
  hosts: localhost
  tasks:
    - name: Print Hello World
      ansible.builtin.debug:
        msg: "Hello, World!"
\`\`\`

3. Item 3
`;

const HEADING = `
# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading
`;

const BLOCK_QUOTES = `> Blockquotes can also be nested...
>> ...by using additional greater-than signs (>) right next to each other...
> > > ...or with spaces between each sign.`;

const checkListItemsRendered = () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  items.forEach((item) => {
    // list item text gets wrapped in a span by the third-party library so we can't just check the listitem
    expect(screen.getByText(item)).toBeTruthy();
  });
};

describe('Message', () => {
  it('should render user messages correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content="Hi" />);
    expect(screen.getByText('User')).toBeTruthy();
    expect(screen.getByText('Hi')).toBeTruthy();
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    expect(
      screen.getByText((content, element) => {
        const hasText = content.includes(formattedDate);
        const isVisible = element?.tagName.toLowerCase() !== 'script' && element?.tagName.toLowerCase() !== 'style';
        return hasText && isVisible;
      })
    ).toBeInTheDocument();
    expect(screen.queryByText('Loading message')).toBeFalsy();
    expect(screen.getByRole('img')).toHaveAttribute('src', './img');
  });
  it('should render bot messages correctly', () => {
    render(<Message avatar="./img" role="bot" name="Bot" content="Hi" />);
    expect(screen.getByText('Bot')).toBeTruthy();
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.getByText('Hi')).toBeTruthy();
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    expect(
      screen.getByText((content, element) => {
        const hasText = content.includes(formattedDate);
        const isVisible = element?.tagName.toLowerCase() !== 'script' && element?.tagName.toLowerCase() !== 'style';
        return hasText && isVisible;
      })
    ).toBeInTheDocument();
  });
  it('should render avatar correctly', () => {
    render(<Message avatar="./testImg" role="bot" name="Bot" content="Hi" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', './testImg');
  });
  it('should render botWord correctly', () => {
    render(<Message avatar="./img" role="bot" name="Bot" content="Hi" botWord="人工知能" />);
    expect(screen.getByText('Bot')).toBeTruthy();
    expect(screen.getByText('人工知能')).toBeTruthy();
    expect(screen.queryByText('AI')).toBeFalsy();
    expect(screen.getByText('Hi')).toBeTruthy();
  });
  it('should render timestamps', () => {
    render(<Message avatar="./img" role="bot" name="Bot" content="Hi" timestamp="2 hours ago" />);
    expect(screen.getByText('Bot')).toBeTruthy();
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.getByText('Hi')).toBeTruthy();
    expect(screen.getByText('2 hours ago')).toBeTruthy();
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    expect(
      screen.queryByText((content, element) => {
        const hasText = content.includes(formattedDate);
        const isVisible = element?.tagName.toLowerCase() !== 'script' && element?.tagName.toLowerCase() !== 'style';
        return hasText && isVisible;
      })
    ).not.toBeInTheDocument();
  });
  it('should render attachments', () => {
    render(<Message avatar="./img" role="user" content="Hi" attachments={[{ name: 'testAttachment' }]} />);
    expect(screen.getByText('Hi')).toBeTruthy();
    expect(screen.getByText('testAttachment')).toBeTruthy();
  });
  it('should be able to click attachments', async () => {
    const spy = jest.fn();
    render(
      <Message avatar="./img" role="user" content="Hi" attachments={[{ name: 'testAttachment', onClick: spy }]} />
    );
    expect(screen.getByText('Hi')).toBeTruthy();
    expect(screen.getByText('testAttachment')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /testAttachment/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be able to close attachments', async () => {
    const spy = jest.fn();
    render(
      <Message avatar="./img" role="user" content="Hi" attachments={[{ name: 'testAttachment', onClose: spy }]} />
    );
    expect(screen.getByText('Hi')).toBeTruthy();
    expect(screen.getByText('testAttachment')).toBeTruthy();
    expect(screen.getByRole('button', { name: /close testAttachment/i })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /close testAttachment/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should render loading state', () => {
    render(<Message avatar="./img" role="bot" name="Bot" content="Hi" isLoading />);
    expect(screen.getByText('Bot')).toBeTruthy();
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.queryByText('Hi')).toBeFalsy();
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    expect(
      screen.getByText((content, element) => {
        const hasText = content.includes(formattedDate);
        const isVisible = element?.tagName.toLowerCase() !== 'script' && element?.tagName.toLowerCase() !== 'style';
        return hasText && isVisible;
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading message')).toBeTruthy();
  });
  it('should be able to show sources', async () => {
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...'
            }
          ]
        }}
      />
    );
    expect(screen.getByText('Getting started with Red Hat OpenShift')).toBeTruthy();
  });
  it('should not show sources if loading', () => {
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        isLoading
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...'
            }
          ]
        }}
      />
    );
    expect(screen.getByText('Loading message')).toBeTruthy();
    expect(screen.queryByText('Getting started with Red Hat OpenShift')).toBeFalsy();
  });
  it('should be able to show quick response', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        quickResponses={[
          {
            id: '1',
            content: 'Yes',
            onClick: spy,
            className: 'test'
          }
        ]}
      />
    );
    const quickResponse = screen.getByRole('button', { name: /Yes/i });
    expect(quickResponse).toBeTruthy();
    await userEvent.click(quickResponse);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be able to show more than 1 quick response', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        quickResponses={[
          {
            id: '1',
            content: 'Yes',
            onClick: spy
          },
          {
            id: '2',
            content: 'No',
            onClick: spy
          }
        ]}
      />
    );
    expect(screen.getByRole('button', { name: /Yes/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /No/i })).toBeTruthy();
  });
  it('should be able to spread quickResponseContainerProps', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        quickResponses={[
          {
            id: '1',
            content: 'Yes',
            onClick: spy
          },
          {
            id: '2',
            content: 'No',
            onClick: spy
          }
        ]}
        // this is a LabelGroup prop that changes the default number shown
        // to be different than what we use in ChatBot
        quickResponseContainerProps={{ numLabels: 1 }}
      />
    );
    expect(screen.getByRole('button', { name: /Yes/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /No/i })).toBeFalsy();
    expect(screen.getByRole('button', { name: /1 more/i }));
  });
  it('should be able to show actions', async () => {
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        actions={{
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }}
      />
    );
    ALL_ACTIONS.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    });
  });
  it('should not show actions if loading', async () => {
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        isLoading
        actions={{
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }}
      />
    );
    expect(screen.getByText('Loading message')).toBeTruthy();
    ALL_ACTIONS.forEach(({ label }) => {
      expect(screen.queryByRole('button', { name: label })).toBeFalsy();
    });
  });
  it('should render unordered lists correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={UNORDERED_LIST} />);
    expect(screen.getByText('Here is an unordered list:')).toBeTruthy();
    checkListItemsRendered();
  });
  it('should render ordered lists correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={ORDERED_LIST} />);
    expect(screen.getByText('Here is an ordered list:')).toBeTruthy();
    checkListItemsRendered();
  });
  it('should render ordered lists correctly if there is interstitial content', () => {
    render(<Message avatar="./img" role="user" name="User" content={ORDERED_LIST_WITH_CODE} />);
    checkListItemsRendered();
    const list = screen.getAllByRole('list')[1];
    expect(list).toHaveAttribute('start', '3');
  });
  it('should render inline code', () => {
    render(<Message avatar="./img" role="user" name="User" content={INLINE_CODE} />);
    expect(screen.getByText(/() => void/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Copy code button' })).toBeFalsy();
  });
  it('should render code correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={CODE_MESSAGE} />);
    expect(screen.getByText('Here is some YAML code:')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy code button' })).toBeTruthy();
    expect(screen.getByText(/yaml/)).toBeTruthy();
    expect(screen.getByText(/apiVersion:/i)).toBeTruthy();
    expect(screen.getByText(/helm.openshift.io\/v1beta1/i)).toBeTruthy();
    expect(screen.getByText(/metadata:/i)).toBeTruthy();
    expect(screen.getByText(/name:/i)).toBeTruthy();
    expect(screen.getByText(/azure-sample-repo0oooo00ooo/i)).toBeTruthy();
    expect(screen.getByText(/spec/i)).toBeTruthy();
    expect(screen.getByText(/connectionConfig:/i)).toBeTruthy();
    expect(screen.getByText(/url:/i)).toBeTruthy();
    expect(
      screen.getByText(/https:\/\/raw.githubusercontent.com\/Azure-Samples\/helm-charts\/master\/docs/i)
    ).toBeTruthy();
  });
  it('can click copy code button', async () => {
    // need explicit setup since RTL stubs clipboard if you do this
    const user = userEvent.setup();
    render(<Message avatar="./img" role="user" name="User" content={CODE_MESSAGE} />);
    expect(screen.getByRole('button', { name: 'Copy code button' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Copy code button' }));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText.trim()).toEqual(CODE.trim());
  });
  it('should handle codeBlockProps correctly by spreading it onto the CodeMessage', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content={CODE_MESSAGE}
        codeBlockProps={{ 'aria-label': 'test' }}
      />
    );
    expect(screen.getByRole('button', { name: 'test' })).toBeTruthy();
  });
  it('should handle hasRoundAvatar correctly when it is true', () => {
    render(<Message avatar="./img" role="user" name="User" content="Hi" hasRoundAvatar />);
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByRole('img')).toHaveClass('pf-chatbot__message-avatar');
    expect(screen.getByRole('img')).toHaveClass('pf-chatbot__message-avatar--round');
  });
  it('should handle hasRoundAvatar correctly when it is false', () => {
    render(<Message avatar="./img" role="user" name="User" content="Hi" hasRoundAvatar={false} />);
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByRole('img')).toHaveClass('pf-chatbot__message-avatar');
    expect(screen.getByRole('img')).not.toHaveClass('pf-chatbot__message-avatar--round');
  });
  it('should handle avatarProps correctly by spreading it onto the Message Avatar', () => {
    render(<Message avatar="./img" role="user" name="User" content="Hi" avatarProps={{ className: 'test' }} />);
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByRole('img')).toHaveClass('test');
  });
  it('should handle avatarProps and hasRoundAvatar correctly', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Hi"
        avatarProps={{ className: 'test' }}
        hasRoundAvatar={false}
      />
    );
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByRole('img')).toHaveClass('test');
    expect(screen.getByRole('img')).toHaveClass('pf-chatbot__message-avatar');
  });
  it('should handle QuickStart tile correctly', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Hi"
        quickStarts={{
          quickStart: monitorSampleAppQuickStart,
          onSelectQuickStart: (id) => alert(id)
        }}
      />
    );
    expect(screen.getByRole('button', { name: 'Monitoring your sample application' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '1 Prerequisite' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show prerequisites' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
  });
  it('should handle click on QuickStart tile correctly', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Hi"
        quickStarts={{
          quickStart: monitorSampleAppQuickStart,
          onSelectQuickStart: (id) => spy(id)
        }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Monitoring your sample application' }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(monitorSampleAppQuickStart.metadata.name);
  });
  it('should handle QuickStart tile with image correctly', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Hi"
        quickStarts={{
          quickStart: monitorSampleAppQuickStartWithImage,
          onSelectQuickStart: (id) => spy(id)
        }}
      />
    );
    expect(screen.getAllByRole('img')[1]).toHaveAttribute('src', 'test.png');
  });
  it('should handle block quote correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={BLOCK_QUOTES} />);
    expect(screen.getByText(/Blockquotes can also be nested.../)).toBeTruthy();
    expect(screen.getByText('...by using additional greater-than signs (>) right next to each other...')).toBeTruthy();
    expect(screen.getByText(/...or with spaces between each sign./)).toBeTruthy();
  });
  it('should handle heading correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={HEADING} />);
    expect(screen.getByRole('heading', { name: /h1 Heading/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /h2 Heading/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /h3 Heading/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /h4 Heading/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /h5 Heading/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /h6 Heading/i })).toBeTruthy();
  });
});
