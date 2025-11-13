// ============================================================================
// Chatbot Main - Message - Content - Text
// ============================================================================

import { ExtraProps } from 'react-markdown';
import { Content, ContentProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

export interface TextMessageProps {
  /** The text message content */
  children?: React.ReactNode;
  /** Flag indicating whether primary styling is applied. */
  isPrimary?: boolean;
  /** The wrapper component to use for the PatternFly Content component. Defaults to a div. */
  component?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'a'
    | 'small'
    | 'blockquote'
    | 'pre'
    | 'hr'
    | 'ul'
    | 'ol'
    | 'dl'
    | 'li'
    | 'dt'
    | 'dd';
  /** Flag indicating that the content should retain message styles when using Markdown. */
  shouldRetainStyles?: boolean;
}

const TextMessage = ({
  component,
  children,
  isPrimary,
  shouldRetainStyles,
  ...props
}: Omit<ContentProps, 'ref'> & ExtraProps & TextMessageProps) => (
  <span className={css('pf-chatbot__message-text', isPrimary && 'pf-m-primary')}>
    <Content component={component} {...props} className={css(shouldRetainStyles && 'pf-m-markdown', props?.className)}>
      {children}
    </Content>
  </span>
);

export default TextMessage;
