import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Brand, Bullseye, Menu, MenuContent, MenuItem, MenuList, Popper, SkipToContent } from '@patternfly/react-core';

import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotHeader, { ChatbotHeaderMain, ChatbotHeaderTitle } from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import PFHorizontalLogoColor from '../UI/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '../UI/PF-HorizontalLogo-Reverse.svg';
import userAvatar from '../Messages/user_avatar.svg';

interface Command {
  id: string;
  command: string;
  description: string;
}

const commands: Command[] = [
  { id: 'skills', command: '/skills', description: 'List available skills' },
  { id: 'help', command: '/help', description: 'Show help information' },
  { id: 'summarize', command: '/summarize', description: 'Summarize the conversation' },
  { id: 'clear', command: '/clear', description: 'Clear conversation history' },
  { id: 'feedback', command: '/feedback', description: 'Provide feedback' },
  { id: 'export', command: '/export', description: 'Export conversation' }
];

const commandResponses: Record<string, string> = {
  skills: 'Listed the available skills.',
  help: 'Displayed the available slash commands.',
  summarize: 'Summarized the conversation.',
  clear: 'Cleared the conversation history.',
  feedback: 'Opened the feedback flow.',
  export: 'Exported the conversation.'
};

const footnoteProps = {
  label: 'Always review AI-generated content prior to use.'
};

const welcomePrompts = [
  {
    title: 'Run a command with context',
    message: 'Type / to choose a command, then describe what you want it to do'
  },
  {
    title: 'Try multiple commands',
    message: 'For example, type /summarize and /export with additional context'
  }
];

const commandMenuId = 'chatbot-command-parsing-menu';

const generateId = () => (Date.now() + Math.random()).toString();

const getCommandMatches = (value: string) => {
  const matches = value.match(/\/(skills|help|summarize|clear|feedback|export)\b/gi) || [];
  return matches.map((match) => match.slice(1).toLowerCase());
};

export const ChatbotCommandParsingDemo: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [message, setMessage] = useState('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState(-1);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setIsCommandMenuOpen(false);
        setTriggerPosition(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCommandSelect = (command: Command) => {
    const cursorPosition = textareaRef.current?.selectionStart || message.length;
    const beforeTrigger = message.substring(0, triggerPosition);
    const afterCursor = message.substring(cursorPosition);
    const newMessage = `${beforeTrigger}${command.command} ${afterCursor}`;
    const newCursorPosition = beforeTrigger.length + command.command.length + 1;

    setMessage(newMessage);
    setIsCommandMenuOpen(false);
    setTriggerPosition(-1);
    setFilteredCommands([]);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleChange = (_event: React.ChangeEvent<HTMLTextAreaElement>, value: string | number) => {
    const newValue = value.toString();
    const cursorPosition = textareaRef.current?.selectionStart || newValue.length;
    setMessage(newValue);

    const lastChar = newValue[cursorPosition - 1];
    const commandStart = newValue.lastIndexOf('/', cursorPosition - 1);
    const isCommandStart = commandStart === 0 || newValue[commandStart - 1] === ' ';

    if (lastChar === '/' && isCommandStart) {
      setTriggerPosition(commandStart);
      setFilteredCommands(commands);
      setActiveItemIndex(0);
      setIsCommandMenuOpen(true);
    } else if (isCommandMenuOpen && triggerPosition >= 0) {
      const searchTerm = newValue.substring(triggerPosition + 1, cursorPosition);
      if (searchTerm.includes(' ') || cursorPosition <= triggerPosition || newValue[triggerPosition] !== '/') {
        setIsCommandMenuOpen(false);
        setTriggerPosition(-1);
      } else {
        const filtered = commands.filter(
          (command) =>
            command.command.toLowerCase().includes(`/${searchTerm.toLowerCase()}`) ||
            command.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCommands(filtered);
        setActiveItemIndex(0);
      }
    }
  };

  const handleCommandExecution = (commandIds: string[], context: string) => {
    const results = commandIds.map((commandId) => {
      const result = commandResponses[commandId];
      return `**/${commandId}**: ${result}`;
    });
    const contextLine = context ? `\n\nContext supplied: ${context}` : '';
    const responseMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: `${results.join('\n')}\n${contextLine}`,
      name: 'Bot',
      timestamp: new Date().toLocaleString(),
      actions: { positive: {}, negative: {}, copy: {}, download: {} }
    };
    setMessages((previous) => [...previous, responseMessage]);
    setAnnouncement(`Ran ${commandIds.length} command${commandIds.length === 1 ? '' : 's'}.`);
  };

  const handleSend = (value: string | number) => {
    const input = value.toString().trim();
    if (!input) {
      return;
    }

    const commandIds = getCommandMatches(input);
    if (commandIds.length > 0) {
      const context = input.replace(/\/(skills|help|summarize|clear|feedback|export)\b/gi, '').trim();
      setIsSendButtonDisabled(true);
      setMessage('');
      setAnnouncement(`Running ${commandIds.length} command${commandIds.length === 1 ? '' : 's'}.`);
      setMessages((previous) => [
        ...previous,
        {
          id: generateId(),
          role: 'bot',
          content: `Running ${commandIds.map((id) => `/${id}`).join(', ')}...`,
          name: 'Bot',
          isLoading: true,
          timestamp: new Date().toLocaleString()
        }
      ]);

      setTimeout(() => {
        setMessages((previous) => previous.slice(0, -1));
        handleCommandExecution(commandIds, context);
        setIsSendButtonDisabled(false);
      }, 2000);
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: generateId(),
        role: 'user',
        content: input,
        name: 'User',
        avatar: userAvatar,
        timestamp: new Date().toLocaleString(),
        avatarProps: { isBordered: true }
      }
    ]);
    setMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isCommandMenuOpen || filteredCommands.length === 0) {
      if (event.key === 'Enter' && !event.shiftKey && !isSendButtonDisabled) {
        event.preventDefault();
        handleSend(message);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveItemIndex((previous) => (previous + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveItemIndex((previous) => (previous - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        event.preventDefault();
        handleCommandSelect(filteredCommands[activeItemIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        setIsCommandMenuOpen(false);
        setTriggerPosition(-1);
        break;
    }
  };

  const commandMenu = (
    <Menu
      ref={menuRef}
      id={commandMenuId}
      role="listbox"
      onSelect={(_event, itemId) => {
        const command = filteredCommands.find((item) => item.id === itemId?.toString());
        if (command) {
          handleCommandSelect(command);
        }
      }}
    >
      <MenuContent>
        <MenuList aria-label="Commands">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <MenuItem
                key={command.id}
                id={`${commandMenuId}-${command.id}`}
                itemId={command.id}
                description={command.description}
                isFocused={index === activeItemIndex}
              >
                {command.command}
              </MenuItem>
            ))
          ) : (
            <MenuItem isDisabled>No commands found</MenuItem>
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="PatternFly" />
    </Bullseye>
  );

  const handleSkipToContent = (event: React.MouseEvent) => {
    event.preventDefault();
    chatbotRef.current?.focus();
  };

  return (
    <>
      <SkipToContent onClick={handleSkipToContent} href="#">
        Skip to chatbot
      </SkipToContent>
      <Chatbot isVisible displayMode={ChatbotDisplayMode.fullscreen} ref={chatbotRef}>
        <ChatbotHeader>
          <ChatbotHeaderMain>
            <ChatbotHeaderTitle displayMode={ChatbotDisplayMode.fullscreen} showOnFullScreen={horizontalLogo} />
          </ChatbotHeaderMain>
        </ChatbotHeader>
        <ChatbotContent>
          <MessageBox announcement={announcement}>
            <ChatbotWelcomePrompt
              title="Hi, ChatBot User!"
              description="Choose one or more commands, add context, and send the message to run them."
              prompts={welcomePrompts}
            />
            {messages.map((item, index) => {
              if (index === messages.length - 1) {
                return (
                  <div key={item.id}>
                    <div ref={scrollToBottomRef}></div>
                    <Message {...item} />
                  </div>
                );
              }
              return <Message key={item.id} {...item} />;
            })}
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <Popper
            triggerRef={textareaRef}
            popper={commandMenu}
            isVisible={isCommandMenuOpen}
            enableFlip
            placement="top-start"
          />
          <MessageBar
            onSendMessage={handleSend}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            innerRef={textareaRef}
            role="combobox"
            aria-label="Message"
            aria-autocomplete="list"
            aria-controls={commandMenuId}
            aria-expanded={isCommandMenuOpen}
            aria-haspopup="listbox"
            aria-activedescendant={
              isCommandMenuOpen && filteredCommands[activeItemIndex]
                ? `${commandMenuId}-${filteredCommands[activeItemIndex].id}`
                : undefined
            }
            hasAttachButton={false}
            isSendButtonDisabled={isSendButtonDisabled}
            placeholder='Type a message or "/" for commands...'
          />
          <ChatbotFootnote {...footnoteProps} />
        </ChatbotFooter>
      </Chatbot>
    </>
  );
};
