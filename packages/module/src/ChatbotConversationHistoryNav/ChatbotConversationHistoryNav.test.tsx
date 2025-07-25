import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  describe('Editable conversations', () => {
    const editableConversations: Conversation = {
      id: '1',
      text: 'ChatBot documentation',
      isEditing: true,
      listItemProps: {
        className: 'test'
      },
      inputProps: {
        id: 'test'
      }
    };

    it('Passes titleProps to Title', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={{ Today: [editableConversations] }}
          titleProps={{ className: 'test' }}
        />
      );
      expect(screen.getByRole('heading', { name: /Today/i })).toHaveClass('test');
    });

    it('Overrides Title heading level when titleProps.headingLevel is passed', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={{ Today: [editableConversations] }}
          titleProps={{ headingLevel: 'h2' }}
        />
      );
      expect(screen.queryByRole('heading', { name: /Today/i, level: 4 })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Today/i, level: 2 })).toBeInTheDocument();
    });

    it('Passes listProps to List when conversations is an array', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={initialConversations}
          listProps={{ className: 'test' }}
        />
      );
      expect(screen.getByRole('list')).toHaveClass('test');
    });

    it('Passes listProps to List when conversations is an object', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={{ Today: [editableConversations] }}
          listProps={{ Today: { className: 'test' } }}
        />
      );
      expect(screen.getByRole('list')).toHaveClass('test');
    });

    it('Passes listItemProps to ListItem', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[editableConversations]}
        />
      );
      expect(screen.getByRole('listitem')).toHaveClass('test');
    });

    it('Renders conversation as button when isEditing is false', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={initialConversations}
        />
      );
      expect(screen.getByRole('button', { name: /ChatBot documentation/i })).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('Renders conversation as text input when isEditing is true', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[editableConversations]}
        />
      );
      expect(
        screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i })
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /ChatBot documentation/i })).not.toBeInTheDocument();
    });

    it('Passes inputProps to TextInput', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[editableConversations]}
        />
      );
      expect(
        screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i })
      ).toHaveAttribute('id', 'test');
    });

    it('Renders conversation input with custom aria-label when inputAriaLabel is passed', () => {
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[
            {
              ...editableConversations,
              inputAriaLabel: 'Edit name for guidelines'
            }
          ]}
        />
      );
      expect(screen.getByDisplayValue('ChatBot documentation')).toHaveAccessibleName('Edit name for guidelines');
    });

    it('Does not call onChange on input by default', async () => {
      const onChange = jest.fn();
      render(
        <>
          <input type="text" aria-label="Other input" />
          <ChatbotConversationHistoryNav
            onDrawerToggle={onDrawerToggle}
            isDrawerOpen={true}
            displayMode={ChatbotDisplayMode.fullscreen}
            setIsDrawerOpen={jest.fn()}
            conversations={[{ ...editableConversations, onChange }]}
          />
        </>
      );
      const input = screen.getByRole('textbox', { name: /Other input/i });
      await userEvent.type(input, 'New value');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('Calls onChange when input is changed', async () => {
      const onChange = jest.fn();
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[{ ...editableConversations, onChange }]}
        />
      );
      const input = screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i });
      await userEvent.type(input, 'New value');
      expect(onChange).toHaveBeenCalled();
    });

    it('Does not call onBlur on input by default', async () => {
      const onBlur = jest.fn();
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[{ ...editableConversations, onBlur }]}
        />
      );
      const input = screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i });
      await userEvent.click(input);
      expect(onBlur).not.toHaveBeenCalled();
    });

    it('Calls onBlur when input is blurred', async () => {
      const onBlur = jest.fn();
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[{ ...editableConversations, onBlur }]}
        />
      );
      const input = screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i });
      await userEvent.click(input);
      await userEvent.tab();
      expect(onBlur).toHaveBeenCalled();
    });

    it('Does not call onKeyDown on input by default', async () => {
      const onKeyDown = jest.fn();
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[{ ...editableConversations, onKeyDown }]}
        />
      );
      expect(onKeyDown).not.toHaveBeenCalled();
    });

    it('Calls onKeyDown when input is focused and key is pressed', async () => {
      const onKeyDown = jest.fn();
      render(
        <ChatbotConversationHistoryNav
          onDrawerToggle={onDrawerToggle}
          isDrawerOpen={true}
          displayMode={ChatbotDisplayMode.fullscreen}
          setIsDrawerOpen={jest.fn()}
          conversations={[{ ...editableConversations, onKeyDown }]}
        />
      );
      const input = screen.getByRole('textbox', { name: /Edit conversation name for ChatBot documentation/i });

      await userEvent.type(input, 'Enter');
      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
