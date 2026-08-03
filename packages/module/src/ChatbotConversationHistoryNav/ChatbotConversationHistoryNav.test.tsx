import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ChatbotDisplayMode } from '../Chatbot/Chatbot';
import ChatbotConversationHistoryNav, { Conversation, ConversationGroup } from './ChatbotConversationHistoryNav';
import { EmptyStateStatus, Spinner, MenuItem } from '@patternfly/react-core';
import { BellIcon, OutlinedCommentsIcon, SearchIcon } from '@patternfly/react-icons';
import { ComponentType, useState } from 'react';

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
  icon: SearchIcon as ComponentType<any>
};

const EMPTY_STATE = {
  bodyText: 'Access timely assistance by starting a conversation with an AI model.',
  titleText: 'Start a new chat',
  icon: OutlinedCommentsIcon as ComponentType<any>
};

const ERROR_WITHOUT_BUTTON = {
  bodyText: (
    <>
      To try again, check your connection and reload this page. If the issue persists,{' '}
      <a href="">contact the support team</a>.
    </>
  ),
  buttonText: 'Reload',
  buttonIcon: <Spinner size="sm" />,
  hasButton: false,
  titleText: 'Could not load chat history',
  status: EmptyStateStatus.danger,
  onClick: () => alert('Clicked Reload')
};

describe('ChatbotConversationHistoryNav', () => {
  const onDrawerToggle = jest.fn();

  const initialConversations: Conversation[] = [
    {
      id: '1',
      text: 'ChatBot documentation'
    }
  ];

  it('should open the conversation history navigation drawer', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
      />
    );
    expect(screen.queryByText('ChatBot documentation')).toBeInTheDocument();
  });

  it('should display the conversations for grouped conversations', () => {
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groupedConversations}
      />
    );
    expect(screen.queryByText('Chatbot extension')).toBeInTheDocument();
  });

  it('should apply the reversed class when reverseButtonOrder is true', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder
        conversations={initialConversations}
      />
    );

    expect(screen.getByTestId('chatbot-nav-drawer-actions')).toHaveClass('pf-v6-c-drawer__actions--reversed');
  });

  it('should disable new chat button', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder
        conversations={initialConversations}
        newChatButtonProps={{ isDisabled: true }}
        onNewChat={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'New chat' })).toBeDisabled();
  });

  it('should not apply the reversed class when reverseButtonOrder is false', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        conversations={initialConversations}
      />
    );
    expect(screen.getByTestId('chatbot-nav-drawer-actions')).not.toHaveClass('pf-v6-c-drawer__actions--reversed');
  });

  it('should invoke handleTextInputChange callback when user searches for conversations', () => {
    const handleSearch = jest.fn();
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        conversations={groupedConversations}
        handleTextInputChange={handleSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search/i);

    fireEvent.change(searchInput, { target: { value: 'Chatbot' } });

    expect(handleSearch).toHaveBeenCalledWith('Chatbot');
  });

  it('should close the drawer when escape key is pressed', async () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
      />
    );

    fireEvent.keyDown(screen.getByPlaceholderText(/Search/i), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    });

    waitFor(() => {
      expect(screen.queryByText('ChatBot documentation')).not.toBeInTheDocument();
    });
  });

  it('should be resizable', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerPanelContentProps={{ isResizable: true, minSize: '200px' }}
      />
    );
    expect(screen.getByRole('dialog', { name: /Resize/i })).toBeTruthy();
    expect(screen.getByRole('separator', { name: /Resize/i })).toBeTruthy();
    expect(screen.getByRole('dialog', { name: /Resize/i })).toHaveAttribute(
      'style',
      '--pf-v6-c-drawer__panel--md--FlexBasis: 384px; --pf-v6-c-drawer__panel--md--FlexBasis--min: 200px;'
    );
  });

  it('should accept drawerContentProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerContentProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should accept drawerContentBodyProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerContentBodyProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should accept drawerHeadProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerHeadProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should accept drawerActionsProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerActionsProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should accept drawerCloseButtonProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerCloseButtonProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should accept drawerPanelBodyProps', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        drawerPanelBodyProps={{ className: 'test' }}
      />
    );
    const element = container.querySelector('.test');
    expect(element).toBeInTheDocument();
  });

  it('should show loading state if triggered', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        isLoading
      />
    );
    expect(screen.getByRole('dialog', { name: /Loading chatbot chat history/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Close drawer panel/i })).toBeTruthy();
  });

  it('should pass alternative aria label to loading state', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        isLoading
        loadingState={{ screenreaderText: 'I am a test' }}
      />
    );
    expect(screen.getByRole('dialog', { name: /I am a test/i })).toBeTruthy();
  });

  it('should accept errorState', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        errorState={ERROR}
      />
    );
    expect(
      screen.getByRole('dialog', {
        name: /Could not load chat history To try again, check your connection and reload this page. If the issue persists, contact the support team . Loading... Reload/i
      })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Close drawer panel/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Loading... Reload/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /Search previous conversations/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Could not load chat history/i })).toBeTruthy();
  });

  it('should accept errorState without button', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        errorState={ERROR_WITHOUT_BUTTON}
      />
    );
    expect(
      screen.getByRole('dialog', {
        name: /Could not load chat history To try again, check your connection and reload this page. If the issue persists, contact the support team ./i
      })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Close drawer panel/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Loading... Reload/i })).toBeFalsy();
    expect(screen.getByRole('textbox', { name: /Search previous conversations/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Could not load chat history/i })).toBeTruthy();
  });

  it('should show loading state over error state if both are supplied', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        isLoading
        errorState={ERROR}
      />
    );
    expect(screen.getByRole('dialog', { name: /Loading/i })).toBeTruthy();
  });

  it('should accept emptyState', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        emptyState={EMPTY_STATE}
      />
    );
    expect(
      screen.getByRole('dialog', {
        name: /Start a new chat Access timely assistance by starting a conversation with an AI model./i
      })
    ).toBeTruthy();
  });

  it('should accept no results state', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        noResultsState={NO_RESULTS}
      />
    );
    expect(
      screen.getByRole('dialog', {
        name: /No results found Adjust your search query and try again. Check your spelling or try a more general term./i
      })
    ).toBeTruthy();
  });

  it('should handle isCompact', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={jest.fn()}
        conversations={initialConversations}
        noResultsState={NO_RESULTS}
        isCompact
        data-testid="drawer"
      />
    );
    expect(screen.getByTestId('drawer')).toHaveClass('pf-m-compact');
  });

  it('should display the default title', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
      />
    );
    expect(screen.getByText('Chat history')).toBeInTheDocument();
  });

  it('should display the custom title', () => {
    render(
      <ChatbotConversationHistoryNav
        title="PatternFly history"
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
      />
    );
    expect(screen.getByText('PatternFly history')).toBeInTheDocument();
  });

  it('should display the clock icon', () => {
    const { container } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
      />
    );
    const iconElement = container.querySelector('.pf-chatbot__title-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('Passes menuProps to Menu', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        menuProps={{ className: 'test' }}
      />
    );

    expect(screen.getByRole('menu').parentElement?.parentElement).toHaveClass('test');
  });

  it('Passes menuContentProps to MenuContent', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        menuContentProps={{ className: 'test' }}
      />
    );
    expect(screen.getByRole('menu').parentElement).toHaveClass('test');
  });

  it('Passes menuListProps to MenuList when conversations is an array', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        menuListProps={{ className: 'test' }}
      />
    );
    expect(screen.getByRole('menu')).toHaveClass('test');
  });

  it('Passes menuListProps to MenuList when conversations is an object', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={{ Today: initialConversations }}
        menuListProps={{ Today: { className: 'test' } }}
      />
    );
    expect(screen.getByRole('menu')).toHaveClass('test');
  });

  it('Passes menuGroupProps to MenuGroup when conversations is an object', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={{ Today: initialConversations }}
        menuGroupProps={{ Today: { className: 'test' } }}
      />
    );
    expect(screen.getByRole('menu').parentElement).toHaveClass('test');
  });

  it('Passes additionalProps to MenuItem', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={[{ id: '1', text: 'ChatBot documentation', additionalProps: { className: 'test' } }]}
      />
    );
    expect(screen.getByRole('menuitem')).toHaveClass('test');
  });

  it('should be able to spread search input props when searchInputProps is passed', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        handleTextInputChange={jest.fn()}
        searchInputProps={{ value: 'I am a sample search' }}
      />
    );

    expect(screen.getByRole('dialog', { name: /Chat history I am a sample search/i })).toBeInTheDocument();
  });

  it('Does not render search actions by default', () => {
    const handleSearch = jest.fn();
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        conversations={groupedConversations}
        handleTextInputChange={handleSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search/i);

    expect(searchInput.parentElement?.previousElementSibling).toBeNull();
    expect(searchInput.parentElement?.nextElementSibling).toBeNull();
  });

  it('Renders with action at start when searchActionStart is passed', () => {
    const handleSearch = jest.fn();
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        conversations={groupedConversations}
        handleTextInputChange={handleSearch}
        searchActionStart={<div>Search action start test</div>}
      />
    );

    expect(screen.getByText('Search action start test')).toBeVisible();
  });

  it('Renders with action at end when searchActionEnd is passed', () => {
    const handleSearch = jest.fn();
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        handleTextInputChange={handleSearch}
        conversations={groupedConversations}
        searchActionEnd={<div>Search action end test</div>}
      />
    );

    expect(screen.getByText('Search action end test')).toBeVisible();
  });

  it('Overrides default search input and actions when searchToolbar is passed', () => {
    const handleSearch = jest.fn();
    const groupedConversations: { [key: string]: Conversation[] } = {
      Today: [...initialConversations, { id: '2', text: 'Chatbot extension' }]
    };

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        reverseButtonOrder={false}
        conversations={groupedConversations}
        handleTextInputChange={handleSearch}
        searchActionStart={<div>Search action start test</div>}
        searchActionEnd={<div>Search action end test</div>}
        searchToolbar={<div>Custom toolbar</div>}
      />
    );

    expect(screen.queryByPlaceholderText(/Search/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Search action start test')).not.toBeInTheDocument();
    expect(screen.queryByText('Search action end test')).not.toBeInTheDocument();
    expect(screen.getByText('Custom toolbar')).toBeInTheDocument();
  });

  it('overrides nav title heading level when navTitleProps.headingLevel is passed', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={{ Today: initialConversations }}
        navTitleProps={{ headingLevel: 'h1' }}
      />
    );
    expect(screen.queryByRole('heading', { name: /Chat history/i, level: 2 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Chat history/i, level: 1 })).toBeInTheDocument();
  });

  it('overrides nav title icon when navTitleIcon is passed in', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        navTitleIcon={<BellIcon data-testid="bell" />}
      />
    );
    expect(screen.getByTestId('bell')).toBeInTheDocument();
  });

  it('renders static and expandable groups from ConversationGroup[]', () => {
    const groups: ConversationGroup[] = [
      {
        id: 'pinned',
        label: 'Pinned chats',
        items: initialConversations
      },
      {
        id: 'chats',
        label: 'Chats',
        expandable: {
          isExpanded: true,
          onToggle: jest.fn()
        },
        items: [{ id: '2', text: 'Chatbot extension' }]
      }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    expect(screen.getByRole('heading', { name: 'Pinned chats', level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pinned chats' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chats' })).toBeInTheDocument();
  });

  it('labels each MenuGroup with aria-labelledby referencing its visible label', () => {
    const groups: ConversationGroup[] = [
      {
        id: 'pinned',
        label: 'Pinned chats',
        items: initialConversations
      },
      {
        id: 'chats',
        label: 'Chats',
        expandable: {
          isExpanded: true,
          onToggle: jest.fn()
        },
        items: [{ id: '2', text: 'Chatbot extension' }]
      }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    const pinnedHeading = screen.getByRole('heading', { name: 'Pinned chats', level: 3 });
    expect(pinnedHeading).toHaveAttribute('id', 'chatbot-nav-group-pinned-label');
    expect(pinnedHeading.closest('section')).toHaveAttribute('aria-labelledby', 'chatbot-nav-group-pinned-label');

    const chatsToggle = screen.getByRole('button', { name: 'Chats' });
    expect(chatsToggle).toHaveAttribute('id', 'chatbot-nav-group-chats-toggle');
    expect(chatsToggle.closest('section')).toHaveAttribute('aria-labelledby', 'chatbot-nav-group-chats-toggle');
  });

  it('moves focus to the first menu item when an expandable group is expanded', async () => {
    const ExpandableGroupDemo = () => {
      const [isExpanded, setIsExpanded] = useState(false);

      return (
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.embedded}
          setIsDrawerOpen={jest.fn()}
          conversations={[
            {
              id: 'saved-prompts',
              label: 'Saved prompts',
              expandable: {
                isExpanded,
                onToggle: setIsExpanded
              },
              items: [
                { id: '7', text: 'Summarize this document' },
                { id: '8', text: 'Draft a release announcement' }
              ]
            }
          ]}
        />
      );
    };

    render(<ExpandableGroupDemo />);

    fireEvent.click(screen.getByRole('button', { name: 'Saved prompts' }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Summarize this document' })).toHaveFocus();
    });
  });

  it("does not render a collapsed group's menu items so they cannot dead-end keyboard navigation", () => {
    const groups: ConversationGroup[] = [
      {
        id: 'chats',
        label: 'Chats',
        items: [
          { id: '2', text: 'Chat two' },
          { id: '3', text: 'Chat three' }
        ]
      },
      {
        id: 'saved-prompts',
        label: 'Saved prompts',
        expandable: {
          isExpanded: false,
          onToggle: jest.fn()
        },
        items: [
          { id: '7', text: 'Summarize this document' },
          { id: '8', text: 'Draft a release announcement' }
        ]
      }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.embedded}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    // Collapsed content should not merely be visually hidden - it should not be in the
    // document at all, otherwise the Menu's LI-based arrow key handler will still see it,
    // try (and fail) to focus it, and dead-end navigation at the preceding item.
    expect(screen.queryByRole('menuitem', { name: 'Summarize this document' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Draft a release announcement' })).not.toBeInTheDocument();

    const firstItem = screen.getByRole('menuitem', { name: 'Chat two' });
    const lastItem = screen.getByRole('menuitem', { name: 'Chat three' });

    lastItem.focus();
    fireEvent.keyDown(lastItem, { key: 'ArrowDown' });

    expect(firstItem).toHaveFocus();
  });

  it('collapses and expands a group when expandable.onToggle is called', async () => {
    const onToggle = jest.fn();
    const groups: ConversationGroup[] = [
      {
        id: 'chats',
        label: 'Chats',
        expandable: {
          isExpanded: true,
          onToggle
        },
        items: [{ id: '2', text: 'Chatbot extension' }]
      }
    ];

    const { rerender } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    expect(screen.getByRole('menuitem', { name: /Chatbot extension/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Chats' }));
    expect(onToggle).toHaveBeenCalledWith(false);

    rerender(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={[
          {
            ...groups[0],
            expandable: {
              isExpanded: false,
              onToggle
            }
          }
        ]}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /Chatbot extension/i })).not.toBeInTheDocument();
    });
  });

  it('renders custom menu items and footers supplied in ConversationGroup', () => {
    const groups: ConversationGroup[] = [
      {
        id: 'chats',
        label: 'Chats',
        items: [
          initialConversations[0],
          <MenuItem key="show-all" itemId="show-all">
            Show all
          </MenuItem>
        ],
        footer: <div data-testid="group-footer">Footer content</div>
      }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    expect(screen.getByRole('menuitem', { name: 'Show all' })).toBeInTheDocument();
    expect(screen.getByTestId('group-footer')).toBeInTheDocument();
  });

  it('moves focus to the first overflow item when show all is expanded', async () => {
    const recentChats: Conversation[] = [
      { id: '2', text: 'Chat two' },
      { id: '3', text: 'Chat three' },
      { id: '4', text: 'Chat four' },
      { id: '5', text: 'Chat five' },
      { id: '6', text: 'Chat six' }
    ];
    const VISIBLE_CHAT_COUNT = 3;

    const ShowAllDemo = () => {
      const [isShowingAllChats, setIsShowingAllChats] = useState(false);

      return (
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.embedded}
          setIsDrawerOpen={jest.fn()}
          conversations={[
            {
              id: 'chats',
              label: 'Chats',
              items: recentChats,
              showAll: {
                visibleCount: VISIBLE_CHAT_COUNT,
                isExpanded: isShowingAllChats,
                onToggle: setIsShowingAllChats
              }
            }
          ]}
        />
      );
    };

    render(<ShowAllDemo />);

    fireEvent.click(screen.getByRole('menuitem', { name: /Show all/i }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Chat five' })).toHaveFocus();
    });
  });

  it('keeps focus on the toggle when show all is collapsed', async () => {
    const recentChats: Conversation[] = [
      { id: '2', text: 'Chat two' },
      { id: '3', text: 'Chat three' },
      { id: '4', text: 'Chat four' },
      { id: '5', text: 'Chat five' }
    ];

    const ShowAllDemo = () => {
      const [isShowingAllChats, setIsShowingAllChats] = useState(true);

      return (
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.embedded}
          setIsDrawerOpen={jest.fn()}
          conversations={[
            {
              id: 'chats',
              label: 'Chats',
              items: recentChats,
              showAll: {
                visibleCount: 2,
                isExpanded: isShowingAllChats,
                onToggle: setIsShowingAllChats
              }
            }
          ]}
        />
      );
    };

    render(<ShowAllDemo />);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Show less' }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /Show all/i })).toHaveFocus();
    });
  });

  it('renders overflow items above the show all toggle so it stays in a fixed position', () => {
    const recentChats: Conversation[] = [
      { id: '2', text: 'Chat two' },
      { id: '3', text: 'Chat three' },
      { id: '4', text: 'Chat four' }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.embedded}
        setIsDrawerOpen={jest.fn()}
        conversations={[
          {
            id: 'chats',
            label: 'Chats',
            items: recentChats,
            showAll: {
              visibleCount: 1,
              isExpanded: true,
              onToggle: jest.fn()
            }
          }
        ]}
      />
    );

    const overflowItem = screen.getByRole('menuitem', { name: 'Chat four' });
    const toggle = screen.getByRole('menuitem', { name: 'Show less' });
    const isToggleAfterOverflowItem = Boolean(
      // eslint-disable-next-line no-bitwise
      overflowItem.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING
    );

    expect(isToggleAfterOverflowItem).toBe(true);
  });

  it('allows arrow key navigation to flow through the show all toggle like any other menu item', async () => {
    const recentChats: Conversation[] = [
      { id: '2', text: 'Chat two' },
      { id: '3', text: 'Chat three' },
      { id: '4', text: 'Chat four' }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.embedded}
        setIsDrawerOpen={jest.fn()}
        conversations={[
          {
            id: 'chats',
            label: 'Chats',
            items: recentChats,
            showAll: {
              visibleCount: 2,
              isExpanded: false,
              onToggle: jest.fn()
            }
          }
        ]}
      />
    );

    const lastVisibleItem = screen.getByRole('menuitem', { name: 'Chat three' });
    const toggle = screen.getByRole('menuitem', { name: /Show all/i });

    lastVisibleItem.focus();
    fireEvent.keyDown(lastVisibleItem, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(toggle).toHaveFocus();
    });

    fireEvent.keyDown(toggle, { key: 'ArrowUp' });

    await waitFor(() => {
      expect(lastVisibleItem).toHaveFocus();
    });
  });

  it('preserves custom menu item identity when preceding items change', () => {
    const renderShowAll = () => (
      <MenuItem key="show-all-chats" itemId="show-all-chats">
        Show all
      </MenuItem>
    );

    const { rerender } = render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={[
          {
            id: 'chats',
            label: 'Chats',
            items: [initialConversations[0], renderShowAll()]
          }
        ]}
      />
    );

    const showAllBefore = screen.getByRole('menuitem', { name: 'Show all' });

    rerender(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={[
          {
            id: 'chats',
            label: 'Chats',
            items: [initialConversations[0], initialConversations[1], initialConversations[2], renderShowAll()]
          }
        ]}
      />
    );

    expect(screen.getByRole('menuitem', { name: 'Show all' })).toBe(showAllBefore);
  });

  it('passes expandableSectionProps from expandable ConversationGroup', () => {
    const groups: ConversationGroup[] = [
      {
        id: 'saved',
        label: 'Saved prompts',
        expandable: {
          isExpanded: true,
          onToggle: jest.fn(),
          expandableSectionProps: { className: 'test-expandable-section' }
        },
        items: initialConversations
      }
    ];

    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={groups}
      />
    );

    expect(document.querySelector('.test-expandable-section')).toBeInTheDocument();
  });
});
