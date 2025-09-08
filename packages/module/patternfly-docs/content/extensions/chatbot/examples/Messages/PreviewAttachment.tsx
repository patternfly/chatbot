import { useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { Button, Checkbox } from '@patternfly/react-core';
import { PreviewAttachment } from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';

export const PreviewAttachmentExample: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const handleModalToggle = (_event: ReactMouseEvent | MouseEvent | KeyboardEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Checkbox
        label="Show compact version"
        isChecked={isCompact}
        onChange={() => setIsCompact(!isCompact)}
        id="modal-compact-preview"
        name="modal-compact-preview"
      ></Checkbox>
      <Button onClick={handleModalToggle}>Launch attachment preview modal</Button>
      <PreviewAttachment
        code="I am a code snippet"
        fileName="test.yaml"
        handleModalToggle={handleModalToggle}
        isModalOpen={isModalOpen}
        onDismiss={() => null}
        onEdit={() => null}
        isCompact={isCompact}
      />
    </>
  );
};
