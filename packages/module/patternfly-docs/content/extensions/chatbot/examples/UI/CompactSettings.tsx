import React from 'react';

import SettingsForm from '@patternfly/chatbot/dist/dynamic/Settings';
import {
  Button,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Switch,
  Title
} from '@patternfly/react-core';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotHeader, {
  ChatbotHeaderActions,
  ChatbotHeaderCloseButton,
  ChatbotHeaderMain,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderTitle
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { CogIcon, ExpandIcon, OpenDrawerRightIcon, OutlinedWindowRestoreIcon } from '@patternfly/react-icons';

export const CompactSettingsDemo: React.FunctionComponent = () => {
  const [isChecked, setIsChecked] = React.useState<boolean>(true);
  const [isThemeOpen, setIsThemeOpen] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = React.useState(false);
  const [displayMode, setDisplayMode] = React.useState(ChatbotDisplayMode.default);
  const [areSettingsOpen, setAreSettingsOpen] = React.useState(true);
  const chatbotVisible = true;

  const onFocus = (id: string) => {
    const element = document.getElementById(id);
    (element as HTMLElement).focus();
  };

  const onThemeToggleClick = () => {
    setIsThemeOpen(!isThemeOpen);
  };

  const onThemeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    onFocus('theme');
    setIsThemeOpen(false);
  };

  const onLanguageToggleClick = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const onLanguageSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    onFocus('language');
    setIsLanguageOpen(false);
  };

  const onVoiceToggleClick = () => {
    onFocus('voice');
    setIsVoiceOpen(!isVoiceOpen);
  };

  const onVoiceSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    setIsVoiceOpen(false);
  };

  const handleChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    setIsChecked(checked);
  };

  const themeDropdown = (
    <Dropdown
      isOpen={isThemeOpen}
      onSelect={onThemeSelect}
      onOpenChange={(isOpen: boolean) => setIsThemeOpen(isOpen)}
      shouldFocusToggleOnSelect
      shouldFocusFirstItemOnOpen
      shouldPreventScrollOnItemFocus
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        // We want to add the id property here as well so the label is coupled
        // with t he button on screen readers.
        <MenuToggle size="sm" id="theme" ref={toggleRef} onClick={onThemeToggleClick} isExpanded={isThemeOpen}>
          System
        </MenuToggle>
      )}
      ouiaId="ThemeDropdown"
    >
      <DropdownList>
        <DropdownItem value="System" key="system">
          System
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  const languageDropdown = (
    <Dropdown
      isOpen={isLanguageOpen}
      onSelect={onLanguageSelect}
      onOpenChange={(isOpen: boolean) => setIsLanguageOpen(isOpen)}
      shouldFocusToggleOnSelect
      shouldFocusFirstItemOnOpen
      shouldPreventScrollOnItemFocus
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        // We want to add the id property here as well so the label is coupled
        // with the button on screen readers.
        <MenuToggle size="sm" id="language" ref={toggleRef} onClick={onLanguageToggleClick} isExpanded={isLanguageOpen}>
          Auto-detect
        </MenuToggle>
      )}
      ouiaId="LanguageDropdown"
    >
      <DropdownList>
        <DropdownItem value="Auto-detect" key="auto-detect">
          Auto-detect
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
  const voiceDropdown = (
    <Dropdown
      isOpen={isVoiceOpen}
      onSelect={onVoiceSelect}
      onOpenChange={(isOpen: boolean) => setIsVoiceOpen(isOpen)}
      shouldFocusToggleOnSelect
      shouldFocusFirstItemOnOpen
      shouldPreventScrollOnItemFocus
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        // We want to add the id property here as well so the label is coupled
        // with the button on screen readers.
        <MenuToggle size="sm" id="voice" ref={toggleRef} onClick={onVoiceToggleClick} isExpanded={isVoiceOpen}>
          Bot
        </MenuToggle>
      )}
      ouiaId="VoiceDropdown"
    >
      <DropdownList>
        <DropdownItem value="Bot" key="bot">
          Bot
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
  const children = [
    { id: 'theme', label: 'Theme', field: themeDropdown },
    { id: 'language', label: 'Language', field: languageDropdown },
    { id: 'voice', label: 'Voice', field: voiceDropdown },
    {
      id: 'analytics',
      label: 'Share analytics',
      field: (
        <Switch
          // We want to add the id property here as well so the label is coupled
          // with the button on screen readers.
          id="analytics"
          aria-label="Togglable option for whether to share analytics"
          isChecked={isChecked}
          onChange={handleChange}
        />
      )
    },
    {
      id: 'archived-chat',
      label: 'Archive chat',
      field: (
        // We want to add the id property here as well so the label is coupled
        // with the button on screen readers.
        <Button size="sm" id="archived-chat" variant="secondary">
          Manage
        </Button>
      )
    },
    {
      id: 'archive-all',
      label: 'Archive all chat',
      field: (
        // We want to add the id property here as well so the label is coupled
        // with the button on screen readers.
        <Button size="sm" id="archive-all" variant="secondary">
          Archive all
        </Button>
      )
    },
    {
      id: 'delete-all',
      label: 'Delete all chats',
      field: (
        // We want to add the id property here as well so the label is coupled
        // with the button on screen readers.
        <Button size="sm" id="delete-all" variant="danger">
          Delete all
        </Button>
      )
    }
  ];

  const onSelectDropdownItem = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    if (value === 'Settings') {
      setAreSettingsOpen(true);
    } else {
      setDisplayMode(value as ChatbotDisplayMode);
    }
  };

  const regularChatbot = (
    <ChatbotHeader>
      <ChatbotHeaderActions>
        <ChatbotHeaderOptionsDropdown isCompact onSelect={onSelectDropdownItem}>
          <DropdownGroup label="Display mode">
            <DropdownList>
              <DropdownItem
                value={ChatbotDisplayMode.default}
                key="switchDisplayOverlay"
                icon={<OutlinedWindowRestoreIcon aria-hidden />}
                isSelected={displayMode === ChatbotDisplayMode.default}
              >
                <span>Overlay</span>
              </DropdownItem>
              <DropdownItem
                value={ChatbotDisplayMode.docked}
                key="switchDisplayDock"
                icon={<OpenDrawerRightIcon aria-hidden />}
                isSelected={displayMode === ChatbotDisplayMode.docked}
              >
                <span>Dock to window</span>
              </DropdownItem>
              <DropdownItem
                value={ChatbotDisplayMode.fullscreen}
                key="switchDisplayFullscreen"
                icon={<ExpandIcon aria-hidden />}
                isSelected={displayMode === ChatbotDisplayMode.fullscreen}
              >
                <span>Fullscreen</span>
              </DropdownItem>
            </DropdownList>
          </DropdownGroup>
          <Divider />
          <DropdownList>
            <DropdownItem value="Settings" key="switchSettings" icon={<CogIcon aria-hidden />}>
              <span>Settings</span>
            </DropdownItem>
          </DropdownList>
        </ChatbotHeaderOptionsDropdown>
      </ChatbotHeaderActions>
    </ChatbotHeader>
  );

  return (
    <>
      <Chatbot isCompact isVisible={chatbotVisible} displayMode={displayMode}>
        {areSettingsOpen ? (
          <>
            <ChatbotHeader className="pf-chatbot__compact-settings-header">
              <ChatbotHeaderMain>
                <ChatbotHeaderTitle>
                  <Title headingLevel="h1" size="2xl">
                    Settings
                  </Title>
                </ChatbotHeaderTitle>
              </ChatbotHeaderMain>
              <ChatbotHeaderCloseButton isCompact onClick={() => setAreSettingsOpen(false)} />
            </ChatbotHeader>
            <SettingsForm isCompact fields={children} />
          </>
        ) : (
          <>{regularChatbot}</>
        )}
      </Chatbot>
    </>
  );
};
