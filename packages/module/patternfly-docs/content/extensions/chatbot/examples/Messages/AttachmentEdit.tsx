import { FunctionComponent, MouseEvent as ReactMouseEvent, useState } from 'react';
import { Button, Checkbox } from '@patternfly/react-core';
import { AttachmentEdit } from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';

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
        id="modal-compact-edit"
        name="modal-compact-edit"
      ></Checkbox>
      <Button onClick={handleModalToggle}>Launch attachment edit modal</Button>
      <AttachmentEdit
        code="I am a code snippet"
        fileName="test.yaml"
        handleModalToggle={handleModalToggle}
        isModalOpen={isModalOpen}
        onCancel={() => null}
        // eslint-disable-next-line no-console
        onSave={(_event, code) => console.log(`The new code is "${code}"`)}
        isCompact={isCompact}
      />
    </>
  );
};
