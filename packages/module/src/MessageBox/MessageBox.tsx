// ============================================================================
// Chatbot Main - Messages
// ============================================================================

import {
  HTMLProps,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
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
import { ButtonProps, getResizeObserver, TooltipProps } from '@patternfly/react-core';

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
  /** Props passed to top jump button */
  jumpButtonTopProps?: ButtonProps;
  /** Props passed to bottom jump button */
  jumpButtonBottomProps?: ButtonProps;
  /** Props passed to top jump button tooltip */
  jumpButtonTopTooltipProps?: TooltipProps;
  /** Props passed to top jump button tooltip */
  jumpButtonBottomTooltipProps?: TooltipProps;
}

export interface MessageBoxHandle extends HTMLDivElement {
  /** Scrolls to the top of the message box */
  scrollToTop: (options?: ScrollOptions) => void;
  /** Scrolls to the bottom of the message box */
  scrollToBottom: (options?: { resumeSmartScroll?: boolean } & ScrollOptions) => void;
  /** Returns whether the smart scroll feature is currently active */
  isSmartScrollActive: () => boolean;
}

const SCROLL_EDGE_DELTA = 100;

const getScrollMetrics = (element: HTMLDivElement) => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const roundedScrollTop = Math.round(scrollTop);
  const roundedClientHeight = Math.round(clientHeight);
  const roundedScrollHeight = Math.round(scrollHeight);
  const distanceFromBottom = roundedScrollHeight - roundedScrollTop - roundedClientHeight;

  return {
    roundedScrollTop,
    roundedClientHeight,
    roundedScrollHeight,
    distanceFromBottom,
    atTop: roundedScrollTop === 0,
    nearBottom: distanceFromBottom <= SCROLL_EDGE_DELTA,
    isOverflowing: roundedScrollHeight >= roundedClientHeight
  };
};

const isAtBottomEdge = (
  metrics: ReturnType<typeof getScrollMetrics>,
  enableSmartScroll: boolean,
  autoScroll: boolean,
  pauseAutoScroll: boolean,
  programmaticScroll = false
) =>
  metrics.nearBottom ||
  programmaticScroll ||
  (enableSmartScroll && autoScroll && !pauseAutoScroll && metrics.roundedScrollTop > 0);

const shouldFollowContentGrowth = (
  metrics: ReturnType<typeof getScrollMetrics>,
  enableSmartScroll: boolean,
  autoScroll: boolean,
  pauseAutoScroll: boolean,
  programmaticScroll: boolean
) =>
  programmaticScroll ||
  metrics.nearBottom ||
  (enableSmartScroll && autoScroll && !pauseAutoScroll && metrics.roundedScrollTop > 0);

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
      jumpButtonTopProps,
      jumpButtonBottomProps,
      jumpButtonBottomTooltipProps,
      jumpButtonTopTooltipProps,
      ...props
    }: MessageBoxProps,
    ref: ForwardedRef<MessageBoxHandle | null>
  ) => {
    const [atTop, setAtTop] = useState(true);
    const [atBottom, setAtBottom] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hasMeasuredScroll, setHasMeasuredScroll] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const autoScrollRef = useRef(autoScroll);
    const lastScrollTop = useRef(0);
    const animationFrame = useRef<any>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const pauseAutoScrollRef = useRef(false);
    const programmaticScrollRef = useRef(false);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const scrollQueued = useRef(false);
    const resetUserScrollIntentTimeout = useRef<NodeJS.Timeout>();

    autoScrollRef.current = autoScroll;

    // Configure handlers
    const handleScroll = useCallback(() => {
      const element = messageBoxRef.current;
      if (!element) {
        return;
      }

      const metrics = getScrollMetrics(element);
      const { roundedScrollTop, distanceFromBottom } = metrics;
      const isScrollingDown = roundedScrollTop > lastScrollTop.current;

      const DELTA_UP = 10;
      const DELTA_DOWN = 50;
      const DEBOUNCE_DELAY = 200;

      const delta = isScrollingDown ? DELTA_DOWN : DELTA_UP;
      const isAtBottom = distanceFromBottom <= delta;

      setAtTop(metrics.atTop);
      setAtBottom(
        isAtBottomEdge(
          metrics,
          enableSmartScroll,
          autoScrollRef.current,
          pauseAutoScrollRef.current,
          programmaticScrollRef.current
        )
      );
      setIsOverflowing(metrics.isOverflowing);

      if (isAtBottom) {
        programmaticScrollRef.current = false;
      }

      if (!enableSmartScroll || scrollQueued.current) {
        return;
      }

      if (metrics.roundedScrollTop === 0) {
        pauseAutoScrollRef.current = false;
      }

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (!isAtBottom && !metrics.nearBottom && !pauseAutoScrollRef.current && !programmaticScrollRef.current) {
        setAutoScroll(false);
      }

      // User is near bottom and scrolling down - debounce re-enabling auto-scroll
      if (isAtBottom && isScrollingDown && !pauseAutoScrollRef.current) {
        debounceTimeout.current = setTimeout(() => {
          setAutoScroll(true);
        }, DEBOUNCE_DELAY);
      }

      lastScrollTop.current = roundedScrollTop;
    }, [enableSmartScroll]);

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
        programmaticScrollRef.current = true;

        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }

        animationFrame.current = requestAnimationFrame(() => {
          element.scrollTo({ top: element.scrollHeight, behavior });
          resumeAutoScroll();
          scrollQueued.current = false;
          if (behavior === 'auto') {
            programmaticScrollRef.current = false;
            lastScrollTop.current = element.scrollTop;
          }
        });
        onScrollToBottomClick && onScrollToBottomClick();
      },
      [messageBoxRef, enableSmartScroll]
    );

    const measureJumpButtonState = useCallback(() => {
      const element = messageBoxRef.current;
      if (!element) {
        return;
      }

      const metrics = getScrollMetrics(element);

      setAtTop(metrics.atTop);
      setAtBottom(
        isAtBottomEdge(
          metrics,
          enableSmartScroll,
          autoScrollRef.current,
          pauseAutoScrollRef.current,
          programmaticScrollRef.current
        )
      );
      setIsOverflowing(metrics.isOverflowing);
      setHasMeasuredScroll(true);
    }, [enableSmartScroll]);

    const handleContentResize = useCallback(() => {
      const element = messageBoxRef.current;
      if (element) {
        const metrics = getScrollMetrics(element);
        const shouldFollow = shouldFollowContentGrowth(
          metrics,
          enableSmartScroll,
          autoScrollRef.current,
          pauseAutoScrollRef.current,
          programmaticScrollRef.current
        );

        if (shouldFollow && !scrollQueued.current) {
          programmaticScrollRef.current = true;
          element.scrollTop = element.scrollHeight - element.clientHeight;
          lastScrollTop.current = element.scrollTop;
        }
      }

      measureJumpButtonState();
    }, [enableSmartScroll, measureJumpButtonState]);

    // Detect scroll position before paint to avoid jump button flash on mount
    useLayoutEffect(() => {
      const element = messageBoxRef.current;
      if (!element) {
        return;
      }

      measureJumpButtonState();

      element.addEventListener('scroll', handleScroll);

      const resizeObserver = getResizeObserver(element, handleContentResize);

      return () => {
        element.removeEventListener('scroll', handleScroll);
        resizeObserver();
      };
    }, [handleContentResize, handleScroll, measureJumpButtonState]);

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
        programmaticScrollRef.current = false;
        clearTimeout(resetUserScrollIntentTimeout.current);
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < SCROLL_EDGE_DELTA) {
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
        <JumpButton
          position="top"
          isHidden={!hasMeasuredScroll || (isOverflowing && atTop)}
          onClick={scrollToTop}
          jumpButtonProps={jumpButtonTopProps}
          jumpButtonTooltipProps={jumpButtonTopTooltipProps}
        />
        <JumpButton
          position="bottom"
          isHidden={!hasMeasuredScroll || (isOverflowing && atBottom)}
          onClick={() => scrollToBottom({ resumeSmartScroll: true })}
          jumpButtonProps={jumpButtonBottomProps}
          jumpButtonTooltipProps={jumpButtonBottomTooltipProps}
        />
        <div
          role="region"
          tabIndex={0}
          aria-label={ariaLabel}
          className={`pf-chatbot__messagebox ${position === 'bottom' ? 'pf-chatbot__messagebox--bottom' : ''} ${className ?? ''}`}
          ref={messageBoxRef}
          {...props}
          {...(enableSmartScroll ? { ...smartScrollHandlers } : {})}
        >
          {children}
          <div className="pf-chatbot__messagebox-announcement pf-chatbot-m-hidden" aria-live="polite">
            {announcement}
          </div>
        </div>
      </>
    );
  }
);

export default MessageBox;
