// ============================================================================
// Chatbot Main - Message - Content - Table cell wrapper
// ============================================================================

/**
 * Wraps table cell content in a single element so phrasing content (e.g. inline
 * code mixed with text) is not a direct child of td/th.
 */
const TableCellContent = ({ children }: { children?: React.ReactNode }) => (
  <span className="pf-chatbot__message-table-cell-content">{children}</span>
);

export default TableCellContent;
