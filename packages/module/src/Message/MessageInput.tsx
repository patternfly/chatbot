// ============================================================================
// Chatbot Main - Message Input
// ============================================================================
import type { FormEvent, FunctionComponent, Ref } from 'react';
import { useState } from 'react';
import { ActionGroup, Button, Form, FormProps, TextArea } from '@patternfly/react-core';

export interface MessageInputProps extends FormProps {
  /** Placeholder for edit input */
  editPlaceholder?: string;
  /** Label for the English word "Update" used in edit mode. */
  updateWord?: string;
  /** Label for the English word "Cancel" used in edit mode. */
  cancelWord?: string;
  /** Callback function for when edit mode update button is clicked */
  onEditUpdate?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => void;
  /** Callback functionf or when edit cancel update button is clicked */
  onEditCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Ref applied to editbale message input */
  inputRef?: Ref<HTMLTextAreaElement>;
  /** Message text */
  content?: string;
}

const MessageInput: FunctionComponent<MessageInputProps> = ({
  editPlaceholder = 'Edit prompt message...',
  updateWord = 'Update',
  cancelWord = 'Cancel',
  onEditUpdate,
  onEditCancel,
  inputRef,
  content,
  ...props
}: MessageInputProps) => {
  const [messageText, setMessageText] = useState(content ?? '');

  const onChange = (_event: FormEvent<HTMLTextAreaElement>, value: string) => {
    setMessageText(value);
  };

  return (
    <Form {...props}>
      <TextArea
        placeholder={editPlaceholder}
        value={messageText}
        onChange={onChange}
        aria-label={editPlaceholder}
        autoResize
        ref={inputRef}
      />
      <ActionGroup className="pf-chatbot__message-edit-buttons">
        <Button variant="primary" onClick={(event) => onEditUpdate && onEditUpdate(event, messageText)}>
          {updateWord}
        </Button>
        <Button variant="secondary" onClick={onEditCancel}>
          {cancelWord}
        </Button>
      </ActionGroup>
    </Form>
  );
};

export default MessageInput;
