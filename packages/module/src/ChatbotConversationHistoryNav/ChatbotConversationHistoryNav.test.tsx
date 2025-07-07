import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ChatbotDisplayMode } from '../Chatbot/Chatbot';
import ChatbotConversationHistoryNav, { Conversation } from './ChatbotConversationHistoryNav';
import { EmptyStateStatus, Spinner } from '@patternfly/react-core';
import { OutlinedCommentsIcon, SearchIcon } from '@patternfly/react-icons';
import { ComponentType } from 'react';

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
    expect(screen.getByRole('dialog', { name: /Loading chatbot conversation history/i })).toBeTruthy();
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
    expect(screen.getByRole('textbox', { name: /Filter menu items/i })).toBeTruthy();
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
    expect(screen.getByRole('textbox', { name: /Filter menu items/i })).toBeTruthy();
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
    expect(screen.getByText('Chat History')).toBeInTheDocument();
  });

  it('should display the custom title', () => {
    render(
      <ChatbotConversationHistoryNav
        title="PatternFly History"
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
      />
    );
    expect(screen.getByText('PatternFly History')).toBeInTheDocument();
  });

  it('should display the clock icon', () => {
    render(
      <ChatbotConversationHistoryNav
        onDrawerToggle={onDrawerToggle}
        isDrawerOpen={true}
        displayMode={ChatbotDisplayMode.fullscreen}
        setIsDrawerOpen={jest.fn()}
        conversations={initialConversations}
        data-testid="clock-icon"
      />
    );
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });
});
