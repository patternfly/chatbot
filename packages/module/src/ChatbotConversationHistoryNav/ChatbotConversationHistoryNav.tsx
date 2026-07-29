// ============================================================================
// Chatbot Header - Chatbot Conversation History Nav
// ============================================================================
import type { KeyboardEvent, FunctionComponent, ReactNode } from 'react';
import { useLayoutEffect, useRef, Fragment, isValidElement } from 'react';

// Import PatternFly components
import {
  Button,
  ButtonProps,
  Divider,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerPanelBody,
  DrawerProps,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerContentBody,
  InputGroup,
  InputGroupItem,
  SearchInput,
  Title,
  DrawerPanelContentProps,
  DrawerContentProps,
  DrawerContentBodyProps,
  DrawerHeadProps,
  DrawerActionsProps,
  DrawerCloseButtonProps,
  DrawerPanelBodyProps,
  SkeletonProps,
  Icon,
  TitleProps,
  SearchInputProps,
  MenuProps,
  MenuListProps,
  MenuList,
  MenuGroup,
  MenuItem,
  Menu,
  MenuContent,
  MenuItemProps,
  MenuGroupProps,
  MenuContentProps,
  ExpandableSection,
  ExpandableSectionToggle,
  ExpandableSectionProps,
  ExpandableSectionToggleProps
} from '@patternfly/react-core';

import { RhUiClockIcon, RhUiCommentIcon, RhUiEditFillIcon } from '@patternfly/react-icons';
import { ChatbotDisplayMode } from '../Chatbot/Chatbot';
import ConversationHistoryDropdown from './ChatbotConversationHistoryDropdown';
import LoadingState from './LoadingState';
import HistoryEmptyState, { HistoryEmptyStateProps } from './EmptyState';

const isConversation = (item: unknown): item is Conversation =>
  Boolean(item && typeof item === 'object' && 'id' in item && 'text' in item && !('items' in item));

const isConversationGroup = (item: unknown): item is ConversationGroup =>
  Boolean(item && typeof item === 'object' && 'id' in item && 'label' in item && 'items' in item);

const isConversationGroupArray = (items: unknown[]): items is ConversationGroup[] =>
  items.length > 0 && isConversationGroup(items[0]);

const getCollapsibleGroupContentId = (groupId: string) => `chatbot-nav-group-${groupId}-content`;

const focusFirstGroupMenuItem = (contentId: string) => {
  document
    .getElementById(contentId)
    ?.querySelector<HTMLElement>('ul button:not(:disabled), ul a:not([aria-disabled="true"])')
    ?.focus();
};

const getShowAllToggleId = (groupId: string) => `chatbot-nav-group-${groupId}-show-all-toggle`;

const focusElementById = (id: string) => {
  document.getElementById(id)?.focus();
};

const useFocusFirstMenuItemOnExpand = (isExpanded: boolean, contentId: string) => {
  const wasExpandedRef = useRef(isExpanded);

  useLayoutEffect(() => {
    if (isExpanded && !wasExpandedRef.current) {
      focusFirstGroupMenuItem(contentId);
    }

    wasExpandedRef.current = isExpanded;
  }, [isExpanded, contentId]);
};

// The toggle keeps focus on itself in both directions (rather than moving focus into
// the revealed content) since it stays mounted at a fixed position in the list.
const useShowAllFocusManagement = (isExpanded: boolean, toggleId: string, hasOverflowItems: boolean) => {
  const wasExpandedRef = useRef(isExpanded);

  useLayoutEffect(() => {
    if (hasOverflowItems && isExpanded !== wasExpandedRef.current) {
      focusElementById(toggleId);
    }

    wasExpandedRef.current = isExpanded;
  }, [isExpanded, toggleId, hasOverflowItems]);
};

interface ShowAllGroupBodyProps {
  group: ConversationGroup;
  getNavItem: (conversation: Conversation) => ReactNode;
}

// The toggle is rendered as a real MenuItem (rather than a standalone button) so it
// participates in the Menu's built-in roving tabindex and arrow-key navigation just
// like any other conversation item, instead of being skipped over or interrupting
// arrow-key handling. Since it keeps a stable key and DOM position regardless of how
// many overflow items are shown, it also keeps focus across clicks without being
// unmounted or recreated.
const ShowAllGroupBody: FunctionComponent<ShowAllGroupBodyProps> = ({ group, getNavItem }) => {
  const { visibleCount, isExpanded, onToggle, label } = group.showAll!;
  const conversationItems = group.items.filter(isConversation);
  const alwaysVisibleItems = conversationItems.slice(0, visibleCount);
  const overflowItems = conversationItems.slice(visibleCount);
  const hasOverflowItems = overflowItems.length > 0;
  const toggleId = getShowAllToggleId(group.id);
  const toggleLabel = label ?? (isExpanded ? 'Show less' : 'Show all');

  useShowAllFocusManagement(isExpanded, toggleId, hasOverflowItems);

  return (
    <>
      <MenuList {...group.menuListProps}>
        {alwaysVisibleItems.map((chat) => (
          <Fragment key={chat.id}>{getNavItem(chat)}</Fragment>
        ))}
        {isExpanded && overflowItems.map((chat) => <Fragment key={chat.id}>{getNavItem(chat)}</Fragment>)}
        {hasOverflowItems && (
          <MenuItem
            key="show-all-toggle"
            id={toggleId}
            itemId={toggleId}
            className="pf-chatbot__menu-show-all-toggle"
            onClick={() => onToggle(!isExpanded)}
          >
            {toggleLabel}
          </MenuItem>
        )}
      </MenuList>
      {group.footer}
    </>
  );
};

interface CollapsibleConversationGroupProps {
  group: ConversationGroup;
  children: ReactNode;
}

const CollapsibleConversationGroup: FunctionComponent<CollapsibleConversationGroupProps> = ({ group, children }) => {
  const toggleId = `chatbot-nav-group-${group.id}-toggle`;
  const contentId = getCollapsibleGroupContentId(group.id);
  const { isExpanded, onToggle, expandableSectionProps, expandableSectionToggleProps } = group.collapsible!;

  useFocusFirstMenuItemOnExpand(isExpanded, contentId);

  return (
    <div
      className={`pf-chatbot__menu-item-header pf-chatbot__menu-item-header--collapsible ${group.menuGroupProps?.className ?? ''}`}
    >
      <ExpandableSectionToggle
        toggleId={toggleId}
        contentId={contentId}
        isExpanded={isExpanded}
        onToggle={onToggle}
        toggleWrapper="h3"
        className="pf-chatbot__menu-group-toggle"
        {...expandableSectionToggleProps}
      >
        {group.label}
      </ExpandableSectionToggle>
      <ExpandableSection
        isDetached
        isExpanded={isExpanded}
        toggleId={toggleId}
        contentId={contentId}
        {...expandableSectionProps}
      >
        {/* Only mount the collapsed group's menu items while expanded. ExpandableSection
            only toggles a `hidden` attribute on its content wrapper, so if the items stayed
            mounted while collapsed, the Menu's arrow-key handler (which finds navigable
            elements via getElementsByTagName('LI') across the whole menu) would still see
            them, try to focus them, and silently fail since hidden elements aren't focusable
            - dead-ending keyboard navigation at the preceding item. */}
        {isExpanded && children}
      </ExpandableSection>
    </div>
  );
};

export interface Conversation {
  /** Conversation id */
  id: string;
  /** Conversation icon */
  icon?: React.ReactNode;
  /** Flag for no icon */
  noIcon?: boolean;
  /** Conversation */
  text: string;
  /** Dropdown items rendered in conversation settings dropdown */
  menuItems?: React.ReactNode;
  /** Optional classname applied to conversation settings dropdown */
  menuClassName?: string;
  /** Tooltip content and aria-label applied to conversation settings dropdown */
  label?: string;
  /** Callback for when user selects item. */
  onSelect?: (event?: React.MouseEvent, value?: string | number) => void;
  /** Additional props passed to menu item */
  additionalProps?: MenuItemProps;
  /** Custom dropdown ID to ensure uniqueness across demo instances */
  dropdownId?: string;
}

export interface ConversationGroupShowAll {
  /** Number of items visible when collapsed */
  visibleCount: number;
  /** Whether all items are shown */
  isExpanded: boolean;
  /** Callback when show all / show less is toggled */
  onToggle: (isExpanded: boolean) => void;
  /** Custom content rendered in the show all / show less toggle. Defaults to "Show all" when collapsed and "Show less" when expanded. */
  label?: ReactNode;
}

export interface ConversationGroupCollapsible {
  /** Whether the group content is expanded */
  isExpanded: boolean;
  /** Callback when the group is toggled */
  onToggle: (isExpanded: boolean) => void;
  /** Additional props applied to ExpandableSection */
  expandableSectionProps?: Omit<ExpandableSectionProps, 'ref'>;
  /** Additional props applied to ExpandableSectionToggle */
  expandableSectionToggleProps?: ExpandableSectionToggleProps;
}

export interface ConversationGroup {
  /** Unique group id */
  id: string;
  /** Group label rendered as a MenuGroup heading or collapsible toggle label */
  label: ReactNode;
  /** Conversation items or custom menu content such as a "Show all" action */
  items: (Conversation | ReactNode)[];
  /** Content rendered after the group's menu list */
  footer?: ReactNode;
  /** Custom group header that replaces the default label or collapsible toggle */
  header?: ReactNode;
  /** When set, the group renders as a collapsible section */
  collapsible?: ConversationGroupCollapsible;
  /** When set, truncates the list with an expandable show all / show less section */
  showAll?: ConversationGroupShowAll;
  /** Additional props applied to the conversation menu group */
  menuGroupProps?: MenuGroupProps;
  /** Additional props applied to the conversation list */
  menuListProps?: Omit<MenuListProps, 'children'>;
}

export type Conversations =
  | (Conversation | ReactNode)[]
  | ConversationGroup[]
  | { [key: string]: (Conversation | ReactNode)[] };

export interface ChatbotConversationHistoryNavProps extends DrawerProps {
  /** Function called to toggle drawer */
  onDrawerToggle: (event: React.KeyboardEvent | React.MouseEvent | React.TransitionEvent) => void;
  /** Flag to indicate whether drawer is open */
  isDrawerOpen: boolean;
  /** Function called to close drawer */
  setIsDrawerOpen: (bool: boolean) => void;
  /* itemId of the currently active item. */
  activeItemId?: string | number;
  /** Callback function for when an item is selected */
  onSelectActiveItem?: (event?: React.MouseEvent, itemId?: string | number) => void;
  /** Items shown in chat history */
  conversations: Conversations;
  /** Additional button props for new chat button. */
  newChatButtonProps?: ButtonProps;
  /** Additional props applied to conversation menu group. If conversations is an object, you should pass an object of MenuGroupProps for each group. */
  menuGroupProps?: MenuGroupProps | { [key: string]: MenuGroupProps };
  /** Additional props applied to conversation list. If conversations is an object, you should pass an object of MenuListProps for each group. */
  menuListProps?: Omit<MenuListProps, 'children'> | { [key: string]: Omit<MenuListProps, 'children'> };
  /** Text shown in blue button */
  newChatButtonText?: string;
  /** Callback function for when blue button is clicked. Omit to hide blue "new chat button" */
  onNewChat?: () => void;
  /** Content wrapped by conversation history nav */
  drawerContent?: React.ReactNode;
  /** Placeholder for search input */
  searchInputPlaceholder?: string;
  /** Aria label for search input */
  searchInputAriaLabel?: string;
  /** Additional props passed to search input */
  searchInputProps?: SearchInputProps;
  /** A callback for when the input value changes. Omit to hide input field */
  handleTextInputChange?: (value: string) => void;
  /** Display mode of chatbot */
  displayMode: ChatbotDisplayMode;
  /** Reverses the order of the drawer action buttons */
  reverseButtonOrder?: boolean;
  /** Custom test id for the drawer actions */
  drawerActionsTestId?: string;
  /** Additional props applied to menu  */
  menuProps?: MenuProps;
  /** Additional props applied to panel */
  drawerPanelContentProps?: DrawerPanelContentProps;
  /** Additional props applied to drawer content */
  drawerContentProps?: Omit<DrawerContentProps, 'panelContent'>;
  /** Additional props applied to drawer content body */
  drawerContentBodyProps?: DrawerContentBodyProps;
  /** Additional props applied to drawer head */
  drawerHeadProps?: DrawerHeadProps;
  /** Additional props applied to drawer actions */
  drawerActionsProps?: DrawerActionsProps;
  /** Additional props applied to drawer close button */
  drawerCloseButtonProps?: DrawerCloseButtonProps;
  /** Additional props appleid to drawer panel body */
  drawerPanelBodyProps?: DrawerPanelBodyProps;
  /** Flag indicating whether a divider should render between the drawer head and title. */
  hasDrawerHeadDivider?: boolean;
  /** Whether to show drawer loading state */
  isLoading?: boolean;
  /** Additional props for loading state */
  loadingState?: SkeletonProps;
  /** Content to show in error state. Error state will appear once content is passed in. */
  errorState?: HistoryEmptyStateProps;
  /** Content to show in empty state. Empty state will appear once content is passed in. */
  emptyState?: HistoryEmptyStateProps;
  /** Content to show in no results state. No results state will appear once content is passed in. */
  noResultsState?: HistoryEmptyStateProps;
  /** Sets drawer to compact styling. */
  isCompact?: boolean;
  /** Display title  */
  title?: string;
  /** Icon displayed in title */
  navTitleIcon?: React.ReactNode;
  /** Title header level */
  navTitleProps?: Partial<TitleProps>;
  /** Visually hidden text that gets announced by assistive technologies. Should be used to convey the result count when the search input value changes. */
  searchInputScreenReaderText?: string;
  /** Custom action rendered before the search input. */
  searchActionStart?: React.ReactNode;
  /** Custom action rendered after the search input. */
  searchActionEnd?: React.ReactNode;
  /** A custom search toolbar to render below the title. This will override the default search actions and/or search input. */
  searchToolbar?: React.ReactNode;
  /** Additional props passed to MenuContent */
  menuContentProps?: Omit<MenuContentProps, 'ref'>;
}

export const ChatbotConversationHistoryNav: FunctionComponent<ChatbotConversationHistoryNavProps> = ({
  onDrawerToggle,
  isDrawerOpen,
  setIsDrawerOpen,
  activeItemId,
  onSelectActiveItem,
  conversations,
  menuListProps,
  newChatButtonText = 'New chat',
  drawerContent,
  onNewChat,
  newChatButtonProps,
  searchInputPlaceholder = 'Search previous conversations...',
  searchInputAriaLabel = 'Search previous conversations',
  searchInputProps,
  handleTextInputChange,
  displayMode,
  reverseButtonOrder = false,
  drawerActionsTestId = 'chatbot-nav-drawer-actions',
  drawerPanelContentProps,
  drawerContentProps,
  drawerContentBodyProps,
  drawerHeadProps,
  drawerActionsProps,
  drawerCloseButtonProps,
  drawerPanelBodyProps,
  hasDrawerHeadDivider,
  isLoading,
  loadingState,
  errorState,
  emptyState,
  noResultsState,
  isCompact,
  title = 'Chat history',
  navTitleProps,
  navTitleIcon = <RhUiClockIcon />,
  searchInputScreenReaderText,
  searchActionStart,
  searchActionEnd,
  searchToolbar,
  menuProps,
  menuGroupProps,
  menuContentProps,
  ...props
}: ChatbotConversationHistoryNavProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const getNavItem = (conversation: Conversation) => (
    <MenuItem
      className={`pf-chatbot__menu-item ${activeItemId && activeItemId === conversation.id ? 'pf-chatbot__menu-item--active' : ''}`}
      itemId={conversation.id}
      {...(conversation.noIcon ? {} : { icon: conversation.icon ?? <RhUiCommentIcon /> })}
      /* eslint-disable indent */
      {...(conversation.menuItems
        ? {
            actions: (
              <ConversationHistoryDropdown
                menuClassName={conversation.menuClassName}
                onSelect={conversation.onSelect}
                menuItems={conversation.menuItems}
                label={conversation.label}
              />
            )
          }
        : {})}
      {...conversation.additionalProps}
    >
      {conversation.text}
    </MenuItem>
  );

  const renderConversationItems = (items: (Conversation | ReactNode)[], keyPrefix = '') =>
    items.map((item, index) => {
      if (isConversation(item)) {
        return <Fragment key={item.id}>{getNavItem(item)}</Fragment>;
      }

      const key = isValidElement(item) && item.key != null ? String(item.key) : `${keyPrefix}-${index}`;

      return <Fragment key={key}>{item}</Fragment>;
    });

  const renderGroupBody = (group: ConversationGroup) => {
    if (group.showAll) {
      return <ShowAllGroupBody group={group} getNavItem={getNavItem} />;
    }

    return (
      <>
        <MenuList {...group.menuListProps}>{renderConversationItems(group.items, group.id)}</MenuList>
        {group.footer}
      </>
    );
  };

  const renderConversationGroup = (group: ConversationGroup) => {
    if (group.header) {
      return (
        <div className={`pf-chatbot__menu-item-header ${group.menuGroupProps?.className ?? ''}`} key={group.id}>
          {group.header}
          {renderGroupBody(group)}
        </div>
      );
    }

    if (group.collapsible) {
      return (
        <CollapsibleConversationGroup group={group} key={group.id}>
          {renderGroupBody(group)}
        </CollapsibleConversationGroup>
      );
    }

    return (
      <MenuGroup
        className="pf-chatbot__menu-item-header"
        label={group.label}
        key={group.id}
        labelHeadingLevel="h3"
        {...group.menuGroupProps}
      >
        {renderGroupBody(group)}
      </MenuGroup>
    );
  };

  const normalizeObjectGroups = (groupedConversations: { [key: string]: (Conversation | ReactNode)[] }) =>
    Object.keys(groupedConversations).map((groupKey) => ({
      id: groupKey,
      label: groupKey,
      items: groupedConversations[groupKey],
      menuGroupProps:
        menuGroupProps && typeof menuGroupProps === 'object' && groupKey in menuGroupProps
          ? (menuGroupProps as { [key: string]: MenuGroupProps })[groupKey]
          : undefined,
      menuListProps:
        menuListProps && typeof menuListProps === 'object' && groupKey in menuListProps
          ? (menuListProps as { [key: string]: Omit<MenuListProps, 'children'> })[groupKey]
          : undefined
    }));

  const buildConversations = () => {
    if (Array.isArray(conversations)) {
      if (isConversationGroupArray(conversations)) {
        return <>{conversations.map(renderConversationGroup)}</>;
      }

      return <MenuList {...menuListProps}>{renderConversationItems(conversations)}</MenuList>;
    }

    return <>{normalizeObjectGroups(conversations).map(renderConversationGroup)}</>;
  };

  // Menu Content
  // - Consumers should pass an array to <Chatbot> of the list of conversations
  // - Groups could be optional, but items need to be ordered by date
  const renderMenuContent = () => {
    if (errorState) {
      return <HistoryEmptyState {...errorState} />;
    }

    if (emptyState) {
      return <HistoryEmptyState {...emptyState} />;
    }

    if (noResultsState) {
      return <HistoryEmptyState {...noResultsState} />;
    }
    return (
      <Menu
        className="pf-chatbot__history-menu"
        isPlain
        onSelect={onSelectActiveItem}
        activeItemId={activeItemId}
        {...menuProps}
      >
        <MenuContent {...menuContentProps}>{buildConversations()}</MenuContent>
      </Menu>
    );
  };

  const renderDrawerContent = () => (
    <>
      <DrawerPanelBody {...drawerPanelBodyProps}>{renderMenuContent()}</DrawerPanelBody>
    </>
  );

  const searchInputContainer = handleTextInputChange && (
    <div className="pf-chatbot__input">
      <SearchInput
        aria-label={searchInputAriaLabel}
        onChange={(_event, value) => handleTextInputChange(value)}
        placeholder={searchInputPlaceholder}
        {...searchInputProps}
      />
      {searchInputScreenReaderText && (
        <div className="pf-chatbot__filter-announcement pf-chatbot-m-hidden">{searchInputScreenReaderText}</div>
      )}
    </div>
  );

  const renderSearchAndActions = () => {
    if (searchToolbar) {
      return searchToolbar;
    }

    return searchActionStart || searchActionEnd ? (
      <div className="pf-chatbot__history-search-actions">
        <InputGroup>
          {searchActionStart && <InputGroupItem>{searchActionStart}</InputGroupItem>}
          {searchInputContainer && <InputGroupItem isFill>{searchInputContainer}</InputGroupItem>}
          {searchActionEnd && <InputGroupItem>{searchActionEnd}</InputGroupItem>}
        </InputGroup>
      </div>
    ) : (
      searchInputContainer
    );
  };

  const renderPanelContent = () => {
    const drawer = (
      <>
        <DrawerHead {...drawerHeadProps}>
          <DrawerActions
            data-testid={drawerActionsTestId}
            className={reverseButtonOrder ? 'pf-v6-c-drawer__actions--reversed' : ''}
            {...drawerActionsProps}
          >
            <DrawerCloseButton onClick={onDrawerToggle} {...drawerCloseButtonProps} />
            {onNewChat && (
              <Button
                size={isCompact ? 'sm' : undefined}
                onClick={onNewChat}
                icon={<RhUiEditFillIcon />}
                {...newChatButtonProps}
              >
                {newChatButtonText}
              </Button>
            )}
          </DrawerActions>
        </DrawerHead>
        {hasDrawerHeadDivider && <Divider className="pf-chatbot__heading-divider" />}
        <div className="pf-chatbot__heading-container">
          <div className="pf-chatbot__title-container">
            <Icon size="lg" className="pf-chatbot__title-icon">
              {navTitleIcon}
            </Icon>
            <Title className="pf-chatbot__title" headingLevel="h2" {...navTitleProps}>
              {title}
            </Title>
          </div>
          {!isLoading && renderSearchAndActions()}
        </div>
        {isLoading ? <LoadingState {...loadingState} /> : renderDrawerContent()}
      </>
    );
    return (
      <DrawerPanelContent
        aria-live="polite"
        focusTrap={{ enabled: true }}
        defaultSize="384px"
        {...drawerPanelContentProps}
      >
        {drawer}
      </DrawerPanelContent>
    );
  };

  // An onKeyDown property must be passed to the Drawer component to handle closing
  // the drawer panel and deactivating the focus trap via the Escape key.
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // prevents using escape key on menu buttons from closing the panel, but I'm not sure if this is allowed
      if (event.target instanceof HTMLInputElement && event.target.type !== 'button') {
        setIsDrawerOpen(false);
      }
    }
  };

  return (
    <Drawer
      className={`pf-chatbot__history ${isCompact ? 'pf-m-compact' : ''}`}
      isExpanded={isDrawerOpen}
      onExpand={onExpand}
      position="start"
      onKeyDown={onEscape}
      isInline={displayMode === ChatbotDisplayMode.fullscreen || displayMode === ChatbotDisplayMode.embedded}
      {...props}
    >
      <DrawerContent panelContent={renderPanelContent()} {...drawerContentProps}>
        <DrawerContentBody {...drawerContentBodyProps}>
          <>
            <div
              className={`${isDrawerOpen && (displayMode === ChatbotDisplayMode.default || displayMode === ChatbotDisplayMode.docked || displayMode === ChatbotDisplayMode.drawer) ? 'pf-v6-c-backdrop pf-chatbot__drawer-backdrop' : undefined} `}
            ></div>
            {drawerContent}
          </>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatbotConversationHistoryNav;
