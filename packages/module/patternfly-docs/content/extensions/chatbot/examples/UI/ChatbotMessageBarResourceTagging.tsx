import { useState, FunctionComponent, useRef, useEffect } from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { Label, LabelGroup, Menu, MenuContent, MenuItem, MenuList, Popper } from '@patternfly/react-core';

interface Resource {
  id: string;
  name: string;
  type: string;
}

export const ChatbotMessageBarResourceTaggingExample: FunctionComponent = () => {
  const [message, setMessage] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [triggerPosition, setTriggerPosition] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sample resources
  const availableResources: Resource[] = [
    { id: '1', name: 'pod/auth-operator', type: 'Pod' },
    { id: '2', name: 'deployment/frontend-app', type: 'Deployment' },
    { id: '3', name: 'service/backend-api', type: 'Service' },
    { id: '4', name: 'configmap/app-config', type: 'ConfigMap' },
    { id: '5', name: 'secret/db-credentials', type: 'Secret' },
    { id: '6', name: 'pod/redis-cache', type: 'Pod' },
    { id: '7', name: 'deployment/nginx-proxy', type: 'Deployment' },
    { id: '8', name: 'service/auth-service', type: 'Service' }
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
      setIsMenuOpen(true);
      setSearchTerm('');
      setFilteredResources(availableResources);
      setActiveItemIndex(0);
    } else if (isMenuOpen && triggerPosition >= 0) {
      // Extract the search term after the "#"
      const textAfterTrigger = newValue.substring(triggerPosition + 1, cursorPos);

      // Check if we've moved away from the tag or pressed space
      if (textAfterTrigger.includes(' ') || cursorPos < triggerPosition) {
        setIsMenuOpen(false);
        setTriggerPosition(-1);
      } else {
        setSearchTerm(textAfterTrigger);
        // Filter resources based on search term
        const filtered = availableResources.filter((resource) =>
          resource.name.toLowerCase().includes(textAfterTrigger.toLowerCase())
        );
        setFilteredResources(filtered);
        setActiveItemIndex(0);
      }
    }
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
    setIsMenuOpen(false);
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
    if (!isMenuOpen || filteredResources.length === 0) {
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
        if (isMenuOpen) {
          event.preventDefault();
          const selectedResource = filteredResources[activeItemIndex];
          if (selectedResource) {
            handleResourceSelect(selectedResource);
          }
        }
        break;
      case 'Escape':
        if (isMenuOpen) {
          event.preventDefault();
          setIsMenuOpen(false);
          setTriggerPosition(-1);
        }
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setTriggerPosition(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menu = (
    <Menu
      ref={menuRef}
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

  return (
    <div className="pf-chatbot__footer-container" style={{ position: 'relative' }}>
      <Popper
        triggerRef={textareaRef}
        popper={menu}
        isVisible={isMenuOpen}
        enableFlip={true}
        placement="top-start"
      />
      {selectedResources.length > 0 && (
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
      )}
      <MessageBar
        onSendMessage={handleSend}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        innerRef={textareaRef}
        placeholder="Type # to tag a resource..."
      />
    </div>
  );
};
