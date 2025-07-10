import { useState, FunctionComponent } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import { Checkbox, EmptyStateStatus, Spinner } from '@patternfly/react-core';
import { OutlinedCommentsIcon, SearchIcon } from '@patternfly/react-icons';

const initialConversations: { [key: string]: Conversation[] } = {
  Today: [{ id: '1', text: 'Red Hat products and services' }],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup'
    },
    { id: '3', text: 'Troubleshoot system crash' }
  ],
  March: [
    { id: '4', text: 'Ansible security and updates' },
    { id: '5', text: 'Red Hat certification' },
    { id: '6', text: 'Lightspeed user documentation' }
  ],
  February: [
    { id: '7', text: 'Crashing pod assistance' },
    { id: '8', text: 'OpenShift AI pipelines' },
    { id: '9', text: 'Updating subscription plan' },
    { id: '10', text: 'Red Hat licensing options' }
  ],
  January: [
    { id: '11', text: 'RHEL system performance' },
    { id: '12', text: 'Manage user accounts' }
  ]
};

const ERROR = {
  bodyText: (
    <>
      To try again, check your connection and reload this page. If the issue persists,{' '}
      <a href="">contact the support team</a>.
    </>
  ),
  buttonText: 'Reload',
  buttonIcon: <Spinner size="sm" />,
  hasButton: true,
  titleText: 'Could not load chat history',
  status: EmptyStateStatus.danger,
  onClick: () => alert('Clicked Reload')
};

const NO_RESULTS = {
  bodyText: 'Adjust your search query and try again. Check your spelling or try a more general term.',
  titleText: 'No results found',
  icon: SearchIcon
};

const EMPTY_STATE = {
  bodyText: 'Access timely assistance by starting a conversation with an AI model.',
  titleText: 'Start a new chat',
  icon: OutlinedCommentsIcon
};

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isButtonOrderReversed, setIsButtonOrderReversed] = useState(false);
  const [isNewChatButtonDisabled, setIsNewChatButtonDisabled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const displayMode = ChatbotDisplayMode.embedded;

  const findMatchingItems = (targetValue: string) => {
    const filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});

    // append message if no items are found
    if (Object.keys(filteredConversations).length === 0) {
      setHasNoResults(true);
    } else {
      setHasNoResults(false);
    }
    return filteredConversations;
  };

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isOpen}
        onChange={() => {
          setIsOpen(!isOpen);
          setConversations(initialConversations);
        }}
        id="drawer-visible"
        name="drawer-visible"
      />
      <Checkbox
        label="Reverse action buttons"
        isChecked={isButtonOrderReversed}
        onChange={() => setIsButtonOrderReversed(!isButtonOrderReversed)}
        id="drawer-actions-visible"
        name="drawer-actions-visible"
      ></Checkbox>
      <Checkbox
        label="Disable new chat button"
        isChecked={isNewChatButtonDisabled}
        onChange={() => setIsNewChatButtonDisabled(!isNewChatButtonDisabled)}
        id="drawer-actions-disabled"
        name="drawer-actions-disabled"
      ></Checkbox>
      <Checkbox
        label="Show loading state"
        isChecked={isLoading}
        onChange={() => setIsLoading(!isLoading)}
        id="drawer-is-loading"
        name="drawer-is-loading"
      ></Checkbox>
      <Checkbox
        label="Show error state"
        isChecked={hasError}
        onChange={() => setHasError(!hasError)}
        id="drawer-has-error"
        name="drawer-has-error"
      ></Checkbox>
      <Checkbox
        label="Show empty state"
        isChecked={isEmpty}
        onChange={() => setIsEmpty(!isEmpty)}
        id="drawer-is-empty"
        name="drawer-is-empty"
      ></Checkbox>
      <Checkbox
        label="Show no results state"
        isChecked={hasNoResults}
        onChange={() => setHasNoResults(!hasNoResults)}
        id="drawer-has-no-results"
        name="drawer-has-no-results"
      ></Checkbox>
      <Checkbox
        label="Show compact version"
        isChecked={isCompact}
        onChange={() => setIsCompact(!isCompact)}
        id="drawer-compact"
        name="drawer-compact"
      ></Checkbox>
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => setIsOpen(!isOpen)}
        isDrawerOpen={isOpen}
        setIsDrawerOpen={setIsOpen}
        // eslint-disable-next-line no-console
        onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
        conversations={conversations}
        newChatButtonProps={{ isDisabled: isNewChatButtonDisabled }}
        onNewChat={() => {
          setIsOpen(!isOpen);
        }}
        reverseButtonOrder={isButtonOrderReversed}
        handleTextInputChange={(value: string) => {
          if (value === '') {
            setConversations(initialConversations);
          }
          // this is where you would perform search on the items in the drawer
          // and update the state
          const newConversations: { [key: string]: Conversation[] } = findMatchingItems(value);
          setConversations(newConversations);
        }}
        drawerContent={<div>Drawer content</div>}
        isLoading={isLoading}
        errorState={hasError ? ERROR : undefined}
        emptyState={isEmpty ? EMPTY_STATE : undefined}
        noResultsState={hasNoResults ? NO_RESULTS : undefined}
        isCompact={isCompact}
      />
    </>
  );
};
