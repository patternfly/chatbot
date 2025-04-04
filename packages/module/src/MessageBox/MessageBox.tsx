// ============================================================================
// Chatbot Main - Messages
// ============================================================================
import React from 'react';
import JumpButton from './JumpButton';

export interface MessageBoxProps extends React.HTMLProps<HTMLDivElement> {
  /** Content that can be announced, such as a new message, for screen readers */
  announcement?: string;
  /** Custom aria-label for scrollable portion of message box */
  ariaLabel?: string;
  /** Content to be displayed in the message box */
  children: React.ReactNode;
  /** Custom classname for the MessageBox component */
  className?: string;
  /** Ref applied to message box */
  innerRef?: React.Ref<HTMLDivElement>;
  /** Modifier that controls how content in MessageBox is positioned within the container */
  position?: 'top' | 'bottom';
}

const MessageBoxBase: React.FunctionComponent<MessageBoxProps> = ({
  announcement,
  ariaLabel = 'Scrollable message log',
  children,
  innerRef,
  className,
  position = 'top'
}: MessageBoxProps) => {
  const [atTop, setAtTop] = React.useState(false);
  const [atBottom, setAtBottom] = React.useState(true);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const defaultRef = React.useRef<HTMLDivElement>(null);
  let messageBoxRef;
  if (innerRef) {
    messageBoxRef = innerRef;
  } else {
    messageBoxRef = defaultRef;
  }

  // Configure handlers
  const handleScroll = React.useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      setAtTop(scrollTop === 0);
      setAtBottom(Math.round(scrollTop) + Math.round(clientHeight) >= Math.round(scrollHeight) - 1); // rounding means it could be within a pixel of the bottom
    }
  }, [messageBoxRef]);

  const checkOverflow = React.useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      const { scrollHeight, clientHeight } = element;
      setIsOverflowing(scrollHeight >= clientHeight);
    }
  }, [messageBoxRef]);

  const scrollToTop = React.useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      element.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messageBoxRef]);

  const scrollToBottom = React.useCallback(() => {
    const element = messageBoxRef.current;
    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }
  }, [messageBoxRef]);

  // Detect scroll position
  React.useEffect(() => {
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

export const MessageBox = React.forwardRef((props: MessageBoxProps, ref: React.Ref<any>) => (
  <MessageBoxBase innerRef={ref} {...props} />
));

export default MessageBox;
