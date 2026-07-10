// ============================================================================
// Chatbot Main - Message - Content - Table
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { Th, ThProps } from '@patternfly/react-table';
import TableCellContent from './TableCellContent';

const ThMessage = ({ children, ...props }: Omit<ThProps, 'ref'> & ExtraProps) => (
  <Th {...props}>
    <TableCellContent>{children}</TableCellContent>
  </Th>
);

export default ThMessage;
