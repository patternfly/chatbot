import React from 'react';
import FileDropZone from '@patternfly/chatbot/dist/dynamic/FileDropZone';
import { DropEvent } from '@patternfly/react-core';

interface readFile {
  fileName: string;
  data?: string;
  loadResult?: 'danger' | 'success';
  loadError?: DOMException;
}

export const DropzoneExample: React.FunctionComponent = () => {
  const [currentFiles, setCurrentFiles] = React.useState<File[]>([]);
  const [readFileData, setReadFileData] = React.useState<readFile[]>([]);

  // remove files from both state arrays based on their name
  const removeFiles = (namesOfFilesToRemove: string[]) => {
    const newCurrentFiles = currentFiles.filter(
      (currentFile) => !namesOfFilesToRemove.some((fileName) => fileName === currentFile.name)
    );

    setCurrentFiles(newCurrentFiles);

    const newReadFiles = readFileData.filter(
      (readFile) => !namesOfFilesToRemove.some((fileName) => fileName === readFile.fileName)
    );

    setReadFileData(newReadFiles);
  };

  // callback that will be called by the react dropzone with the newly dropped file objects
  const handleFileDrop = (_event: DropEvent, droppedFiles: File[]) => {
    // any custom validation you'd like
    if (droppedFiles.length > 1) {
      alert('Error: Dropped too many files');
      return;
    }
    if (droppedFiles[0].size > 25000000) {
      alert('Error: File size too large');
      return;
    }
    // identify what, if any, files are re-uploads of already uploaded files
    const currentFileNames = currentFiles.map((file) => file.name);
    const reUploads = droppedFiles.filter((droppedFile) => currentFileNames.includes(droppedFile.name));

    /** this promise chain is needed because if the file removal is done at the same time as the file adding react
     * won't realize that the status items for the re-uploaded files needs to be re-rendered */
    Promise.resolve()
      .then(() => removeFiles(reUploads.map((file) => file.name)))
      .then(() => alert(`Dropped ${droppedFiles.map((file) => file.name)}`));
  };

  return (
    <FileDropZone onFileDrop={handleFileDrop} displayMode="fullscreen">
      <div className="pf-chatbot__file-drop-zone-example">
        This is example content that would be shown when no dragging is happening. To see the drop zone, start to drag
        an item into this section. The static content will be replaced by an active drop zone message.
      </div>
    </FileDropZone>
  );
};
