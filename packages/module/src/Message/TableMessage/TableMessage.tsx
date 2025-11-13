// ============================================================================
// Chatbot Main - Message - Content - Table
// ============================================================================

import { Children, cloneElement } from 'react';
import { ExtraProps } from 'react-markdown';
import { Table, TableProps } from '@patternfly/react-table';
import { css } from '@patternfly/react-styles';

interface Properties {
  line: number;
  column: number;
  offset: number;
}
export interface TableNode {
  children?: TableNode[];
  value?: string;
  position: { start: Properties; end: Properties };
  tagName: string;
  type: string;
}

export interface TableMessageProps {
  /** Content of the table */
  children?: React.ReactNode;
  /** Flag indicating whether primary styles should be applied. */
  isPrimary?: boolean;
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const TableMessage = ({
  children,
  isPrimary,
  shouldRetainStyles,
  ...props
}: Omit<TableProps, 'ref'> & ExtraProps & TableMessageProps) => {
  const { className, ...rest } = props;

  // This allows us to parse the nested data we get back from the 3rd party Markdown parser
  // Open to feedback here if there is a better way to do this
  // This looks for ths and spits them all out so we can filter them later, looking for text values
  const findHeaders = (array?: TableNode[]) => {
    const headers: TableNode[] = [];
    if (!array) {
      return headers;
    }
    const traverse = (items: TableNode[]) => {
      for (const item of items) {
        if (item.tagName === 'th') {
          headers.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };

    traverse(array);
    return headers;
  };

  const headers = findHeaders(rest.node?.children as TableNode[] | undefined);
  const headerTextValues = headers.map((header) => header?.children?.filter((c) => c?.type === 'text')[0]?.value);

  // We are sending these header text values down to child tds by passing them through children, since mobile view for tables expects a dataLabel prop
  // The data structure does not otherwise know this information at that level
  // This is somewhat opinionated and may break if 3rd party library changes
  // See Tr and Tbody for other usage
  const modifyChildren = (children) =>
    Children.map(children, (child) => {
      if (child && headerTextValues?.length > 0) {
        return cloneElement(child, { extraHeaders: headerTextValues });
      }
      return child;
    });

  if (!props['aria-label']) {
    // eslint-disable-next-line no-console
    console.warn(
      'For accessibility reasons an aria-label should be specified for the Table via the <Message /> tableProps prop'
    );
  }

  return (
    // gridBreakPoint is so we show mobile-styled-PF table
    <Table
      aria-label={props['aria-label']}
      gridBreakPoint="grid"
      className={css(
        'pf-chatbot__message-table',
        isPrimary && 'pf-m-primary',
        shouldRetainStyles && 'pf-m-markdown',
        className
      )}
      {...rest}
    >
      {modifyChildren(children)}
    </Table>
  );
};

export default TableMessage;
