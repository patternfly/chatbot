// ============================================================================
// Chatbot Main - Message - Content - Link
// ============================================================================

import { Button, ButtonProps } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { ExtraProps } from 'react-markdown';
import { css } from '@patternfly/react-styles';

export interface LinkMessageProps {
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const LinkMessage = ({
  children,
  target,
  href,
  id,
  shouldRetainStyles,
  ...props
}: LinkMessageProps & ButtonProps & ExtraProps) => {
  if (target === '_blank') {
    return (
      <Button
        component="a"
        variant="link"
        href={href}
        icon={<ExternalLinkSquareAltIcon />}
        iconPosition="end"
        isInline
        target={target}
        // need to explicitly call this out or id doesn't seem to get passed - required for footnotes
        id={id}
        {...props}
        className={css(shouldRetainStyles && 'pf-m-markdown', props?.className)}
      >
        {children}
      </Button>
    );
  }

  return (
    // need to explicitly call this out or id doesn't seem to get passed - required for footnotes
    <Button
      isInline
      component="a"
      href={href}
      variant="link"
      id={id}
      {...props}
      className={css(shouldRetainStyles && 'pf-m-markdown', props?.className)}
    >
      {children}
    </Button>
  );
};

export default LinkMessage;
