// ============================================================================
// Chatbot Main - Message - Content - List
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { List } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
export interface UnrderedListMessageProps {
  /** The ordered list content */
  children?: React.ReactNode;
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const UnorderedListMessage = ({
  children,
  shouldRetainStyles
}: UnrderedListMessageProps & JSX.IntrinsicElements['ul'] & ExtraProps) => (
  <div className={css('pf-chatbot__message-unordered-list', shouldRetainStyles && 'pf-m-markdown')}>
    <List>{children}</List>
  </div>
);

export default UnorderedListMessage;
