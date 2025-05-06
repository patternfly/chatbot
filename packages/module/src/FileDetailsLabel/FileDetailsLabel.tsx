import type { MouseEvent } from 'react';
import { PropsWithChildren } from 'react';
import { Button, Label } from '@patternfly/react-core';
import FileDetails from '../FileDetails';
import { Spinner } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

interface FileDetailsLabelProps {
  /** Name of file, including extension */
  fileName: string;
  /** Unique id of file */
  fileId?: string | number;
  /** Whether to display loading icon */
  isLoading?: boolean;
  /** Callback function for when label is clicked */
  onClick?: (event: MouseEvent, fileName: string, fileId?: string | number) => void;
  /** Callback function for when close button is clicked */
  onClose?: (event: MouseEvent, fileName: string, fileId?: string | number) => void;
  /** Aria label for close button */
  closeButtonAriaLabel?: string;
  /** Custom test id for the component-generated language */
  languageTestId?: string;
  /** Custom test id for the loading spinner in the component */
  spinnerTestId?: string;
}

export const FileDetailsLabel = ({
  fileName,
  fileId,
  isLoading,
  onClick,
  onClose,
  closeButtonAriaLabel,
  languageTestId,
  spinnerTestId
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
          icon={<TimesIcon />}
          onClick={handleClose}
        />
      }
      {...(onClick && { onClick: (event) => onClick(event, fileName, fileId) })}
    >
      <div className="pf-chatbot__file-label-contents">
        <FileDetails
          className={isLoading ? 'pf-chatbot__file-label-loading' : undefined}
          fileName={fileName}
          languageTestId={languageTestId}
        />
        {isLoading && <Spinner data-testid={spinnerTestId} size="sm" />}
      </div>
    </Label>
  );
};

export default FileDetailsLabel;
