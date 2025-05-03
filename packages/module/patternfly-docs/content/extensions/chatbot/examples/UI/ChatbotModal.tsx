import React from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Stack
} from '@patternfly/react-core';
import { ChatbotModal } from '@patternfly/chatbot/dist/dynamic/ChatbotModal';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';

export const ChatbotModalExample: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [displayMode, setDisplayMode] = React.useState(ChatbotDisplayMode.default);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('Select display mode');

  const handleModalToggle = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Default') {
      setDisplayMode(ChatbotDisplayMode.default);
    }
    if (value === 'Docked') {
      setDisplayMode(ChatbotDisplayMode.docked);
    }
    if (value === 'Fullscreen') {
      setDisplayMode(ChatbotDisplayMode.fullscreen);
    }
    if (value === 'Embedded') {
      setDisplayMode(ChatbotDisplayMode.embedded);
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as React.CSSProperties
      }
    >
      {selected}
    </MenuToggle>
  );

  return (
    <>
      <div
        style={{
          position: 'fixed',
          padding: 'var(--pf-t--global--spacer--lg)',
          zIndex: '601',
          boxShadow: 'var(--pf-t--global--box-shadow--lg)'
        }}
      >
        <Stack hasGutter>
        <Select
          id="single-select"
          isOpen={isOpen}
          selected={selected}
          onSelect={onSelect}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
          toggle={toggle}
          shouldFocusToggleOnSelect
        >
          <SelectList>
            <SelectOption value="Default">Default</SelectOption>
            <SelectOption value="Docked">Docked</SelectOption>
            <SelectOption value="Fullscreen">Fullscreen</SelectOption>
            <SelectOption value="Embedded">Embedded</SelectOption>
          </SelectList>
        </Select>
        <Button onClick={handleModalToggle}>Launch modal</Button>
        </Stack>
      </div>
      <Chatbot displayMode={displayMode} isVisible></Chatbot>
      <ChatbotModal
        isOpen={isModalOpen}
        displayMode={displayMode}
        onClose={handleModalToggle}
        ouiaId="ChatbotModal"
        aria-labelledby="basic-modal-title"
        aria-describedby="modal-box-body-basic"
      >
        <ModalHeader title="Basic modal" labelId="basic-modal-title" />
        <ModalBody id="modal-box-body-basic">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </ModalBody>
        <ModalFooter>
          <Button key="confirm" variant="primary" onClick={handleModalToggle}>
            Confirm
          </Button>
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </ChatbotModal>
    </>
  );
};
