// ============================================================================
// Chatbot Main - Messages
// ============================================================================
import type { HTMLProps, ReactNode, Ref, FunctionComponent } from 'react';

import { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import JumpButton from './JumpButton';

export interface MessageBoxProps extends HTMLProps<HTMLDivElement> {
  /** Content that can be announced, such as a new message, for screen readers */
  announcement?: string;
  /** Custom aria-label for scrollable portion of message box */
  ariaLabel?: string;
  /** Content to be displayed in the message box */
  children: ReactNode;
  /** Custom classname for the MessageBox component */
  className?: string;
  /** Ref applied to message box */
  innerRef?: Ref<HTMLDivElement>;
  /** Modifier that controls how content in MessageBox is positioned within the container */
  position?: 'top' | 'bottom';
  /** Click handler for additional logic for when scroll to top jump button is clicked */
  onScrollToTopClick?: () => void;
  /** Click handler for additional logic for when scroll to bottom jump button is clicked */
  onScrollToBottomClick?: () => void;
}

const MessageBoxBase: FunctionComponent<MessageBoxProps> = ({
  announcement,
  ariaLabel = 'Scrollable message log',
  children,
  innerRef,
  className,
  position = 'top',
  onScrollToTopClick,
  onScrollToBottomClick,
  ...props
}: MessageBoxProps) => {
  const [atTop, setAtTop] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const defaultRef = useRef<HTMLDivElement>(null);
  let messageBoxRef;
  if (innerRef) {
    messageBoxRef = innerRef;
  } else {
    messageBoxRef = defaultRef;
  }

  // Configure handlers
  const handleScroll = useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      setAtTop(scrollTop === 0);
      setAtBottom(Math.round(scrollTop) + Math.round(clientHeight) >= Math.round(scrollHeight) - 1); // rounding means it could be within a pixel of the bottom
    }
  }, [messageBoxRef]);

  const checkOverflow = useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      const { scrollHeight, clientHeight } = element;
      setIsOverflowing(scrollHeight >= clientHeight);
    }
  }, [messageBoxRef]);

  const scrollToTop = useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      element.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onScrollToTopClick && onScrollToTopClick();
  }, [messageBoxRef]);

  const scrollToBottom = useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }
    onScrollToBottomClick && onScrollToBottomClick();
  }, [messageBoxRef]);

  // Detect scroll position
  useEffect(() => {
    const element = messageBoxRef.current;
    if (element) {
      // Listen for scroll events
      element.addEventListener('scroll', handleScroll);

      // Check initial position and overflow
      handleScroll();
      checkOverflow();

      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [checkOverflow, handleScroll, messageBoxRef]);

  return (
    <>
      <JumpButton position="top" isHidden={isOverflowing && atTop} onClick={scrollToTop} />
      <div
        role="region"
        tabIndex={0}
        aria-label={ariaLabel}
        className={`pf-chatbot__messagebox ${position === 'bottom' && 'pf-chatbot__messagebox--bottom'} ${className ?? ''}`}
        ref={innerRef ?? messageBoxRef}
        {...props}
      >
        {children}
        <div className="pf-chatbot__messagebox-announcement" aria-live="polite">
          {announcement}
        </div>
      </div>
      <JumpButton position="bottom" isHidden={isOverflowing && atBottom} onClick={scrollToBottom} />
    </>
  );
};

export const MessageBox = forwardRef((props: MessageBoxProps, ref: Ref<any>) => (
  <MessageBoxBase innerRef={ref} {...props} />
));

export default MessageBox;
