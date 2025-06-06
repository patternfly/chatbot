import { FunctionComponent, useState, Ref, MouseEvent as ReactMouseEvent, CSSProperties } from 'react';

import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import { Checkbox } from '@patternfly/react-core/dist/dynamic/Checkbox';
import { Stack } from '@patternfly/react-core/dist/dynamic/Stack';
import { MenuToggle, MenuToggleElement, Select, SelectList, SelectOption } from '@patternfly/react-core';

export const ChatbotContainerDemo: FunctionComponent = () => {
  const [displayMode, setDisplayMode] = useState(ChatbotDisplayMode.default);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('Select display mode');

  const onSelect = (_event: ReactMouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Overlay / default') {
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

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as CSSProperties
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
              <SelectOption value="Overlay / default">Overlay / default</SelectOption>
              <SelectOption value="Docked">Docked</SelectOption>
              <SelectOption value="Fullscreen">Fullscreen</SelectOption>
              <SelectOption value="Embedded">Embedded</SelectOption>
            </SelectList>
          </Select>
          <Checkbox
            label="Display chatbot container"
            isChecked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
            id="container-visible"
            name="container-visible"
          />
        </Stack>
      </div>
      <Chatbot displayMode={displayMode} isVisible={isVisible}></Chatbot>
    </>
  );
};
