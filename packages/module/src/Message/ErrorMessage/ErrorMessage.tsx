// ============================================================================
// Chatbot Main - Message - Content - Error
// ============================================================================

import { Alert, AlertProps } from '@patternfly/react-core';

/**
 * ErrorMessage displays an inline danger alert for error states in messages.
 * Use this component when passing children to Message to display error information.
 */
export interface ErrorMessageProps extends Partial<AlertProps> {
  /** Content to display in the error alert body */
  children?: React.ReactNode;
  /** Additional classes for the error alert */
  className?: string;
  /** Title of the error alert */
  title?: React.ReactNode;
  /** Action links to display in the alert footer */
  actionLinks?: React.ReactNode;
}

export const ErrorMessage = ({ title, actionLinks, children, className, ...props }: ErrorMessageProps) => (
  <Alert isInline variant="danger" title={title} actionLinks={actionLinks} className={className} {...props}>
    {children}
  </Alert>
);

export default ErrorMessage;
