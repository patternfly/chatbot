// ============================================================================
// Chatbot Main - Message - Content - Link
// ============================================================================

import React from 'react';
import { ExtraProps } from 'react-markdown';
import { Button, ButtonProps } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';

const LinkMessage = ({ children, ...props }: JSX.IntrinsicElements['a'] & ExtraProps) => {
  if (props.target === '_blank') {
    return (
      <Button
        component="a"
        variant="link"
        icon={<ExternalLinkSquareAltIcon />}
        iconPosition="end"
        isInline
        {...(props as ButtonProps)}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button isInline component="a" variant="link" {...(props as ButtonProps)}>
      {children}
    </Button>
  );
};

export default LinkMessage;
