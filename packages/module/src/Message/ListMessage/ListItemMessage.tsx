// ============================================================================
// Chatbot Main - Message - Content - List
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { ListItem } from '@patternfly/react-core';

const ListItemMessage = ({ children, ...props }: JSX.IntrinsicElements['li'] & ExtraProps) => (
  <ListItem {...props}>{children}</ListItem>
);

export default ListItemMessage;
