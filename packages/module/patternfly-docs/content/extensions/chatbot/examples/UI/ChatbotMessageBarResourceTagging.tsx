import { useState, FunctionComponent, useRef, useEffect, ReactNode } from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { FileDetailsLabel } from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import {
  Divider,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  Popper,
  Select,
  SelectList,
  SelectOption
} from '@patternfly/react-core';
import { PlusIcon, ClipboardIcon, CodeIcon, UploadIcon, HashtagIcon } from '@patternfly/react-icons';

interface Resource {
  id: string;
  name: string;
  type: string;
}

export const ChatbotMessageBarResourceTaggingExample: FunctionComponent = () => {
  const [message, setMessage] = useState<string>('');
  const [isResourceMenuOpen, setIsResourceMenuOpen] = useState<boolean>(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState<boolean>(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [triggerPosition, setTriggerPosition] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isRenderModeSelectOpen, setIsRenderModeSelectOpen] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<string>('label-with-category');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resourceMenuRef = useRef<HTMLDivElement>(null);

  // Sample resources
  const availableResources: Resource[] = [
    { id: '1', name: 'OpenShift Ansible Playbook', type: 'Chat' },
    { id: '2', name: 'Q4 Sales Performance', type: 'Dashboard' },
    { id: '3', name: 'Ansible RHEL Patcher', type: 'Code File' },
    { id: '4', name: 'prod-apps-useast1-a-7d9bd4...', type: 'Pod' },
    { id: '5', name: 'ingress-controller', type: 'Deployment' },
    { id: '6', name: 'prod-apps-eucentral1-a', type: 'Cluster' },
    { id: '7', name: 'apex-monitoring', type: 'Namespace' }
  ];

  const handleSend = (msg: string | number) => {
    alert(`Sending message: ${msg}\nWith resources: ${selectedResources.map((r) => r.name).join(', ')}`);
    setSelectedResources([]);
    setMessage('');
  };

  const handleChange = (_event: React.ChangeEvent<HTMLTextAreaElement>, value: string | number) => {
    const newValue = value.toString();
    setMessage(newValue);

    // Check if "#" was just typed
    const lastChar = newValue[newValue.length - 1];
    const cursorPos = textareaRef.current?.selectionStart || 0;

    if (lastChar === '#') {
      setTriggerPosition(cursorPos - 1);
      setIsResourceMenuOpen(true);
      setSearchTerm('');
      // Filter out already-selected resources
      const unselectedResources = availableResources.filter(
        (resource) => !selectedResources.find((r) => r.id === resource.id)
      );
      setFilteredResources(unselectedResources);
      setActiveItemIndex(0);
    } else if (isResourceMenuOpen && triggerPosition >= 0) {
      // Extract the search term after the "#"
      const textAfterTrigger = newValue.substring(triggerPosition + 1, cursorPos);

      // Check if we've moved away from the tag or pressed space
      if (textAfterTrigger.includes(' ') || cursorPos < triggerPosition) {
        setIsResourceMenuOpen(false);
        setTriggerPosition(-1);
      } else {
        setSearchTerm(textAfterTrigger);
        // Filter resources based on search term and exclude already-selected resources
        const filtered = availableResources.filter(
          (resource) =>
            resource.name.toLowerCase().includes(textAfterTrigger.toLowerCase()) &&
            !selectedResources.find((r) => r.id === resource.id)
        );
        setFilteredResources(filtered);
        setActiveItemIndex(0);
      }
    }
  };

  const openResourceMenu = () => {
    // Close attach menu first
    setIsAttachMenuOpen(false);

    if (!textareaRef.current) {
      return;
    }

    // Get current cursor position and insert "#"
    const cursorPos = textareaRef.current.selectionStart || 0;
    const beforeCursor = message.substring(0, cursorPos);
    const afterCursor = message.substring(cursorPos);
    const newMessage = `${beforeCursor}#${afterCursor}`;

    setMessage(newMessage);
    setTriggerPosition(cursorPos);
    setIsResourceMenuOpen(true);
    setSearchTerm('');
    // Filter out already-selected resources
    const unselectedResources = availableResources.filter(
      (resource) => !selectedResources.find((r) => r.id === resource.id)
    );
    setFilteredResources(unselectedResources);
    setActiveItemIndex(0);

    // Focus the textarea and position cursor after the "#"
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = cursorPos + 1;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleResourceSelect = (resource: Resource) => {
    if (!textareaRef.current) {
      return;
    }

    // Get the text before the "#" and after the current cursor position
    const beforeTag = message.substring(0, triggerPosition);
    const cursorPos = textareaRef.current.selectionStart || 0;
    const afterCursor = message.substring(cursorPos);

    // Build new message with the full resource name, keeping the "#"
    const newMessage = `${beforeTag}#${resource.name} ${afterCursor}`;

    // Update state - MessageBar will sync via its internal useEffect
    setMessage(newMessage);

    // Add resource to selected resources if not already added
    if (!selectedResources.find((r) => r.id === resource.id)) {
      setSelectedResources([...selectedResources, resource]);
    }

    // Close the menu and reset
    setIsResourceMenuOpen(false);
    setTriggerPosition(-1);
    setSearchTerm('');

    // Focus textarea and set cursor position after the inserted resource
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeTag.length + resource.name.length + 2; // +2 for "#" and space
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources(selectedResources.filter((r) => r.id !== resourceId));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isResourceMenuOpen || filteredResources.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveItemIndex((prev) => (prev + 1) % filteredResources.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveItemIndex((prev) => (prev - 1 + filteredResources.length) % filteredResources.length);
        break;
      case 'Enter':
        if (isResourceMenuOpen) {
          event.preventDefault();
          const selectedResource = filteredResources[activeItemIndex];
          if (selectedResource) {
            handleResourceSelect(selectedResource);
          }
        }
        break;
      case 'Escape':
        if (isResourceMenuOpen) {
          event.preventDefault();
          setIsResourceMenuOpen(false);
          setTriggerPosition(-1);
        }
        break;
    }
  };

  const onAttachMenuToggleClick = () => {
    setIsAttachMenuOpen(!isAttachMenuOpen);
  };

  const onRenderModeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setRenderMode(value as string);
    setIsRenderModeSelectOpen(false);
  };

  // Close resource menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resourceMenuRef.current &&
        !resourceMenuRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setIsResourceMenuOpen(false);
        setTriggerPosition(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const attachMenuItems: ReactNode = (
    <DropdownList>
      <DropdownItem value="Add resource" id="add-resource" icon={<HashtagIcon />} onClick={openResourceMenu}>
        Add resource
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
      <DropdownItem value="Upload from computer" id="upload" icon={<UploadIcon />}>
        Upload from computer
      </DropdownItem>
    </DropdownList>
  );

  const resourceMenu = (
    <Menu
      ref={resourceMenuRef}
      onSelect={(_event, itemId) => {
        const resource = filteredResources.find((r) => r.id === itemId?.toString());
        if (resource) {
          handleResourceSelect(resource);
        }
      }}
    >
      <MenuContent>
        <MenuList>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <MenuItem
                key={resource.id}
                itemId={resource.id}
                description={resource.type}
                isFocused={index === activeItemIndex}
              >
                {resource.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem isDisabled>No resources found</MenuItem>
          )}
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const renderResources = () => {
    if (selectedResources.length === 0) {
      return null;
    }

    switch (renderMode) {
      case 'label-with-category':
        return (
          <div style={{ padding: '0.5rem 1rem' }}>
            <LabelGroup categoryName="Resources" isClosable={false}>
              {selectedResources.map((resource) => (
                <Label
                  key={resource.id}
                  onClose={() => handleRemoveResource(resource.id)}
                  closeBtnAriaLabel={`Remove ${resource.name}`}
                >
                  {resource.name}
                </Label>
              ))}
            </LabelGroup>
          </div>
        );

      case 'label-without-category':
        return (
          <div style={{ padding: '0.5rem 1rem' }}>
            <LabelGroup isClosable={false}>
              {selectedResources.map((resource) => (
                <Label
                  key={resource.id}
                  onClose={() => handleRemoveResource(resource.id)}
                  closeBtnAriaLabel={`Remove ${resource.name}`}
                >
                  {resource.name}
                </Label>
              ))}
            </LabelGroup>
          </div>
        );

      case 'attachment-tiles':
        return (
          <div style={{ padding: '0.5rem 1rem' }}>
            <Flex gap={{ default: 'gapSm' }}>
              {selectedResources.map((resource) => (
                <FlexItem key={resource.id}>
                  <FileDetailsLabel
                    fileName={resource.name}
                    onClose={() => handleRemoveResource(resource.id)}
                    closeButtonAriaLabel={`Remove ${resource.name}`}
                  />
                </FlexItem>
              ))}
            </Flex>
          </div>
        );

      default:
        return null;
    }
  };

  const renderModeOptions = [
    { value: 'label-with-category', label: 'Label with category' },
    { value: 'label-without-category', label: 'Label without category' },
    { value: 'attachment-tiles', label: 'Attachment tiles' }
  ];

  const selectedModeLabel = renderModeOptions.find((opt) => opt.value === renderMode)?.label || '';

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Select
          isOpen={isRenderModeSelectOpen}
          selected={renderMode}
          shouldFocusToggleOnSelect
          onSelect={onRenderModeSelect}
          onOpenChange={(isOpen) => setIsRenderModeSelectOpen(isOpen)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsRenderModeSelectOpen(!isRenderModeSelectOpen)}
              isExpanded={isRenderModeSelectOpen}
              aria-label={`${selectedModeLabel}, Select resource render mode`}
            >
              {selectedModeLabel}
            </MenuToggle>
          )}
        >
          <SelectList>
            {renderModeOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {option.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </div>
      <div className="pf-chatbot__footer-container" style={{ position: 'relative' }}>
        <Popper
          triggerRef={textareaRef}
          popper={resourceMenu}
          isVisible={isResourceMenuOpen}
          enableFlip={true}
          placement="top-start"
        />
        {renderResources()}
        <MessageBar
          onSendMessage={handleSend}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          innerRef={textareaRef}
          placeholder="Type # to tag a resource or use attach menu..."
          attachButtonPosition="start"
          attachMenuProps={{
            isAttachMenuOpen,
            setIsAttachMenuOpen,
            attachMenuItems,
            onAttachMenuSelect: (_ev, value) => {
              console.log('selected', value);
              if (value !== 'Add resource') {
                setIsAttachMenuOpen(false);
              }
            },
            attachMenuInputPlaceholder: 'Search options...',
            onAttachMenuToggleClick
          }}
          buttonProps={{
            attach: {
              icon: <PlusIcon />,
              tooltipContent: 'Add content'
            }
          }}
        />
      </div>
    </>
  );
};
