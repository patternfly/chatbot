import { useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { Button, Checkbox } from '@patternfly/react-core';
import ImagePreview from '@patternfly/chatbot/dist/dynamic/ImagePreview';
import filePreview from './file-preview.svg';

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
      <ImagePreview
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        isCompact={isCompact}
        onCloseFileDetailsLabel={() => {
          // eslint-disable-next-line no-console
          console.log('Clicked close button');
        }}
        images={[{ fileName: 'image.png', fileSize: '134KB', image: <img src={filePreview} alt="One" /> }]}
      ></ImagePreview>
    </>
  );
};
