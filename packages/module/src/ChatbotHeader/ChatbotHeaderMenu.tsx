import type { Ref, FunctionComponent } from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ButtonProps, Icon, Tooltip, TooltipProps } from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';

export interface ChatbotHeaderMenuProps extends ButtonProps {
  /** Callback function to attach to menu toggle on top right of chatbot header. */
  onMenuToggle: () => void;
  /** Custom classname for the header component */
  className?: string;
  /** Props spread to the PF Tooltip component wrapping the display mode dropdown */
  tooltipProps?: TooltipProps;
  /** Aria label for menu */
  menuAriaLabel?: string;
  /** Ref applied to menu */
  innerRef?: React.Ref<HTMLButtonElement>;
  /** Content used in tooltip */
  tooltipContent?: string;
  /** Sets menu to compact styling. */
  isCompact?: boolean;
}

const ChatbotHeaderMenuBase: FunctionComponent<ChatbotHeaderMenuProps> = ({
  className,
  onMenuToggle,
  tooltipProps,
  menuAriaLabel = 'Chat history menu',
  innerRef,
  tooltipContent = 'Chat history menu',
  isCompact,
  ...props
}: ChatbotHeaderMenuProps) => {
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false);
  // I'd like to use a prop here later if this works
  const drawerState = props['aria-expanded'];
  const isDrawerOpen = drawerState === true;
  const prevDrawerStateRef = useRef<boolean | undefined>(isDrawerOpen);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (drawerState !== undefined) {
      const wasDrawerOpen = prevDrawerStateRef.current === true;
      const isDrawerClosing = wasDrawerOpen && !isDrawerOpen;

      setIsDrawerAnimating(true);
      const timeout = setTimeout(() => {
        setIsDrawerAnimating(false);

        if (isDrawerClosing) {
          requestAnimationFrame(() => {
            buttonRef.current?.focus();
          });
        }
      }, 350);

      prevDrawerStateRef.current = isDrawerOpen;
      return () => clearTimeout(timeout);
    }
  }, [drawerState, isDrawerOpen]);

  const button = useMemo(
    () => (
      <Button
        className={`pf-chatbot__button--toggle-menu ${isCompact ? 'pf-m-compact' : ''}`}
        variant="plain"
        onClick={onMenuToggle}
        aria-label={menuAriaLabel}
        ref={innerRef ?? buttonRef}
        icon={
          <Icon size={isCompact ? 'lg' : 'xl'} isInline>
            <BarsIcon />
          </Icon>
        }
        size={isCompact ? 'sm' : undefined}
        {...props}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCompact, menuAriaLabel, onMenuToggle, innerRef, buttonRef]
  );

  return (
    <div className={`pf-chatbot__menu ${className}`}>
      {isDrawerAnimating ? (
        button
      ) : (
        <Tooltip
          content={tooltipContent}
          position="bottom"
          // prevents VO announcements of both aria label and tooltip
          aria="none"
          {...tooltipProps}
        >
          {button}
        </Tooltip>
      )}
    </div>
  );
};

export const ChatbotHeaderMenu = forwardRef((props: ChatbotHeaderMenuProps, ref: Ref<HTMLButtonElement>) => (
  <ChatbotHeaderMenuBase innerRef={ref} {...props} />
));
