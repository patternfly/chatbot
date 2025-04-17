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
          <SelectOption value="plain">Plain</SelectOption>
          <SelectOption value="closeable">Closeable</SelectOption>
          <SelectOption value="clickable">Clickable</SelectOption>
          <SelectOption value="loading">Loading</SelectOption>
        </SelectList>
      </Select>
      <div className="pf-chatbot__file-details-example">
        <FileDetailsLabel
          fileName="auth-operator.yml"
          // eslint-disable-next-line no-console
          {...(variant === 'closeable' && { onClose: () => console.log('clicked close button!') })}
          // eslint-disable-next-line no-console
          {...(variant === 'clickable' && { onClick: () => console.log('clicked entire button!') })}
          {...(variant === 'loading' && { isLoading: true })}
        />
      </div>
    </Stack>
  );
};
