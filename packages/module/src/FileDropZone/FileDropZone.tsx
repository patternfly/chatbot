import { DropEvent, MultipleFileUpload, MultipleFileUploadMain } from '@patternfly/react-core';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { ChatbotDisplayMode } from '../Chatbot';
import { UploadIcon } from '@patternfly/react-icons';
import { Accept, FileError, FileRejection } from 'react-dropzone/.';

export interface FileDropZoneProps {
  /** Content displayed when the drop zone is not currently in use */
  children?: React.ReactNode;
  /** Custom classname for the outer dropzone component */
  className?: string;
  /** Informational text that shows below the title in the drop zone */
  infoText?: string;
  /** When files are dropped or uploaded this callback will be called with all accepted files */
  onFileDrop: (event: DropEvent, data: File[]) => void;
  /** Specifies the file types accepted by the attachment upload component.
   *  Files that don't match the accepted types will be disabled in the file picker.
   *  For example,
   *   allowedFileTypes: { 'application/json': ['.json'], 'text/plain': ['.txt'] }
   **/
  allowedFileTypes?: Accept;
  /** Display mode for the Chatbot parent; this influences the styles applied */
  displayMode?: ChatbotDisplayMode;
  /** Minimum file size allowed */
  minSize?: number;
  /** Max file size allowed */
  maxSize?: number;
  /** Max number of files allowed */
  maxFiles?: number;
  /** Whether attachments are disabled */
  isAttachmentDisabled?: boolean;
  /** Callback when file(s) are attached */
  onAttach?: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  /** Callback function for AttachButton when an attachment fails */
  onAttachRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  /** Validator for files; see https://react-dropzone.js.org/#!/Custom%20validation for more information */
  validator?: <T extends File>(file: T) => FileError | readonly FileError[] | null;
}

const FileDropZone: FunctionComponent<FileDropZoneProps> = ({
  children,
  className,
  infoText = 'Maximum file size is 25 MB',
  onFileDrop,
  allowedFileTypes,
  minSize,
  maxSize,
  maxFiles,
  isAttachmentDisabled,
  onAttach,
  onAttachRejected,
  validator,
  displayMode = ChatbotDisplayMode.default,
  ...props
}: FileDropZoneProps) => {
  const [showDropZone, setShowDropZone] = useState(false);

  const renderDropZone = () => (
    <>
      <MultipleFileUploadMain
        titleIcon={<UploadIcon />}
        titleText="Drag and drop your file here"
        infoText={infoText}
        isUploadButtonHidden
      />
    </>
  );

  return (
    <MultipleFileUpload
      dropzoneProps={{
        accept: allowedFileTypes,
        onDrop: (acceptedFiles, fileRejections: FileRejection[], event: DropEvent) => {
          setShowDropZone(false);
          onAttach && onAttach(acceptedFiles, fileRejections, event);
        },
        minSize,
        maxSize,
        maxFiles,
        disabled: isAttachmentDisabled,
        onDropRejected: onAttachRejected,
        validator,
        ...props
      }}
      onDragEnter={() => setShowDropZone(true)}
      onDragLeave={() => setShowDropZone(false)}
      onFileDrop={onFileDrop}
      className={`pf-chatbot__dropzone pf-chatbot__dropzone--${displayMode} pf-chatbot__dropzone--${showDropZone ? 'visible' : 'invisible'} ${className ? className : ''}`}
    >
      {showDropZone ? renderDropZone() : children}
    </MultipleFileUpload>
  );
};

export default FileDropZone;
