import { FunctionComponent, MouseEvent, useState } from 'react';
import {
  Brand,
  Bullseye,
  Checkbox,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  FormGroup,
  Stack,
  Title
} from '@patternfly/react-core';
import {
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderActions,
  ChatbotHeaderTitle,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderNewChatButton
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';

import PFHorizontalLogoColor from './PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from './PF-HorizontalLogo-Reverse.svg';

export const BasicDemo: FunctionComponent = () => {
  const [selectedModel, setSelectedModel] = useState('Granite Code 7B');
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showNewChatButton, setShowNewChatButton] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [showCenteredLogo, setShowCenteredLogo] = useState<boolean>(true);
  const [showSelectorDropdown, setShowSelectorDropdown] = useState<boolean>(true);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState<boolean>(true);

  const onSelectModel = (_event: MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedModel(value as string);
  };

  const title = (
    <>
      <div className="show-light">
        <Brand src={PFHorizontalLogoColor} alt="PatternFly" style={{ marginRight: '10px' }} />
      </div>
      <div className="show-dark">
        <Brand src={PFHorizontalLogoReverse} alt="PatternFly" style={{ marginRight: '10px' }} />
      </div>
      <Title headingLevel="h1" size="2xl">
        ChatBot Extension
      </Title>
    </>
  );

  return (
    <Stack hasGutter>
      <FormGroup role="radiogroup" isInline fieldId="header-variant-form-radio-group" label="Variant">
        <Checkbox
          isChecked={showMenu && showNewChatButton && showCenteredLogo && showSelectorDropdown && showOptionsDropdown}
          onChange={() => {
            setShowMenu(true);
            setShowNewChatButton(true);
            setShowCenteredLogo(true);
            setShowSelectorDropdown(true);
            setShowOptionsDropdown(true);
            showLogo && setShowLogo(false);
          }}
          name="basic-inline-radio"
          label="All"
          id="all"
        />
        <Checkbox
          isChecked={showMenu}
          onChange={() => {
            setShowMenu(!showMenu);
            showAll && setShowAll(!showAll);
          }}
          name="basic-inline-radio"
          label="With menu"
          id="menu"
        />
        <Checkbox
          isChecked={showNewChatButton}
          onChange={() => {
            setShowNewChatButton(!showNewChatButton);
            showAll && setShowAll(!showAll);
          }}
          name="basic-inline-radio"
          label="With new chat button"
          id="new-chat-button"
        />
        <Checkbox
          isChecked={showLogo}
          onChange={() => {
            setShowLogo(!showLogo);
            showCenteredLogo && setShowCenteredLogo(!showCenteredLogo);
          }}
          name="basic-inline-radio"
          label="With left-aligned logo"
          id="logo"
        />
        <Checkbox
          isChecked={showCenteredLogo}
          onChange={() => {
            setShowCenteredLogo(!showCenteredLogo);
            showLogo && setShowLogo(!showLogo);
            showAll && setShowAll(!showAll);
          }}
          name="basic-inline-radio"
          label="With centered logo"
          id="logo-centered"
        />
        <Checkbox
          isChecked={showSelectorDropdown}
          onChange={() => {
            setShowSelectorDropdown(!showSelectorDropdown);
            showAll && setShowAll(!showAll);
          }}
          name="basic-inline-radio"
          label="With selector dropdown"
          id="selector-dropdown"
        />
        <Checkbox
          isChecked={showOptionsDropdown}
          onChange={() => {
            setShowOptionsDropdown(!showOptionsDropdown);
            showAll && setShowAll(!showAll);
          }}
          name="basic-inline-radio"
          label="With settings dropdown"
          id="options-dropdown"
        />
      </FormGroup>

      <ChatbotHeader>
        {(showMenu || showNewChatButton || showLogo || showCenteredLogo) && (
          <ChatbotHeaderMain>
            {showMenu && <ChatbotHeaderMenu onMenuToggle={() => alert('Menu toggle clicked')} />}
            {showNewChatButton && <ChatbotHeaderNewChatButton onClick={() => alert('New chat button clicked')} />}
            {(showLogo || showCenteredLogo) && (
              <ChatbotHeaderTitle>{showCenteredLogo ? <Bullseye>{title}</Bullseye> : title}</ChatbotHeaderTitle>
            )}
          </ChatbotHeaderMain>
        )}
        {(showSelectorDropdown || showOptionsDropdown) && (
          <ChatbotHeaderActions>
            {showSelectorDropdown && (
              <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
                <DropdownList>
                  <DropdownItem value="Granite Code 7B" key="granite">
                    Granite Code 7B
                  </DropdownItem>
                  <DropdownItem value="Llama 3.0" key="llama">
                    Llama 3.0
                  </DropdownItem>
                  <DropdownItem value="Mistral 3B" key="mistral">
                    Mistral 3B
                  </DropdownItem>
                </DropdownList>
              </ChatbotHeaderSelectorDropdown>
            )}
            {showOptionsDropdown && (
              <ChatbotHeaderOptionsDropdown>
                <DropdownGroup label="Display mode">
                  <DropdownList>
                    <DropdownItem
                      value={ChatbotDisplayMode.default}
                      key="switchDisplayOverlay"
                      icon={<OutlinedWindowRestoreIcon aria-hidden />}
                    >
                      <span>Overlay</span>
                    </DropdownItem>
                    <DropdownItem
                      value={ChatbotDisplayMode.docked}
                      key="switchDisplayDock"
                      icon={<OpenDrawerRightIcon aria-hidden />}
                    >
                      <span>Dock to window</span>
                    </DropdownItem>
                    <DropdownItem
                      value={ChatbotDisplayMode.fullscreen}
                      key="switchDisplayFullscreen"
                      icon={<ExpandIcon aria-hidden />}
                    >
                      <span>Fullscreen</span>
                    </DropdownItem>
                  </DropdownList>
                </DropdownGroup>
              </ChatbotHeaderOptionsDropdown>
            )}
          </ChatbotHeaderActions>
        )}
      </ChatbotHeader>
    </Stack>
  );
};
