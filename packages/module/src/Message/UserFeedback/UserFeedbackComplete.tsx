// ============================================================================
// Chatbot Main - Messages - Feedback Complete Card
// ============================================================================
import React from 'react';

// Import PatternFly components
import { Card, CardBody, CardHeader, CardProps, CardTitle, OUIAProps, useOUIAProps } from '@patternfly/react-core';
import CloseButton from './CloseButton';

export interface UserFeedbackCompleteProps extends Omit<CardProps, 'ref'>, OUIAProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** Substitute for the English phrase "Thank you". */
  title?: string;
  /** Substitute for the English phrase "You have successfully sent your feedback! Thank you for responding." */
  body?: string | React.ReactNode;
  /** Callback function for when close button is clicked */
  onClose?: () => void;
  /** Aria label for close button */
  closeButtonAriaLabel?: string;
  /** Function to be executed on timeout. Relevant when the timeout prop is set. */
  onTimeout?: () => void;
  /** If set to true, the timeout is 8000 milliseconds. If a number is provided, card will
   * be dismissed after that amount of time in milliseconds.
   */
  timeout?: number | boolean;
  /** If the user hovers over the card and `timeout` expires, this is how long to wait
   * before finally dismissing the alert.
   */
  timeoutAnimation?: number;
  /** Callback for when mouse hovers over card */
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Callback for when mouse stops hovering over card */
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Value to overwrite the randomly generated data-ouia-component-id.*/
  ouiaId?: number | string;
  /** Set the value of data-ouia-safe. Only set to true when the component is in a static state, i.e. no animations are occurring. At all other times, this value must be false. */
  ouiaSafe?: boolean;
  /** Flag to indicate if the card is in a live region. */
  isLiveRegion?: boolean;
  /** Uniquely identifies the completion card. */
  id?: string;
  /** Whether to focus card on load */
  focusOnLoad?: boolean;
  /** Timestamp passed in by Message for more context in aria announcements */
  timestamp?: string;
}

const UserFeedbackComplete: React.FunctionComponent<UserFeedbackCompleteProps> = ({
  className,
  title = 'Feedback submitted',
  body = "We've received your response. Thank you for sharing your feedback!",
  timestamp,
  timeout = false,
  timeoutAnimation = 3000,
  onTimeout,
  onClose,
  closeButtonAriaLabel = `Close feedback for message received at ${timestamp}`,
  onMouseEnter,
  onMouseLeave,
  ouiaId,
  ouiaSafe,
  isLiveRegion,
  id,
  focusOnLoad = true,
  ...props
}: UserFeedbackCompleteProps) => {
  const [timedOut, setTimedOut] = React.useState(false);
  const [timedOutAnimation, setTimedOutAnimation] = React.useState(true);
  const [isMouseOver, setIsMouseOver] = React.useState<boolean | undefined>();
  const [containsFocus, setContainsFocus] = React.useState<boolean | undefined>();
  const dismissed = timedOut && timedOutAnimation && !isMouseOver && !containsFocus;
  const divRef = React.useRef<HTMLDivElement>(null);
  const ouiaProps = useOUIAProps('User Feedback Complete', ouiaId, ouiaSafe);

  React.useEffect(() => {
    if (focusOnLoad) {
      divRef.current?.focus();
    }
  }, []);

  React.useEffect(() => {
    const calculatedTimeout = timeout === true ? 8000 : Number(timeout);
    if (calculatedTimeout > 0) {
      const timer = setTimeout(() => setTimedOut(true), calculatedTimeout);
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  React.useEffect(() => {
    const onDocumentFocus = () => {
      if (divRef.current) {
        if (divRef.current.contains(document.activeElement)) {
          setContainsFocus(true);
          setTimedOutAnimation(false);
        } else if (containsFocus) {
          setContainsFocus(false);
        }
      }
    };
    document.addEventListener('focus', onDocumentFocus, true);
    return () => document.removeEventListener('focus', onDocumentFocus, true);
  }, [containsFocus]);

  React.useEffect(() => {
    if (containsFocus === false || isMouseOver === false) {
      const timer = setTimeout(() => setTimedOutAnimation(true), timeoutAnimation);
      return () => clearTimeout(timer);
    }
  }, [containsFocus, isMouseOver, timeoutAnimation]);

  React.useEffect(() => {
    dismissed && onTimeout && onTimeout();
  }, [dismissed, onTimeout]);

  if (dismissed) {
    return null;
  }

  const myOnMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseOver(true);
    setTimedOutAnimation(false);
    onMouseEnter && onMouseEnter(ev);
  };

  const myOnMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseOver(false);
    onMouseLeave && onMouseLeave(ev);
  };

  return (
    /* card does not have ref forwarding; hence wrapper div */
    <div
      ref={divRef}
      onMouseEnter={myOnMouseEnter}
      onMouseLeave={myOnMouseLeave}
      {...(isLiveRegion && {
        'aria-live': 'polite',
        'aria-atomic': 'false'
      })}
      id={id}
      tabIndex={0}
      aria-label={title}
      {...ouiaProps}
    >
      <Card className={`pf-chatbot__feedback-card ${className ? className : ''}`} {...props}>
        <CardHeader
          actions={
            /* eslint-disable indent */
            onClose
              ? {
                  actions: <CloseButton onClose={onClose} ariaLabel={closeButtonAriaLabel} />
                }
              : undefined
            /* eslint-enable indent */
          }
        ></CardHeader>
        <div className="pf-chatbot__feedback-complete-body">
          <div className="pf-chatbot__feedback-complete-image">
            <svg width="60" height="64" viewBox="0 0 60 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M53.0555 21.5975H6.94323C3.57013 21.5975 0.835693 24.3319 0.835693 27.705V57.8925C0.835693 61.2656 3.57013 64 6.94323 64H53.0555C56.4286 64 59.1631 61.2656 59.1631 57.8925V27.705C59.1631 24.3319 56.4286 21.5975 53.0555 21.5975Z"
                fill="#F8AE54"
              />
              <path
                d="M55.8973 19.8247C52.5894 15.7926 29.9992 0 29.9992 0C29.9992 0 7.40996 15.7926 4.10102 19.8247C0.79312 23.8568 0.835476 25.7184 0.835476 27.8899H59.1629C59.1629 25.7184 59.2052 23.8578 55.8973 19.8257V19.8247Z"
                fill="#FFCC17"
              />
              <g>
                <path d="M53.0567 8.48981H6.94336V61.8388H53.0567V8.48981Z" fill="#F2F2F2" />
              </g>
              <path d="M51.6589 7.49908H8.34204V60.8481H51.6589V7.49908Z" fill="white" />
              <path
                d="M0.835693 29.1296V57.8925C0.835693 59.2375 1.27165 60.4803 2.00823 61.4896L23.0303 43.5462L0.835693 29.1296Z"
                fill="#FFCC17"
              />
              <path
                d="M36.9695 43.5472L57.9905 61.4907C58.7271 60.4813 59.1631 59.2386 59.1631 57.8935V29.1306L36.9685 43.5472H36.9695Z"
                fill="#FFF4CC"
              />
              <path
                d="M0.835693 57.8925V57.8067L22.4146 42.7992L29.9994 37.5244L37.5842 42.7992L59.1641 57.8067V57.8925C59.1641 61.2665 56.4296 64 53.0566 64H6.94323C3.57024 64 0.835693 61.2665 0.835693 57.8925Z"
                fill="#FFE072"
              />
              <g>
                <path d="M22.1563 42.978L0.835693 57.8067V56.6993L22.1563 42.978Z" fill="#FEF07C" />
              </g>
              <g>
                <path d="M37.8425 42.978L59.1631 57.8067V56.6993L37.8425 42.978Z" fill="#FEF07C" />
              </g>
              <path
                d="M37.8037 32.2373C42.1136 27.9273 42.1136 20.9395 37.8037 16.6295C33.4937 12.3196 26.5059 12.3196 22.196 16.6295C17.886 20.9395 17.886 27.9273 22.196 32.2373C26.5059 36.5472 33.4937 36.5472 37.8037 32.2373Z"
                fill="#0066CC"
              />
              <path
                d="M27.7803 30.1276C27.6098 30.1276 27.4497 30.0614 27.3298 29.9406L22.9465 25.5562C22.8267 25.4364 22.7595 25.2762 22.7595 25.1068C22.7595 24.9374 22.8256 24.7762 22.9465 24.6554L24.2379 23.364C24.3577 23.2442 24.5178 23.177 24.6883 23.177C24.8587 23.177 25.0168 23.2431 25.1377 23.363L27.7803 26.0056L34.861 18.9259C34.9808 18.8061 35.1409 18.7389 35.3103 18.7389C35.4798 18.7389 35.6389 18.8051 35.7597 18.9239L37.0531 20.2173C37.173 20.3361 37.2401 20.4962 37.2401 20.6677C37.2401 20.8392 37.174 20.9983 37.0531 21.1181L28.2317 29.9406C28.1119 30.0604 27.9518 30.1265 27.7823 30.1265L27.7803 30.1276Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="pf-chatbot__feedback-complete-text">
            <CardTitle className="pf-chatbot__feedback-complete-title">{title}</CardTitle>
            <CardBody className={`pf-chatbot__feedback-complete-body`}>{body}</CardBody>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserFeedbackComplete;
