import { useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { Button, Checkbox } from '@patternfly/react-core';
import ImagePreview from '@patternfly/chatbot/dist/dynamic/ImagePreview';
import filePreview from './file-preview.svg';

export const AttachmentEditModalExample: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [hasNav, setHasNav] = useState(false);

  const handleModalToggle = (_event: ReactMouseEvent | MouseEvent | KeyboardEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Checkbox
        label="Show multiple images"
        isChecked={hasNav}
        onChange={() => setHasNav(!hasNav)}
        id="modal-compact-image-has-nav"
        name="modal-compact-image-has-nav"
      ></Checkbox>
      <Checkbox
        label="Show compact version"
        isChecked={isCompact}
        onChange={() => setIsCompact(!isCompact)}
        id="modal-compact-image-preview"
        name="modal-compact-image-preview"
      ></Checkbox>
      <Button onClick={handleModalToggle}>Launch image preview modal</Button>
      <ImagePreview
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        isCompact={isCompact}
        onCloseFileDetailsLabel={() => {
          // eslint-disable-next-line no-console
          console.log('Clicked close button');
        }}
        images={
          hasNav
            ? /* eslint-disable indent */
              [
                { fileName: 'image1.png', fileSize: '134KB', image: <img src={filePreview} alt="Preview one" /> },
                { fileName: 'image2.png', fileSize: '134KB', image: <img src={filePreview} alt="Preview two" /> }
              ]
            : [{ fileName: 'image.png', fileSize: '134KB', image: <img src={filePreview} alt="One" /> }]
          /* eslint-enable indent */
        }
      ></ImagePreview>
    </>
  );
};
