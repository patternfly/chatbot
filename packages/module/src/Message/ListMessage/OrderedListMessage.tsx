// ============================================================================
// Chatbot Main - Message - Content - List
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { List, ListComponent, OrderType } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

export interface OrderedListMessageProps {
  /** The ordered list content */
  children?: React.ReactNode;
  /** The number to start the ordered list at. */
  start?: number;
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const OrderedListMessage = ({
  children,
  start,
  shouldRetainStyles
}: OrderedListMessageProps & JSX.IntrinsicElements['ol'] & ExtraProps) => (
  <div className={css('pf-chatbot__message-ordered-list', shouldRetainStyles && 'pf-m-markdown')}>
    <List component={ListComponent.ol} type={OrderType.number} start={start}>
      {children}
    </List>
  </div>
);

export default OrderedListMessage;
