// ============================================================================
// Chatbot Header - Chatbot Conversation History Nav
// ============================================================================
import type { KeyboardEvent, FunctionComponent } from 'react';
import { useRef, Fragment } from 'react';

// Import PatternFly components
import {
  Button,
  ButtonProps,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerPanelBody,
  DrawerProps,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerContentBody,
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
  MenuProps,
  TitleProps,
  MenuListProps,
  SearchInputProps,
  MenuList,
  MenuGroup,
  MenuItem,
  Menu,
  MenuContent,
  MenuItemProps,
  MenuGroupProps,
  MenuContentProps
} from '@patternfly/react-core';

import { OutlinedClockIcon, OutlinedCommentAltIcon, PenToSquareIcon } from '@patternfly/react-icons';
import { ChatbotDisplayMode } from '../Chatbot/Chatbot';
import ConversationHistoryDropdown from './ChatbotConversationHistoryDropdown';
import LoadingState from './LoadingState';
import HistoryEmptyState, { HistoryEmptyStateProps } from './EmptyState';

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
  /** Items shown in conversation history */
  conversations: Conversation[] | { [key: string]: Conversation[] };
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
  isLoading,
  loadingState,
  errorState,
  emptyState,
  noResultsState,
  isCompact,
  title = 'Chat history',
  navTitleProps,
  navTitleIcon = <OutlinedClockIcon />,
  searchInputScreenReaderText,
  menuProps,
  menuGroupProps,
  menuContentProps,
  ...props
}: ChatbotConversationHistoryNavProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const isConversation = (item: any): item is Conversation =>
    item && typeof item === 'object' && 'id' in item && 'text' in item;

  const getNavItem = (conversation: Conversation) => (
    <MenuItem
      className={`pf-chatbot__menu-item ${activeItemId && activeItemId === conversation.id ? 'pf-chatbot__menu-item--active' : ''}`}
      itemId={conversation.id}
      {...(conversation.noIcon ? {} : { icon: conversation.icon ?? <OutlinedCommentAltIcon /> })}
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

  const buildConversations = () => {
    if (Array.isArray(conversations)) {
      return (
        <MenuList {...menuListProps}>
          {conversations.map((conversation) => {
            if (isConversation(conversation)) {
              return <Fragment key={conversation.id}>{getNavItem(conversation)}</Fragment>;
            } else {
              return conversation;
            }
          })}
        </MenuList>
      );
    } else {
      return (
        <>
          {Object.keys(conversations).map((navGroup) => (
            <MenuGroup
              className="pf-chatbot__menu-item-header"
              label={navGroup}
              key={navGroup}
              labelHeadingLevel="h3"
              {...menuGroupProps?.[navGroup]}
            >
              <MenuList {...menuListProps?.[navGroup]}>
                {conversations[navGroup].map((conversation: Conversation) => (
                  <Fragment key={conversation.id}>{getNavItem(conversation)}</Fragment>
                ))}
              </MenuList>
            </MenuGroup>
          ))}
        </>
      );
    }
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
      <Menu isPlain onSelect={onSelectActiveItem} activeItemId={activeItemId} {...menuProps}>
        <MenuContent {...menuContentProps}>{buildConversations()}</MenuContent>
      </Menu>
    );
  };

  const renderDrawerContent = () => (
    <>
      <DrawerPanelBody {...drawerPanelBodyProps}>{renderMenuContent()}</DrawerPanelBody>
    </>
  );

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
                icon={<PenToSquareIcon />}
                {...newChatButtonProps}
              >
                {newChatButtonText}
              </Button>
            )}
          </DrawerActions>
        </DrawerHead>
        <div className="pf-chatbot__heading-container">
          <div className="pf-chatbot__title-container">
            <Icon size="lg" className="pf-chatbot__title-icon">
              {navTitleIcon}
            </Icon>
            <Title className="pf-chatbot__title" headingLevel="h2" {...navTitleProps}>
              {title}
            </Title>
          </div>
          {!isLoading && handleTextInputChange && (
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
          )}
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
