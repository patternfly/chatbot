import React from 'react';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import { Stack, MenuToggle, MenuToggleElement, Select, SelectList, SelectOption } from '@patternfly/react-core';

export const FileDetailsLabelExample: React.FunctionComponent = () => {
  const [variant, setVariant] = React.useState<string>('plain');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>('Variant');

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setVariant(value);
    setSelected(value as string);
    setIsOpen(false);
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
          <SelectOption value="Plain">Plain</SelectOption>
          <SelectOption value="Closeable">Closeable</SelectOption>
          <SelectOption value="Clickable">Clickable</SelectOption>
          <SelectOption value="Loading">Loading</SelectOption>
        </SelectList>
      </Select>
      <div className="pf-chatbot__file-details-example">
        <FileDetailsLabel
          fileName="auth-operator.yml"
          // eslint-disable-next-line no-console
          {...(variant === 'Closeable' && { onClose: () => console.log('clicked close button!') })}
          // eslint-disable-next-line no-console
          {...(variant === 'Clickable' && { onClick: () => console.log('clicked entire button!') })}
          {...(variant === 'Loading' && { isLoading: true })}
        />
      </div>
    </Stack>
  );
};
