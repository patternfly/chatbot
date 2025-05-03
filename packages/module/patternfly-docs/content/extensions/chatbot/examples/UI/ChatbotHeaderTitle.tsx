import React from 'react';
import { ChatbotHeaderTitle } from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import { MenuToggle, MenuToggleElement, Select, SelectList, SelectOption } from '@patternfly/react-core';

export const ChatbotHeaderTitleDemo: React.FunctionComponent = () => {
  const [displayMode, setDisplayMode] = React.useState(ChatbotDisplayMode.default);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('Select display mode');

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Default') {
      setDisplayMode(ChatbotDisplayMode.default);
    }
    if (value === 'Embedded') {
      setDisplayMode(ChatbotDisplayMode.embedded);
    }
    if (value === 'Docked') {
      setDisplayMode(ChatbotDisplayMode.docked);
    }
    if (value === 'Full screen') {
      setDisplayMode(ChatbotDisplayMode.fullscreen);
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      className="pf-v6-u-mb-md"
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
          <SelectOption value="Embedded">Embedded</SelectOption>
          <SelectOption value="Docked">Docked</SelectOption>
          <SelectOption value="Full screen">Full screen</SelectOption>
        </SelectList>
      </Select>
      <ChatbotHeaderTitle
        displayMode={displayMode}
        showOnEmbedded="Embedded"
        showOnDocked="Docked"
        showOnFullScreen="Full screen"
        showOnDefault="Default"
      />
    </>
  );
};
