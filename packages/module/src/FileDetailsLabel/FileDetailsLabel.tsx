import { PropsWithChildren } from 'react';
import { Button, Label, LabelProps } from '@patternfly/react-core';
import FileDetails from '../FileDetails';
import { Spinner } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

export interface FileDetailsLabelProps extends Omit<LabelProps, 'onClose' | 'onClick'> {
  /** Name of file, including extension */
  fileName: string;
  /** Unique id of file */
  fileId?: string | number;
  /** Whether to display loading icon */
  isLoading?: boolean;
  /** Callback function for when label is clicked */
  onClick?: (event: React.MouseEvent, fileName: string, fileId?: string | number) => void;
  /** Callback function for when close button is clicked */
  onClose?: (event: React.MouseEvent, fileName: string, fileId?: string | number) => void;
  /** Aria label for close button */
  closeButtonAriaLabel?: string;
  /** Custom test id for the component-generated language */
  languageTestId?: string;
  /** Custom test id for the loading spinner in the component */
  spinnerTestId?: string;
  /** File size */
  fileSize?: string;
  /** Whether to truncate file name */
  hasTruncation?: boolean;
  /** Icon used for close button */
  closeButtonIcon?: React.ReactNode;
}

export const FileDetailsLabel = ({
  fileName,
  fileId,
  isLoading,
  onClick,
  onClose,
  closeButtonAriaLabel,
  languageTestId,
  spinnerTestId,
  fileSize,
  hasTruncation = true,
  closeButtonIcon = <TimesIcon />,
  ...props
}: PropsWithChildren<FileDetailsLabelProps>) => {
  const handleClose = (event) => {
    onClose && onClose(event, fileName, fileId);
  };
  return (
    <Label
      className="pf-chatbot__file-label"
      {...(onClose && { onClose: (event) => onClose(event, fileName, fileId) })}
      closeBtn={
        <Button
          type="button"
          variant="plain"
          aria-label={closeButtonAriaLabel ?? `Close ${fileName}`}
          icon={closeButtonIcon}
          onClick={handleClose}
        />
      }
      {...(onClick && { onClick: (event) => onClick(event, fileName, fileId) })}
      {...props}
    >
      <div className="pf-chatbot__file-label-contents">
        <FileDetails
          className={isLoading ? 'pf-chatbot__file-label-loading' : undefined}
          fileName={fileName}
          languageTestId={languageTestId}
          fileSize={fileSize}
          hasTruncation={hasTruncation}
        />
        {isLoading && <Spinner data-testid={spinnerTestId} size="sm" />}
      </div>
    </Label>
  );
};

export default FileDetailsLabel;
