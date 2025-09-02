import { useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { Button, Checkbox } from '@patternfly/react-core';
import FilePreview from '@patternfly/chatbot/dist/dynamic/FilePreview';

export const AttachmentEditModalExample: FunctionComponent = () => {
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
        id="modal-compact-no-preview"
        name="modal-compact-no-preview"
      ></Checkbox>
      <Button onClick={handleModalToggle}>Launch modal</Button>
      <FilePreview
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        fileName="compressed-file.zip"
        isCompact={isCompact}
      >
        Preview unavailable
      </FilePreview>
    </>
  );
};
