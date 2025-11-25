import { FunctionComponent, useState } from 'react';
import { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotConversationHistoryNav, {
  Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import {
  Button,
  Checkbox,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption
} from '@patternfly/react-core';
import { FilterIcon, SortAmountDownIcon } from '@patternfly/react-icons';

const initialConversations: { [key: string]: Conversation[] } = {
  Today: [{ id: '1', text: 'Red Hat products and services' }],
  'This month': [
    {
      id: '2',
      text: 'Enterprise Linux installation and setup'
    },
    { id: '3', text: 'Troubleshoot system crash' }
  ],
  March: [
    { id: '4', text: 'Ansible security and updates' },
    { id: '5', text: 'Red Hat certification' },
    { id: '6', text: 'Lightspeed user documentation' }
  ],
  February: [
    { id: '7', text: 'Crashing pod assistance' },
    { id: '8', text: 'OpenShift AI pipelines' },
    { id: '9', text: 'Updating subscription plan' },
    { id: '10', text: 'Red Hat licensing options' }
  ],
  January: [
    { id: '11', text: 'RHEL system performance' },
    { id: '12', text: 'Manage user accounts' }
  ]
};

export const ChatbotHeaderTitleDemo: FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [hasDrawerHeadDivider, setHasDrawerHeadDivider] = useState(false);
  const [showSearchActionStart, setShowSearchActionStart] = useState(false);
  const [showSearchActionEnd, setShowSearchActionEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const displayMode = ChatbotDisplayMode.embedded;

  const sortLabels: { [key: string]: string } = {
    newest: 'Date (newest first)',
    oldest: 'Date (oldest first)',
    'alphabetical-asc': 'Name (A-Z)',
    'alphabetical-desc': 'Name (Z-A)'
  };

  const onSortSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setSelectedSort(value as string);
    setIsSortSelectOpen(false);
  };

  const findMatchingItems = (targetValue: string) => {
    const filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});

    return filteredConversations;
  };

  return (
    <>
      <Checkbox
        label="Display drawer"
        isChecked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        id="drawer-visible"
        name="drawer-visible"
      />
      <Checkbox
        label="Show drawer head divider"
        isChecked={hasDrawerHeadDivider}
        onChange={() => setHasDrawerHeadDivider(!hasDrawerHeadDivider)}
        id="drawer-head-divider"
        name="drawer-head-divider"
      />
      <Checkbox
        label="Show search action start"
        isChecked={showSearchActionStart}
        onChange={() => setShowSearchActionStart(!showSearchActionStart)}
        id="show-search-action-start"
        name="show-search-action-start"
      />
      <Checkbox
        label="Show search action end"
        isChecked={showSearchActionEnd}
        onChange={() => setShowSearchActionEnd(!showSearchActionEnd)}
        id="show-search-action-end"
        name="show-search-action-end"
      />
      <Checkbox
        label="Show loading state"
        isChecked={isLoading}
        onChange={() => setIsLoading(!isLoading)}
        id="drawer-is-loading"
        name="drawer-is-loading"
      />
      <ChatbotConversationHistoryNav
        displayMode={displayMode}
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        // eslint-disable-next-line no-console
        onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
        conversations={conversations}
        onNewChat={() => {
          setIsDrawerOpen(!isDrawerOpen);
        }}
        handleTextInputChange={(value: string) => {
          if (value === '') {
            setConversations(initialConversations);
          } else {
            const newConversations: { [key: string]: Conversation[] } = findMatchingItems(value);
            setConversations(newConversations);
          }
        }}
        drawerContent={<div>Drawer content</div>}
        hasDrawerHeadDivider={hasDrawerHeadDivider}
        isLoading={isLoading}
        searchActionStart={
          showSearchActionStart ? (
            <Button
              variant="control"
              aria-label="Filter options"
              // eslint-disable-next-line no-console
              onClick={() => console.log('Filter button clicked')}
              icon={<FilterIcon />}
            />
          ) : undefined
        }
        searchActionEnd={
          showSearchActionEnd ? (
            <Select
              id="sort-select"
              isOpen={isSortSelectOpen}
              selected={selectedSort}
              onSelect={onSortSelect}
              onOpenChange={(isOpen) => setIsSortSelectOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsSortSelectOpen(!isSortSelectOpen)}
                  isExpanded={isSortSelectOpen}
                  variant="plain"
                  aria-label={`${sortLabels[selectedSort]}, Sort conversations`}
                  icon={
                    <SortAmountDownIcon
                      style={{
                        transform:
                          selectedSort === 'oldest' || selectedSort === 'alphabetical-asc' ? 'scaleY(-1)' : 'none'
                      }}
                    />
                  }
                />
              )}
            >
              <SelectList>
                {Object.keys(sortLabels).map((currentLabel) => (
                  <SelectOption key={currentLabel} value={currentLabel}>
                    {sortLabels[currentLabel]}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          ) : undefined
        }
      />
    </>
  );
};
