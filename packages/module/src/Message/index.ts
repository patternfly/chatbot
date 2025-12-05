export { default } from './Message';
export { rehypeCodeBlockToggle } from './Plugins/rehypeCodeBlockToggle';

export * from './Message';

// Sub-component containers for flexible message composition
export { default as MessageAndActions } from './MessageAndActions/MessageAndActions';
export * from './MessageAndActions/MessageAndActions';

export { default as MessageAttachmentsContainer } from './MessageAttachmentsContainer/MessageAttachmentsContainer';
export * from './MessageAttachmentsContainer/MessageAttachmentsContainer';

export { default as MessageAttachment } from './MessageAttachment/MessageAttachment';
export * from './MessageAttachment/MessageAttachment';

export { default as ResponseActionsGroups } from './ResponseActionsGroups/ResponseActionsGroups';
export * from './ResponseActionsGroups/ResponseActionsGroups';
