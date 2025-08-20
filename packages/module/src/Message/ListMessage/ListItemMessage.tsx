// ============================================================================
// Chatbot Main - Message - Content - List
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { ListItem } from '@patternfly/react-core';

const ListItemMessage = ({ children, ...props }: JSX.IntrinsicElements['li'] & ExtraProps) => (
  <ListItem {...props} tabIndex={props?.id?.includes('fn-') ? -1 : props?.tabIndex}>
    {children}
  </ListItem>
);

export default ListItemMessage;
