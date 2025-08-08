// ============================================================================
// Chatbot Main - Message - Content - Link
// ============================================================================

import { Button, ButtonProps } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import { ExtraProps } from 'react-markdown';

export interface LinkMessageProps extends ButtonProps, ExtraProps {;
  /** Anchor href attribute */
  href?: string;
  /** Anchor target attribute */
  target?: string;
  /** Anchor id attribute */
  id?: string;
}

const LinkMessage = ({
  children,
  target,
  href,
  id,
  onClick,
  ...props
}: LinkMessageProps) => {
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
        id={id}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button isInline component="a" href={href} variant="link" id={id} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default LinkMessage;
