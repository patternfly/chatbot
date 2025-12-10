// ============================================================================
// Chatbot Main - Message - Processing
// ============================================================================

import { FunctionComponent } from 'react';
import type { HTMLProps } from 'react';
import { css } from '@patternfly/react-styles';

/**
 * MessageLoading displays a loading animation for messages.
 * Use this component when passing children to Message to show a loading state.
 */
export interface MessageLoadingProps extends HTMLProps<HTMLDivElement> {
  /** Text announced to screen readers during loading. */
  loadingWord?: string;
  /** Flag indicating whether primary styling is applied */
  isPrimary?: boolean;
}

export const MessageLoading: FunctionComponent<MessageLoadingProps> = ({ loadingWord, isPrimary, ...props }) => (
  <div className={css('pf-chatbot__message-loading', isPrimary && 'pf-m-primary')} {...props}>
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">{loadingWord}</span>
    </span>
  </div>
);

export default MessageLoading;
