// ============================================================================
// Chatbot Main - Message - Content - Table
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { Td, TdProps } from '@patternfly/react-table';
import TableCellContent from './TableCellContent';

const TdMessage = ({ children, ...props }: Omit<TdProps, 'ref'> & ExtraProps) => (
  <Td {...props}>
    <TableCellContent>{children}</TableCellContent>
  </Td>
);

export default TdMessage;
