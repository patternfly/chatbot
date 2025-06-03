// ============================================================================
// Chatbot Footer - Message Bar - Attach
// ============================================================================
import type { Ref, FunctionComponent } from 'react';

import { forwardRef } from 'react';

// Import PatternFly components
import { Button, ButtonProps, DropEvent, Icon, Tooltip, TooltipProps } from '@patternfly/react-core';
import { Accept, useDropzone } from 'react-dropzone';
import { PaperclipIcon } from '@patternfly/react-icons/dist/esm/icons/paperclip-icon';

export interface AttachButtonProps extends ButtonProps {
  /** Callback for when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback function for AttachButton when an attachment is made */
  onAttachAccepted?: (data: File[], event: DropEvent) => void;
  /** Specifies the file types that the attachment upload component should accept.
   *  Files that don't match the accepted types will be disabled in the file picker.
   *  @example
   *  allowedFileTypes: { 'application/json': ['.json'], 'text/plain': ['.txt'] }
   *
   *  **/
  allowedFileTypes?: Accept;
  /** Class name for AttachButton */
  className?: string;
  /** Props to control if the AttachButton should be disabled */
  isDisabled?: boolean;
  /** Props to control the PF Tooltip component */
  tooltipProps?: Omit<TooltipProps, 'content'>;
  /** Ref applied to AttachButton and used in tooltip */
  innerRef?: React.Ref<any>;
  /** English text "Attach" used in the tooltip */
  tooltipContent?: string;
  /** Test id applied to input */
  inputTestId?: string;
  isCompact?: boolean;
}

const AttachButtonBase: FunctionComponent<AttachButtonProps> = ({
  onAttachAccepted,
  onClick,
  isDisabled,
  className,
  tooltipProps,
  innerRef,
  tooltipContent = 'Attach',
  inputTestId,
  isCompact,
  allowedFileTypes,
  ...props
}: AttachButtonProps) => {
  const { open, getInputProps } = useDropzone({
    multiple: true,
    onDropAccepted: onAttachAccepted,
    accept: allowedFileTypes
  });

  return (
    <>
      {/* this is required for react-dropzone to work in Safari and Firefox */}
      <input data-testid={inputTestId} {...getInputProps()} hidden />
      <Tooltip
        id="pf-chatbot__tooltip--attach"
        content={tooltipContent}
        position="top"
        entryDelay={tooltipProps?.entryDelay || 0}
        exitDelay={tooltipProps?.exitDelay || 0}
        distance={tooltipProps?.distance || 8}
        animationDuration={tooltipProps?.animationDuration || 0}
        // prevents VO announcements of both aria label and tooltip
        aria="none"
        {...tooltipProps}
      >
        <Button
          variant="plain"
          ref={innerRef}
          className={`pf-chatbot__button--attach ${isCompact ? 'pf-m-compact' : ''} ${className ?? ''}`}
          aria-label={props['aria-label'] || 'Attach'}
          isDisabled={isDisabled}
          onClick={onClick ?? open}
          icon={
            <Icon iconSize={isCompact ? 'lg' : 'xl'} isInline>
              <PaperclipIcon />
            </Icon>
          }
          size={isCompact ? 'sm' : undefined}
          {...props}
        />
      </Tooltip>
    </>
  );
};

export const AttachButton = forwardRef((props: AttachButtonProps, ref: Ref<any>) => (
  <AttachButtonBase innerRef={ref} {...props} />
));
