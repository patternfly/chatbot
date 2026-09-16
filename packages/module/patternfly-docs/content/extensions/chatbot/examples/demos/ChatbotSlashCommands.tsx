import { useEffect, useRef, useState, FunctionComponent } from 'react';
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

interface SlashCommand {
  id: string;
  command: string;
  description: string;
}

const slashCommands: SlashCommand[] = [
  { id: 'skills', command: '/skills', description: 'List available skills' },
  { id: 'help', command: '/help', description: 'Show help information' },
  { id: 'summarize', command: '/summarize', description: 'Summarize the conversation' },
  { id: 'clear', command: '/clear', description: 'Clear conversation history' },
  { id: 'feedback', command: '/feedback', description: 'Provide feedback' },
  { id: 'export', command: '/export', description: 'Export conversation' }
];

const commandResponses: Record<string, string> = {
  skills:
    'Here are the available skills:\n\n' +
    '1. **Code Generation** - Generate code snippets\n' +
    '2. **Summarization** - Summarize documents or conversations\n' +
    '3. **Translation** - Translate text between languages\n' +
    '4. **Analysis** - Analyze data and provide insights\n' +
    '5. **Writing** - Help with writing tasks',
  help:
    'Here are the available slash commands:\n\n' +
    '- `/skills` - List available skills\n' +
    '- `/help` - Show this help information\n' +
    '- `/summarize` - Summarize the conversation\n' +
    '- `/clear` - Clear conversation history\n' +
    '- `/feedback` - Provide feedback\n' +
    '- `/export` - Export conversation',
  summarize: 'Here is a summary of the conversation so far:\n\nNo previous messages to summarize.',
  clear: 'Conversation history has been cleared.',
  feedback: 'Thank you for your interest in providing feedback! Please describe your feedback in the chat.',
  export: 'Your conversation has been exported successfully.'
};

const footnoteProps = {
  label: 'Always review AI-generated content prior to use.'
};

const welcomePrompts = [
  {
    title: 'Try a slash command',
    message: 'Type / in the message bar to see available commands'
  },
  {
    title: 'Ask a question',
    message: 'How can I help you today?'
  }
];

const slashCommandMenuId = 'chatbot-slash-command-menu';

const generateId = () => {
  const id = Date.now() + Math.random();
  return id.toString();
};

export const ChatbotSlashCommandsDemo: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState<boolean>(false);
  const [triggerPosition, setTriggerPosition] = useState<number>(-1);
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

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
        setIsSlashMenuOpen(false);
        setTriggerPosition(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCommandSelect = (command: SlashCommand) => {
    setIsSlashMenuOpen(false);
    setTriggerPosition(-1);
    setMessage('');
    setIsSendButtonDisabled(true);

    const loadingMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: `Running ${command.command}...`,
      name: 'Bot',
      isLoading: true,
      timestamp: new Date().toLocaleString()
    };

    setMessages((prev) => [...prev, loadingMessage]);
    setAnnouncement(`Running command ${command.command}. Response is loading.`);

    setTimeout(() => {
      const responseMessage: MessageProps = {
        id: generateId(),
        role: 'bot',
        content: commandResponses[command.id],
        name: 'Bot',
        isLoading: false,
        timestamp: new Date().toLocaleString(),
        actions: {
          positive: {},
          negative: {},
          copy: {},
          download: {}
        }
      };

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        updated.push(responseMessage);
        return updated;
      });
      setAnnouncement(`Response from Bot: ${commandResponses[command.id]}`);
      setIsSendButtonDisabled(false);
    }, 3000);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleChange = (_event: React.ChangeEvent<HTMLTextAreaElement>, value: string | number) => {
    const newValue = value.toString();
    setMessage(newValue);

    const cursorPos = textareaRef.current?.selectionStart || 0;
    const lastChar = newValue[newValue.length - 1];

    if (lastChar === '/' && (newValue.length === 1 || newValue[newValue.length - 2] === ' ')) {
      setTriggerPosition(cursorPos - 1);
      setIsSlashMenuOpen(true);
      setFilteredCommands(slashCommands);
      setActiveItemIndex(0);
    } else if (isSlashMenuOpen && triggerPosition >= 0) {
      const textAfterTrigger = newValue.substring(triggerPosition + 1, cursorPos);

      if (textAfterTrigger.includes(' ') || cursorPos <= triggerPosition || newValue[triggerPosition] !== '/') {
        setIsSlashMenuOpen(false);
        setTriggerPosition(-1);
      } else {
        const searchTerm = textAfterTrigger.toLowerCase();
        const filtered = slashCommands.filter(
          (cmd) =>
            cmd.command.toLowerCase().includes(`/${searchTerm}`) || cmd.description.toLowerCase().includes(searchTerm)
        );
        setFilteredCommands(filtered);
        setActiveItemIndex(0);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isSlashMenuOpen || filteredCommands.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveItemIndex((prev) => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveItemIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        event.preventDefault();
        handleCommandSelect(filteredCommands[activeItemIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        setIsSlashMenuOpen(false);
        setTriggerPosition(-1);
        break;
    }
  };

  const handleSend = (msg: string | number) => {
    setIsSendButtonDisabled(true);
    const newMessages: MessageProps[] = [];
    messages.forEach((m) => newMessages.push(m));
    const now = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: msg.toString(),
      name: 'User',
      avatar: userAvatar,
      timestamp: now.toLocaleString(),
      avatarProps: { isBordered: true }
    });
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      isLoading: true,
      timestamp: now.toLocaleString()
    });
    setMessages(newMessages);
    setAnnouncement(`Message from User: ${msg}. Message from Bot is loading.`);

    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      newMessages.forEach((m) => loadedMessages.push(m));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        isLoading: false,
        timestamp: now.toLocaleString(),
        actions: {
          positive: {},
          negative: {},
          copy: {},
          download: {}
        }
      });
      setMessages(loadedMessages);
      setAnnouncement('Message from Bot: API response goes here');
      setIsSendButtonDisabled(false);
    }, 5000);
  };

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="PatternFly" />
    </Bullseye>
  );

  const slashMenu = (
    <Menu
      ref={menuRef}
      id={slashCommandMenuId}
      role="listbox"
      onSelect={(_event, itemId) => {
        const command = filteredCommands.find((c) => c.id === itemId?.toString());
        if (command) {
          handleCommandSelect(command);
        }
      }}
    >
      <MenuContent>
        <MenuList aria-label="Slash commands">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <MenuItem
                key={cmd.id}
                id={`${slashCommandMenuId}-${cmd.id}`}
                itemId={cmd.id}
                description={cmd.description}
                isFocused={index === activeItemIndex}
              >
                {cmd.command}
              </MenuItem>
            ))
          ) : (
            <MenuItem isDisabled>No commands found</MenuItem>
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const handleSkipToContent = (e) => {
    e.preventDefault();
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
              description="How can I help you today? Type / to see available commands."
              prompts={welcomePrompts}
            />
            {messages.map((msg, index) => {
              if (index === messages.length - 1) {
                return (
                  <div key={msg.id}>
                    <div ref={scrollToBottomRef}></div>
                    <Message {...msg} />
                  </div>
                );
              }
              return <Message key={msg.id} {...msg} />;
            })}
          </MessageBox>
        </ChatbotContent>
        <ChatbotFooter>
          <Popper
            triggerRef={textareaRef}
            popper={slashMenu}
            isVisible={isSlashMenuOpen}
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
            aria-controls={slashCommandMenuId}
            aria-expanded={isSlashMenuOpen}
            aria-haspopup="listbox"
            aria-activedescendant={
              isSlashMenuOpen && filteredCommands[activeItemIndex]
                ? `${slashCommandMenuId}-${filteredCommands[activeItemIndex].id}`
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
