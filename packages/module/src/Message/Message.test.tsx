import { Fragment } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Message from './Message';
import userEvent from '@testing-library/user-event';
import { monitorSampleAppQuickStart } from './QuickStarts/monitor-sampleapp-quickstart';
import { monitorSampleAppQuickStartWithImage } from './QuickStarts/monitor-sampleapp-quickstart-with-image';
import rehypeExternalLinks from '../__mocks__/rehype-external-links';
import { AlertActionLink } from '@patternfly/react-core';

const ALL_ACTIONS = [
  { label: /Good response/i },
  { label: /Bad response/i },
  { label: /Copy/i },
  { label: /Edit/i },
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
const TABLE = `

 | Column 1 | Column 2 |
 |-|-|
 | Cell 1 | Cell 2 |
 | Cell 3 | Cell 4 |

 `;

const ONE_COLUMN_TABLE = `

 | Column 1 |
 |-|
 | Cell 1 | 
 | Cell 2 |

 `;

const ONE_CELL_TABLE = `

 | Column 1 |
 |-|
 | Cell 1 | 

 `;

const HEADERLESS_TABLE = `

 | |
 |-|
 | Cell 1 | 

 `;

const CHILDLESS_TABLE = `

 | Column 1 |
 |-|
 | | 

 `;

const EMPTY_TABLE = `

 | |
 |-|
 | | 

 `;

const IMAGE = `![Multi-colored wavy lines on a black background](https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif)`;

const INLINE_IMAGE = `inline text ![Multi-colored wavy lines on a black background](https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif)`;

const ERROR = {
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
const checkListItemsRendered = () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  items.forEach((item) => {
    // list item text gets wrapped in a span by the third-party library so we can't just check the listitem
    expect(screen.getByText(item)).toBeTruthy();
  });
};

describe('Message', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
  it('should be able to handle isCompact', async () => {
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
            onClick: jest.fn(),
            className: 'test'
          }
        ]}
        isCompact
      />
    );
    const parent = screen.getByRole('button', { name: /Yes/i }).parentNode;
    expect(parent).toHaveClass('pf-m-compact');
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
          edit: { onClick: () => console.log('Edit') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') },
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
          edit: { onClick: () => console.log('Edit') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') },
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
  it('should not show actions if isEditable is true', async () => {
    render(
      <Message
        avatar="./img"
        role="bot"
        name="Bot"
        content="Hi"
        isEditable
        actions={{
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          edit: { onClick: () => console.log('Edit') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          download: { onClick: () => console.log('Download') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') }
        }}
      />
    );
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
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
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
  it('should render expandable code correctly', () => {
    render(
      <Message avatar="./img" role="user" name="User" content={CODE_MESSAGE} codeBlockProps={{ isExpandable: true }} />
    );
    expect(screen.getByText('Here is some YAML code:')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
    expect(screen.getByText(/yaml/)).toBeTruthy();
    expect(screen.getByText(/apiVersion/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Show more/i })).toBeTruthy();
  });
  it('should handle click on expandable code correctly', async () => {
    render(
      <Message avatar="./img" role="user" name="User" content={CODE_MESSAGE} codeBlockProps={{ isExpandable: true }} />
    );
    const button = screen.getByRole('button', { name: /Show more/i });
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: /Show less/i })).toBeTruthy();
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
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Copy code' }));
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
  it('should handle tool response correctly', async () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Hi"
        toolResponse={{
          toggleContent: 'Tool response: Name',
          subheading: 'Thought for 3 seconds',
          body: 'Lorem ipsum dolor sit amet',
          cardTitle: 'Card title',
          cardBody: 'Card body'
        }}
      />
    );
    expect(screen.getByRole('button', { name: /Tool response: Name/i })).toBeTruthy();
    expect(screen.getByText('Thought for 3 seconds')).toBeTruthy();
    expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeTruthy();
    expect(screen.getByText('Card title')).toBeTruthy();
    expect(screen.getByText('Card body')).toBeTruthy();
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
  it('should render table correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={TABLE} />);
    expect(screen.getByRole('row', { name: /Column 1 Column 2/i })).toBeTruthy();
    expect(screen.getByRole('row', { name: /Cell 1 Cell 2/i })).toBeTruthy();
    expect(screen.getByRole('row', { name: /Cell 3 Cell 4/i })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Column 1/i })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Column 2/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 1/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 2/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 3/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 4/i })).toBeTruthy();
  });
  it('should render table data labels correctly for mobile breakpoint', () => {
    render(<Message avatar="./img" role="user" name="User" content={TABLE} />);
    expect(screen.getByRole('row', { name: /Cell 1 Cell 2/i })).toHaveAttribute('extraHeaders', 'Column 1,Column 2');
    expect(screen.getByRole('row', { name: /Cell 3 Cell 4/i })).toHaveAttribute('extraHeaders', 'Column 1,Column 2');
    expect(screen.getByRole('cell', { name: /Cell 1/i })).toHaveAttribute('data-label', 'Column 1');
    expect(screen.getByRole('cell', { name: /Cell 2/i })).toHaveAttribute('data-label', 'Column 2');
    expect(screen.getByRole('cell', { name: /Cell 3/i })).toHaveAttribute('data-label', 'Column 1');
    expect(screen.getByRole('cell', { name: /Cell 4/i })).toHaveAttribute('data-label', 'Column 2');
  });
  it('should render table data labels correctly for mobile breakpoint for one column table', () => {
    render(<Message avatar="./img" role="user" name="User" content={ONE_COLUMN_TABLE} />);
    expect(screen.getByRole('row', { name: /Cell 1/i })).toHaveAttribute('extraHeaders', 'Column 1');
    expect(screen.getByRole('row', { name: /Cell 2/i })).toHaveAttribute('extraHeaders', 'Column 1');
    expect(screen.getByRole('cell', { name: /Cell 1/i })).toHaveAttribute('data-label', 'Column 1');
    expect(screen.getByRole('cell', { name: /Cell 2/i })).toHaveAttribute('data-label', 'Column 1');
  });
  it('should render table data labels correctly for mobile breakpoint for one cell table', () => {
    render(<Message avatar="./img" role="user" name="User" content={ONE_CELL_TABLE} />);
    expect(screen.getByRole('row', { name: /Cell 1/i })).toHaveAttribute('extraHeaders', 'Column 1');
    expect(screen.getByRole('cell', { name: /Cell 1/i })).toHaveAttribute('data-label', 'Column 1');
  });
  it('should render table data labels correctly for mobile breakpoint for headerless', () => {
    render(<Message avatar="./img" role="user" name="User" content={HEADERLESS_TABLE} />);
    expect(screen.getByRole('row', { name: /Cell 1/i })).toHaveAttribute('extraHeaders', '');
    expect(screen.getByRole('cell', { name: /Cell 1/i })).not.toHaveAttribute('data-label');
  });
  it('should render table data labels correctly for mobile breakpoint for childless', () => {
    render(<Message avatar="./img" role="user" name="User" content={CHILDLESS_TABLE} />);
    expect(screen.getByRole('cell')).not.toHaveAttribute('extraHeaders', 'Column 1');
  });
  it('should render table data labels correctly for mobile breakpoint for empty', () => {
    render(<Message avatar="./img" role="user" name="User" content={EMPTY_TABLE} />);
    expect(screen.getByRole('cell')).not.toHaveAttribute('extraHeaders', '');
  });
  it('should render custom table aria label correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={TABLE} tableProps={{ 'aria-label': 'Test' }} />);
    expect(screen.getByRole('grid', { name: /Test/i })).toBeTruthy();
  });
  it('should render beforeMainContent with main content', () => {
    const mainContent = 'Main message content';
    const beforeMainContentText = 'Before main content';
    const beforeMainContent = <div>{beforeMainContentText}</div>;

    render(
      <Message avatar="./img" role="user" name="User" content={mainContent} extraContent={{ beforeMainContent }} />
    );

    expect(screen.getByText(beforeMainContentText)).toBeTruthy();
    expect(screen.getByText(mainContent)).toBeTruthy();
  });
  it('should render afterMainContent with main content', () => {
    const mainContent = 'Main message content';
    const afterMainContentText = 'After main content';
    const afterMainContent = <div>{afterMainContentText}</div>;

    render(
      <Message avatar="./img" role="user" name="User" content={mainContent} extraContent={{ afterMainContent }} />
    );

    expect(screen.getByText(afterMainContentText)).toBeTruthy();
    expect(screen.getByText(mainContent)).toBeTruthy();
  });

  it('should render endContent with main content', () => {
    const mainContent = 'Main message content';
    const endMainContentText = 'End content';
    const endContent = <div>{endMainContentText}</div>;

    render(<Message avatar="./img" role="user" name="User" content={mainContent} extraContent={{ endContent }} />);

    expect(screen.getByText(endMainContentText)).toBeTruthy();
    expect(screen.getByText(mainContent)).toBeTruthy();
  });
  it('should render all parts of extraContent with main content', () => {
    const beforeMainContent = <div>Before main content</div>;
    const afterMainContent = <div>After main content</div>;
    const endContent = <div>End content</div>;

    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Main message content"
        extraContent={{ beforeMainContent, afterMainContent, endContent }}
      />
    );

    expect(screen.getByText('Before main content')).toBeTruthy();
    expect(screen.getByText('Main message content')).toBeTruthy();
    expect(screen.getByText('After main content')).toBeTruthy();
    expect(screen.getByText('End content')).toBeTruthy();
  });

  it('should not render extraContent when not provided', () => {
    render(<Message avatar="./img" role="user" name="User" content="Main message content" />);

    // Ensure no extraContent is rendered
    expect(screen.getByText('Main message content')).toBeTruthy();
    expect(screen.queryByText('Before main content')).toBeFalsy();
    expect(screen.queryByText('After main content')).toBeFalsy();
    expect(screen.queryByText('end message content')).toBeFalsy();
  });

  it('should handle undefined or null values in extraContent gracefully', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Main message content"
        extraContent={{ beforeMainContent: null, afterMainContent: undefined, endContent: null }}
      />
    );

    // Ensure that no extraContent is rendered if they are null or undefined
    expect(screen.getByText('Main message content')).toBeTruthy();
    expect(screen.queryByText('Before main content')).toBeFalsy();
    expect(screen.queryByText('After main content')).toBeFalsy();
    expect(screen.queryByText('end message content')).toBeFalsy();
  });
  it('should render JSX in extraContent correctly', () => {
    const beforeMainContent = (
      <div data-testid="before-main-content">
        <strong>Bold before content</strong>
      </div>
    );
    const afterMainContent = (
      <div data-testid="after-main-content">
        <strong>Bold after content</strong>
      </div>
    );
    const endContent = (
      <div data-testid="end-main-content">
        <strong>Bold end content</strong>
      </div>
    );
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content="Main message content"
        extraContent={{ beforeMainContent, afterMainContent, endContent }}
      />
    );

    // Check that the JSX is correctly rendered
    expect(screen.getByTestId('before-main-content')).toContainHTML('<strong>Bold before content</strong>');
    expect(screen.getByTestId('after-main-content')).toContainHTML('<strong>Bold after content</strong>');
    expect(screen.getByTestId('end-main-content')).toContainHTML('<strong>Bold end content</strong>');
  });
  it('should handle image correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={IMAGE} />);
    expect(screen.getByRole('img', { name: /Multi-colored wavy lines on a black background/i })).toBeTruthy();
  });
  it('inline image parent should have class pf-chatbot__message-and-actions', () => {
    render(<Message avatar="./img" role="user" name="User" content={INLINE_IMAGE} />);
    expect(screen.getByRole('img', { name: /Multi-colored wavy lines on a black background/i })).toBeTruthy();
    expect(
      screen.getByRole('img', { name: /Multi-colored wavy lines on a black background/i }).parentElement
    ).toHaveClass('pf-chatbot__message-and-actions');
  });
  it('should handle external links correctly', () => {
    render(<Message avatar="./img" role="user" name="User" content={`[PatternFly](https://www.patternfly.org/)`} />);
    // we are mocking rehype libraries, so we can't test target _blank addition on links directly with RTL
    expect(rehypeExternalLinks).toHaveBeenCalledTimes(1);
  });
  it('should handle external links correctly', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content={`[PatternFly](https://www.patternfly.org/)`}
        openLinkInNewTab={false}
      />
    );
    // we are mocking rehype libraries, so we can't test target _blank addition on links directly with RTL
    expect(rehypeExternalLinks).not.toHaveBeenCalled();
  });
  it('should handle extra link props correctly', async () => {
    const spy = jest.fn();
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content={`[PatternFly](https://www.patternfly.org/)`}
        linkProps={{ onClick: spy }}
      />
    );
    await userEvent.click(screen.getByRole('link', { name: /PatternFly/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should handle error correctly', () => {
    render(<Message avatar="./img" role="user" name="User" error={ERROR} />);
    expect(screen.getByRole('heading', { name: /Could not load chat/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Start a new chat/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Contact support/i })).toBeTruthy();
    expect(screen.getByText('Wait a few minutes and check your network settings. If the issue persists:')).toBeTruthy();
  });
  it('should handle error correctly when loading', () => {
    render(<Message avatar="./img" role="user" name="User" error={ERROR} isLoading />);
    expect(screen.queryByRole('heading', { name: /Could not load chat/i })).toBeFalsy();
    expect(screen.getByText('Loading message')).toBeTruthy();
  });
  it('should handle error correctly when these is content', () => {
    render(<Message avatar="./img" role="user" name="User" error={ERROR} content="Test" />);
    expect(screen.getByRole('heading', { name: /Could not load chat/i })).toBeTruthy();
    expect(screen.queryByText('Test')).toBeFalsy();
  });
  it('should handle isEditable when there is message content', () => {
    render(<Message avatar="./img" role="user" name="User" isEditable content="Test" />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('textbox')).toHaveValue('Test');
    expect(screen.getByRole('button', { name: /Update/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeTruthy();
  });
  it('should handle isEditable when there is no message content', () => {
    render(<Message avatar="./img" role="user" name="User" isEditable />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Edit prompt message...');
    expect(screen.getByRole('button', { name: /Update/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeTruthy();
  });
  it('should be able to change edit placeholder', () => {
    render(<Message avatar="./img" role="user" name="User" isEditable editPlaceholder="I am a placeholder" />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'I am a placeholder');
  });
  it('should be able to change updateWord', () => {
    render(<Message avatar="./img" role="user" name="User" isEditable updateWord="Submit" />);
    expect(screen.getByRole('button', { name: /Submit/i })).toBeTruthy();
  });
  it('should be able to change cancelWord', () => {
    render(<Message avatar="./img" role="user" name="User" isEditable cancelWord="Don't submit" />);
    expect(screen.getByRole('button', { name: /Don't submit/i })).toBeTruthy();
  });
  it('should be able to add onEditUpdate', async () => {
    const spy = jest.fn();
    render(<Message avatar="./img" role="user" name="User" isEditable onEditUpdate={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Update/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be able to add onEditCancel', async () => {
    const spy = jest.fn();
    render(<Message avatar="./img" role="user" name="User" isEditable onEditCancel={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be able to add  editFormProps', () => {
    const { container } = render(
      <Message avatar="./img" role="user" name="User" isEditable editFormProps={{ className: 'test' }} />
    );
    const form = container.querySelector('form');
    expect(form).toHaveClass('test');
  });
  it('should be able to disable markdown parsing', () => {
    render(<Message avatar="./img" role="user" name="User" content={CODE_MESSAGE} isMarkdownDisabled />);
    // this is looking for markdown syntax that is ordinarily stripped
    expect(screen.getByText(/~~~yaml/i)).toBeTruthy();
  });
  it('should be able to pass props to react-markdown, such as disabling tags', () => {
    render(
      <Message
        avatar="./img"
        role="user"
        name="User"
        content={CODE_MESSAGE}
        reactMarkdownProps={{ disallowedElements: ['code'] }}
      />
    );
    expect(screen.getByText('Here is some YAML code:')).toBeTruthy();
    // code block isn't rendering
    expect(screen.queryByRole('button', { name: 'Copy code' })).toBeFalsy();
  });
});
