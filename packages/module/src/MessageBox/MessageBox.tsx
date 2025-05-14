// ============================================================================
// Chatbot Main - Messages
// ============================================================================

import {
  HTMLProps,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
  ReactNode,
  TouchEventHandler,
  TouchEvent,
  WheelEvent,
  WheelEventHandler
} from 'react';
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
  /** @deprecated innerRef has been deprecated. Use ref instead. Ref applied to message box  */
  innerRef?: React.Ref<HTMLDivElement>;
  /** Modifier that controls how content in MessageBox is positioned within the container */
  position?: 'top' | 'bottom';
  /** Click handler for additional logic for when scroll to top jump button is clicked */
  onScrollToTopClick?: () => void;
  /** Click handler for additional logic for when scroll to bottom jump button is clicked */
  onScrollToBottomClick?: () => void;
  /** Flag to enable automatic scrolling when new messages are added */
  enableSmartScroll?: boolean;
}

export interface MessageBoxHandle extends HTMLDivElement {
  /** Scrolls to the top of the message box */
  scrollToTop: (options?: ScrollOptions) => void;
  /** Scrolls to the bottom of the message box */
  scrollToBottom: (options?: { resumeSmartScroll?: boolean } & ScrollOptions) => void;
  /** Returns whether the smart scroll feature is currently active */
  isSmartScrollActive: () => boolean;
}

export const MessageBox = forwardRef(
  (
    {
      announcement,
      ariaLabel = 'Scrollable message log',
      children,
      className,
      position = 'top',
      onScrollToTopClick,
      onScrollToBottomClick,
      enableSmartScroll = false,
      ...props
    }: MessageBoxProps,
    ref: ForwardedRef<MessageBoxHandle | null>
  ) => {
    const [atTop, setAtTop] = useState(false);
    const [atBottom, setAtBottom] = useState(true);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const lastScrollTop = useRef(0);
    const animationFrame = useRef<any>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const pauseAutoScrollRef = useRef(false);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const scrollQueued = useRef(false);
    const resetUserScrollIntentTimeout = useRef<NodeJS.Timeout>();

    // Configure handlers
    const handleScroll = useCallback(() => {
      const element = messageBoxRef.current;
      if (!element) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = element;

      const roundedScrollTop = Math.round(scrollTop);
      const roundedClientHeight = Math.round(clientHeight);
      const roundedScrollHeight = Math.round(scrollHeight);

      const distanceFromBottom = roundedScrollHeight - roundedScrollTop - roundedClientHeight;
      const isScrollingDown = roundedScrollTop > lastScrollTop.current;

      const DELTA_UP = 10;
      const DELTA_DOWN = 50;
      const DEBOUNCE_DELAY = 200;

      const delta = isScrollingDown ? DELTA_DOWN : DELTA_UP;
      const isAtBottom = distanceFromBottom <= delta;

      setAtTop(roundedScrollTop === 0);
      setAtBottom(roundedScrollTop + roundedClientHeight >= roundedScrollHeight - 1); // rounding means it could be within a pixel of the bottom

      if (!enableSmartScroll || scrollQueued.current) {
        return;
      }

      if (roundedScrollTop === 0) {
        pauseAutoScrollRef.current = false;
      }

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (!isAtBottom && !pauseAutoScrollRef.current) {
        setAutoScroll(false);
      }

      // User is near bottom and scrolling down - debounce re-enabling auto-scroll
      if (isAtBottom && isScrollingDown && !pauseAutoScrollRef.current) {
        debounceTimeout.current = setTimeout(() => {
          setAutoScroll(true);
        }, DEBOUNCE_DELAY);
      }

      lastScrollTop.current = roundedScrollTop;
    }, [messageBoxRef]);

    const checkOverflow = useCallback(() => {
      const element = messageBoxRef.current;
      if (element) {
        const { scrollHeight, clientHeight } = element;
        setIsOverflowing(scrollHeight >= clientHeight);
      }
    }, [messageBoxRef]);

    const resumeAutoScroll = useCallback(() => {
      if (!enableSmartScroll) {
        return;
      }
      pauseAutoScrollRef.current = false;
      setAutoScroll(true);
    }, [enableSmartScroll]);

    const pauseAutoScroll = useCallback(() => {
      if (!enableSmartScroll) {
        return;
      }
      pauseAutoScrollRef.current = true;
      setAutoScroll(false);
    }, [enableSmartScroll]);
    /**
     * Scrolls to the top of the message box.
     *
     */
    const scrollToTop = useCallback(
      (options?: ScrollOptions) => {
        const { behavior = 'smooth' } = options || {};

        const element = messageBoxRef.current;

        if (!element || scrollQueued.current) {
          return;
        }

        scrollQueued.current = true;
        pauseAutoScroll();

        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }

        animationFrame.current = requestAnimationFrame(() => {
          element.scrollTo({ top: 0, behavior });
          scrollQueued.current = false;
        });
        onScrollToTopClick && onScrollToTopClick();
      },
      [messageBoxRef]
    );

    /**
     * Scrolls to the bottom of the message box.
     *
     * @param options.resumeSmartScroll - If true, resumes smart scroll behavior;
     *                                    if false or omitted, scrolls without resuming auto-scroll.
     * @param options.scrollOptions - Additional scroll options. behavior can be 'smooth' or 'auto'.
     */
    const scrollToBottom = useCallback(
      (options?: { resumeSmartScroll?: boolean } & ScrollOptions) => {
        const { behavior = 'smooth', resumeSmartScroll = false } = options || {};
        resumeSmartScroll && resumeAutoScroll();

        const element = messageBoxRef.current;
        if (!element || pauseAutoScrollRef.current || scrollQueued.current) {
          return;
        }

        scrollQueued.current = true;

        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }

        animationFrame.current = requestAnimationFrame(() => {
          element.scrollTo({ top: element.scrollHeight, behavior });
          resumeAutoScroll();
          scrollQueued.current = false;
        });
        onScrollToBottomClick && onScrollToBottomClick();
      },
      [messageBoxRef, enableSmartScroll]
    );

    // Detect scroll position
    useEffect(() => {
      const element = messageBoxRef.current;
      if (!element) {
        return;
      }

      // Listen for scroll events
      element.addEventListener('scroll', handleScroll);

      // Check initial position and overflow
      handleScroll();
      checkOverflow();

      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }, [checkOverflow, handleScroll, messageBoxRef]);

    useImperativeHandle(ref, (): MessageBoxHandle => {
      const node = messageBoxRef.current! as MessageBoxHandle;

      // Attach custom methods to the element
      node.scrollToTop = scrollToTop;
      node.scrollToBottom = scrollToBottom;
      node.isSmartScrollActive = () => enableSmartScroll && autoScroll;

      return node;
    });

    let lastTouchY: number | null = null;

    const onTouchEnd: TouchEventHandler<HTMLDivElement> = (event: TouchEvent<HTMLDivElement>) => {
      lastTouchY = null;
      props.onTouchEnd && props.onTouchEnd(event);
    };

    const handleUserScroll = (isScrollingDown: boolean) => {
      const container = messageBoxRef.current;
      if (!enableSmartScroll || !container) {
        return;
      }

      if (!isScrollingDown) {
        pauseAutoScrollRef.current = true;
        clearTimeout(resetUserScrollIntentTimeout.current);
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < 100) {
        pauseAutoScrollRef.current = false;
        setAutoScroll(true);
      }
    };

    const onWheel = (event: WheelEvent<HTMLDivElement>) => {
      const isScrollingDown = event.deltaY > 0;
      handleUserScroll(isScrollingDown);
      props.onWheel && props.onWheel(event);
    };

    const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
      const currentTouchY = event.touches[0].clientY;
      let isScrollingDown = false;

      if (lastTouchY !== null) {
        isScrollingDown = currentTouchY < lastTouchY;
      }

      lastTouchY = currentTouchY;

      handleUserScroll(isScrollingDown);
      props.onTouchMove && props.onTouchMove(event);
    };

    const smartScrollHandlers: {
      onWheel: WheelEventHandler<HTMLDivElement>;
      onTouchMove: TouchEventHandler<HTMLDivElement>;
      onTouchEnd: TouchEventHandler<HTMLDivElement>;
    } = {
      onWheel,
      onTouchMove,
      onTouchEnd
    };

    return (
      <>
        <JumpButton position="top" isHidden={isOverflowing && atTop} onClick={scrollToTop} />
        <div
          role="region"
          tabIndex={0}
          aria-label={ariaLabel}
          className={`pf-chatbot__messagebox ${position === 'bottom' && 'pf-chatbot__messagebox--bottom'} ${className ?? ''}`}
          ref={messageBoxRef}
          {...props}
          {...(enableSmartScroll ? { ...smartScrollHandlers } : {})}
        >
          {children}
          <div className="pf-chatbot__messagebox-announcement" aria-live="polite">
            {announcement}
          </div>
        </div>
        <JumpButton
          position="bottom"
          isHidden={isOverflowing && atBottom}
          onClick={() => scrollToBottom({ resumeSmartScroll: true })}
        />
      </>
    );
  }
);

export default MessageBox;
