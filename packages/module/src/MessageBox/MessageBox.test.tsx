import { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MessageBox, MessageBoxHandle } from './MessageBox';
import userEvent from '@testing-library/user-event';

describe('MessageBox', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0); // Immediately call the callback
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render Message box', () => {
    render(
      <MessageBox>
        <>Chatbot Messages</>
      </MessageBox>
    );
    expect(screen.getByText('Chatbot Messages')).toBeTruthy();
  });

  it('should assign ref to Message box', () => {
    const ref = createRef<MessageBoxHandle>();
    render(
      <MessageBox data-testid="message-box" ref={ref}>
        <div>Test message content</div>
      </MessageBox>
    );

    screen.getByText('Test message content');

    expect(ref.current).not.toBeNull();
    // should contain custom methods exposed by the ref
    expect(typeof ref.current?.isSmartScrollActive).toBe('function');
    expect(typeof ref.current?.scrollToTop).toBe('function');
    expect(typeof ref.current?.scrollToBottom).toBe('function');
    expect(ref.current?.isSmartScrollActive()).toBe(false);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
  it('should call onScrollToBottomClick when scroll to bottom button is clicked', async () => {
    const spy = jest.fn();
    render(
      <MessageBox onScrollToBottomClick={spy}>
        <div>Test message content</div>
      </MessageBox>
    );

    // this forces button to show
    const region = screen.getByRole('region');
    Object.defineProperty(region, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(region, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(region, 'scrollTop', { configurable: true, value: 0 });
    act(() => {
      region.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /Jump bottom/i }));
      expect(spy).toHaveBeenCalled();
    });
  });
  it('should call onScrollToTopClick when scroll to top button is clicked', async () => {
    const spy = jest.fn();
    render(
      <MessageBox onScrollToTopClick={spy}>
        <div>Test message content</div>
      </MessageBox>
    );

    // this forces button to show
    const region = screen.getByRole('region');
    Object.defineProperty(region, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(region, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(region, 'scrollTop', {
      configurable: true,
      value: 500
    });
    act(() => {
      region.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /Jump top/i }));
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should call user defined onWheel, onTouchMove and onTouchEnd handlers', async () => {
    const ref = createRef<MessageBoxHandle>();
    const onWheel = jest.fn();
    const onTouchMove = jest.fn();
    const onTouchEnd = jest.fn();

    render(
      <MessageBox ref={ref} enableSmartScroll onWheel={onWheel} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div>Test message content</div>
      </MessageBox>
    );

    const element = ref.current!;
    act(() => {
      fireEvent.wheel(element, { deltaY: 10 });
      fireEvent.touchMove(element, { touches: [{ clientY: 700 }] });
      fireEvent.touchEnd(element);
    });

    expect(onWheel).toHaveBeenCalled();
    expect(onTouchMove).toHaveBeenCalled();
    expect(onTouchEnd).toHaveBeenCalled();
  });

  it('should scroll to the bottom when the method is called ', async () => {
    const ref = createRef<MessageBoxHandle>();

    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );
    const element = ref.current!;
    const scrollSpy = jest.spyOn(element, 'scrollTo');

    act(() => {
      ref.current?.scrollToBottom();
      ref.current?.scrollToBottom();
      ref.current?.scrollToBottom();
    });

    expect(scrollSpy).toHaveBeenCalledWith({ top: element.scrollHeight, behavior: 'smooth' });
    expect(ref.current?.isSmartScrollActive()).toBe(true);
  });

  it('should scroll to the top when the method is called ', async () => {
    const ref = createRef<MessageBoxHandle>();

    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );
    const element = ref.current!;
    const scrollSpy = jest.spyOn(element, 'scrollTo');

    act(() => {
      ref.current?.scrollToTop();
    });

    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(ref.current?.isSmartScrollActive()).toBe(false);
  });

  it('should pause automatic scrolling when user scrolls up ', async () => {
    const ref = createRef<MessageBoxHandle>();

    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );

    expect(ref.current?.isSmartScrollActive()).toBe(true);

    const element = ref.current!;

    // Manually set scrollHeight and clientHeight for calculations
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 300 });

    // Simulate scroll up by changing scrollTop
    element.scrollTop = 200;
    const scrollEvent = new Event('scroll', { bubbles: true });

    act(() => {
      element.dispatchEvent(scrollEvent);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(false);
  });

  it('should resume automatic scrolling when user scrolls down to the bottom using scroll event', async () => {
    jest.useFakeTimers();

    const ref = createRef<MessageBoxHandle>();
    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );

    const element = ref.current!;
    // Manually set scrollHeight and clientHeight for calculations
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 300 });

    // Simulate scroll up by changing scrollTop
    element.scrollTop = 100;
    const scrollEvent = new Event('scroll', { bubbles: true });

    act(() => {
      element.dispatchEvent(scrollEvent);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(false);

    act(() => {
      // Simulate scroll down by changing scrollTop
      element.scrollTop = 650; // scrollHeight - scrollTop - clientHeight - DELTA_DOWN (50) = 0
      const scrollEvent = new Event('scroll', { bubbles: true });
      element.dispatchEvent(scrollEvent);
      jest.advanceTimersByTime(250);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(true);
    jest.useRealTimers();
  });

  it('should resume automatic scrolling when scrollToBottom method is used', async () => {
    const ref = createRef<MessageBoxHandle>();
    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );

    const element = ref.current!;
    // Manually set scrollHeight and clientHeight for calculations
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 300 });

    // Simulate scroll up by changing scrollTop
    element.scrollTop = 100;
    const scrollEvent = new Event('scroll', { bubbles: true });

    act(() => {
      element.dispatchEvent(scrollEvent);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(false);

    act(() => {
      ref.current?.scrollToBottom(); // resumes auto scroll and scrolls to bottom.
    });

    expect(ref.current?.isSmartScrollActive()).toBe(true);
  });

  it('should resume automatic scrolling when mouse wheel event is used', async () => {
    const ref = createRef<MessageBoxHandle>();
    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );

    const element = ref.current!;
    // Manually set scrollHeight and clientHeight for calculations
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(element, 'scrollTop', { configurable: true, value: 350 });

    const scrollEvent = new Event('scroll', { bubbles: true });

    act(() => {
      element.dispatchEvent(scrollEvent);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(false);

    // Simulate mouse wheel event
    act(() => {
      Object.defineProperty(element, 'scrollTop', { configurable: true, value: 650 });
      fireEvent.wheel(element, { deltaY: 10 });
    });

    expect(ref.current?.isSmartScrollActive()).toBe(true);
  });

  it('should resume automatic scrolling when user swipes up in touch screen', async () => {
    const ref = createRef<MessageBoxHandle>();
    render(
      <MessageBox ref={ref} enableSmartScroll>
        <div>Test message content</div>
      </MessageBox>
    );

    const element = ref.current!;
    // Manually set scrollHeight and clientHeight for calculations
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(element, 'scrollTop', { configurable: true, value: 350 });

    const scrollEvent = new Event('scroll', { bubbles: true });

    act(() => {
      element.dispatchEvent(scrollEvent);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(false);

    // Simulate touch event - swipe up
    act(() => {
      Object.defineProperty(element, 'scrollTop', { configurable: true, value: 650 });
      fireEvent.touchStart(element, { touches: [{ clientY: 700 }] });
      fireEvent.touchMove(element, { touches: [{ clientY: 700 }] });
      fireEvent.touchMove(element, { touches: [{ clientY: 600 }] });
      fireEvent.touchEnd(element);
    });

    expect(ref.current?.isSmartScrollActive()).toBe(true);
  });
});
