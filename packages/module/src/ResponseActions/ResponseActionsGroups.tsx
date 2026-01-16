// ============================================================================
// Response Actions Groups - Container for multiple action groups
// ============================================================================
import { FunctionComponent, HTMLProps, ReactNode } from 'react';
import { css } from '@patternfly/react-styles';

/**
 * The container for grouping multiple related ResponseActions components, typically used for having different persistence states amongst groups.
 * Use this component when passing children to Message to customize its structure.
 */
export interface ResponseActionsGroupsProps extends HTMLProps<HTMLDivElement> {
  /** Content to render inside the response actions groups container */
  children: ReactNode;
  /** Additional classes applied to the response actions groups container. */
  className?: string;
}

export const ResponseActionsGroups: FunctionComponent<ResponseActionsGroupsProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={css('pf-chatbot__response-actions-groups', className)} {...props}>
    {children}
  </div>
);

export default ResponseActionsGroups;
