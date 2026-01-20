import { useState, FunctionComponent, ReactNode } from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import {
  Divider,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
  Select,
  SelectList,
  SelectOption
} from '@patternfly/react-core';
import { PlusIcon, ClipboardIcon, CodeIcon, UploadIcon } from '@patternfly/react-icons';
import { useDropzone } from 'react-dropzone';

export const ChatbotMessageBarCustomActionsExample: FunctionComponent = () => {
  const [isFirstMenuOpen, setIsFirstMenuOpen] = useState<boolean>(false);
  const [isSecondMenuOpen, setIsSecondMenuOpen] = useState<boolean>(false);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('GPT-4');
  const [showCanvasLabel, setShowCanvasLabel] = useState<boolean>(true);

  const handleSend = (message: string | number) => alert(message);

  const { open, getInputProps } = useDropzone({
    multiple: true,
    // eslint-disable-next-line no-console
    onDropAccepted: () => console.log('fileUploaded')
  });

  const onFirstMenuToggle = () => {
    setIsFirstMenuOpen(!isFirstMenuOpen);
  };

  const onSecondMenuToggle = () => {
    setIsSecondMenuOpen(!isSecondMenuOpen);
  };

  const onModelSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedModel(value as string);
    setIsModelSelectOpen(false);
  };

  const firstMenuItems: ReactNode = (
    <DropdownList>
      <DropdownItem value="Logs" id="logs" icon={<ClipboardIcon />}>
        Logs
      </DropdownItem>
      <DropdownItem value="YAML - Status" id="yaml-status" icon={<CodeIcon />}>
        YAML - Status
      </DropdownItem>
      <DropdownItem value="YAML - All contents" id="yaml-all" icon={<CodeIcon />}>
        YAML - All contents
      </DropdownItem>
      <Divider key="divider" />
      <DropdownItem value="Upload from computer" id="upload" icon={<UploadIcon />} onClick={open}>
        Upload from computer
      </DropdownItem>
    </DropdownList>
  );

  const secondMenuItems: ReactNode = (
    <DropdownList>
      <DropdownItem value="canvas" id="canvas">
        {showCanvasLabel ? 'Disable' : 'Enable'} Canvas
      </DropdownItem>
      <Divider key="divider-1" />
      <DropdownItem value="Logs" id="logs" icon={<ClipboardIcon />}>
        Logs
      </DropdownItem>
      <DropdownItem value="YAML - Status" id="yaml-status" icon={<CodeIcon />}>
        YAML - Status
      </DropdownItem>
      <DropdownItem value="YAML - All contents" id="yaml-all" icon={<CodeIcon />}>
        YAML - All contents
      </DropdownItem>
      <Divider key="divider-2" />
      <DropdownItem value="Upload from computer" id="upload" icon={<UploadIcon />} onClick={open}>
        Upload from computer
      </DropdownItem>
    </DropdownList>
  );

  const modelOptions = ['GPT-4', 'GPT-3.5', 'Claude', 'Llama 2'];

  return (
    <>
      {/* This is required for react-dropzone to work in Safari and Firefox */}
      <input {...getInputProps()} hidden />
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>Custom attach menu with a PlusIcon at the start</h3>
        <MessageBar
          onSendMessage={handleSend}
          attachButtonPosition="start"
          attachMenuProps={{
            isAttachMenuOpen: isFirstMenuOpen,
            setIsAttachMenuOpen: setIsFirstMenuOpen,
            attachMenuItems: firstMenuItems,
            onAttachMenuSelect: (_ev, value) => {
              // eslint-disable-next-line no-console
              console.log('selected', value);
              setIsFirstMenuOpen(false);
            },
            attachMenuInputPlaceholder: 'Search options...',
            onAttachMenuToggleClick: onFirstMenuToggle,
            onAttachMenuOnOpenChangeKeys: ['Escape', 'Tab']
          }}
          buttonProps={{
            attach: {
              icon: <PlusIcon />,
              tooltipContent: 'Message actions',
              'aria-label': 'Message actions'
            }
          }}
        />
      </div>

      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Custom attach menu with additional actions</h3>
        <MessageBar
          onSendMessage={handleSend}
          attachButtonPosition="start"
          attachMenuProps={{
            isAttachMenuOpen: isSecondMenuOpen,
            setIsAttachMenuOpen: setIsSecondMenuOpen,
            attachMenuItems: secondMenuItems,
            onAttachMenuOnOpenChangeKeys: ['Escape', 'Tab'],
            onAttachMenuSelect: (_ev, value) => {
              // eslint-disable-next-line no-console
              console.log('selected', value);
              if (value === 'canvas') {
                setShowCanvasLabel(!showCanvasLabel);
              }
              setIsSecondMenuOpen(false);
            },
            onAttachMenuToggleClick: onSecondMenuToggle
          }}
          buttonProps={{
            attach: {
              icon: <PlusIcon />,
              tooltipContent: 'Message actions',
              'aria-label': 'Message actions'
            }
          }}
          additionalActions={
            <>
              <Select
                isOpen={isModelSelectOpen}
                selected={selectedModel}
                shouldFocusToggleOnSelect
                onSelect={onModelSelect}
                onOpenChange={(isOpen) => setIsModelSelectOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plainText"
                    onClick={() => setIsModelSelectOpen(!isModelSelectOpen)}
                    isExpanded={isModelSelectOpen}
                    aria-label={`${selectedModel}, Select a model`}
                    style={{
                      minWidth: '120px'
                    }}
                  >
                    {selectedModel}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {modelOptions.map((option) => (
                    <SelectOption key={option} value={option}>
                      {option}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
              {showCanvasLabel && (
                <Label closeBtnAriaLabel="Remove Canvas mode" onClose={() => setShowCanvasLabel(false)}>
                  Canvas
                </Label>
              )}
            </>
          }
        />
      </div>
    </>
  );
};
