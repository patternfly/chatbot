import type { FunctionComponent, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  ExternalLinkAltIcon,
  VolumeUpIcon,
  OutlinedThumbsUpIcon,
  ThumbsUpIcon,
  OutlinedThumbsDownIcon,
  ThumbsDownIcon,
  OutlinedCopyIcon,
  CopyIcon,
  DownloadIcon,
  PencilAltIcon
} from '@patternfly/react-icons';
import ResponseActionButton from './ResponseActionButton';
import { ButtonProps, TooltipProps } from '@patternfly/react-core';

export interface ActionProps extends Omit<ButtonProps, 'ref'> {
  /** Aria-label for the button */
  ariaLabel?: string;
  /** Aria-label for the button, shown when the button is clicked. */
  clickedAriaLabel?: string;
  /** On-click handler for the button */
  onClick?: ((event: MouseEvent | React.MouseEvent<Element, MouseEvent> | KeyboardEvent) => void) | undefined;
  /** Class name for the button */
  className?: string;
  /** Props to control if the attach button should be disabled */
  isDisabled?: boolean;
  /** Content shown in the tooltip */
  tooltipContent?: string;
  /** Content shown in the tooltip when the button is clicked. */
  clickedTooltipContent?: string;
  /** Props to control the PF Tooltip component */
  tooltipProps?: TooltipProps;
  /** Icon for custom response action */
  icon?: React.ReactNode;
  /** Ref for response action button */
  ref?: React.Ref<HTMLButtonElement>;
  /** Whether content launched by button, such as the feedback form, is expanded */
  'aria-expanded'?: boolean;
  /** Id for content controlled by the button, such as the feedback form */
  'aria-controls'?: string;
}

type ExtendedActionProps = ActionProps & {
  [key: string]: any;
};

/**
 * The various actions that can be attached to a bot message for users to interact with.
 * Use this component when passing children to Message to customize its structure.
 */

export interface ResponseActionProps {
  /** Props for message actions, such as feedback (positive or negative), copy button, share, and listen */
  actions: Record<string, ExtendedActionProps | undefined> & {
    positive?: ActionProps;
    negative?: ActionProps;
    copy?: ActionProps;
    share?: ActionProps;
    download?: ActionProps;
    listen?: ActionProps;
    edit?: ActionProps;
  };
  /** When true, the selected action will persist even when clicking outside the component.
   * When false (default), clicking outside or clicking another action will deselect the current selection. */
  persistActionSelection?: boolean;
  /** When true, automatically swaps to filled icon variants when predefined actions are clicked.
   * Predefined actions will use filled variants (e.g., ThumbsUpIcon) when clicked and outline variants (e.g., OutlinedThumbsUpIcon) when not clicked. */
  useFilledIconsOnClick?: boolean;
}

export const ResponseActions: FunctionComponent<ResponseActionProps> = ({
  actions,
  persistActionSelection = false,
  useFilledIconsOnClick = false
}) => {
  const [activeButton, setActiveButton] = useState<string>();
  const [clickStatePersisted, setClickStatePersisted] = useState<boolean>(false);

  const { positive, negative, copy, edit, share, download, listen, ...additionalActions } = actions;

  useEffect(() => {
    // Define the order of precedence for checking initial `isClicked`
    const actionPrecedence = ['positive', 'negative', 'copy', 'edit', 'share', 'download', 'listen'];
    let initialActive: string | undefined;

    // Check predefined actions first based on precedence
    for (const actionName of actionPrecedence) {
      const actionProp = actions[actionName as keyof typeof actions];
      if (actionProp?.isClicked) {
        initialActive = actionName;
        break;
      }
    }
    // If no predefined action was initially clicked, check additionalActions
    if (!initialActive) {
      const clickedActionName = Object.keys(additionalActions).find(
        (actionName) => !actionPrecedence.includes(actionName) && additionalActions[actionName]?.isClicked
      );
      initialActive = clickedActionName;
    }
    if (initialActive) {
      // Click state is explicitly controlled by consumer.
      setClickStatePersisted(true);
    }
    // If persistActionSelection is true, all selections are persisted
    if (persistActionSelection) {
      setClickStatePersisted(true);
    }
    setActiveButton(initialActive);
  }, [actions, persistActionSelection]);

  const responseActions = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only add click outside listener if not persisting selection
    if (persistActionSelection) {
      return;
    }

    const handleClickOutside = (e) => {
      if (responseActions.current && !responseActions.current.contains(e.target) && !clickStatePersisted) {
        setActiveButton(undefined);
      }
    };
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [clickStatePersisted, persistActionSelection]);

  const handleClick = (
    e: MouseEvent | MouseEvent<Element, MouseEvent> | KeyboardEvent,
    id: string,
    onClick?: (event: MouseEvent | MouseEvent<Element, MouseEvent> | KeyboardEvent) => void
  ) => {
    e.stopPropagation();
    if (persistActionSelection) {
      if (activeButton === id) {
        // Toggle off if clicking the same button
        setActiveButton(undefined);
      } else {
        // Set new active button
        setActiveButton(id);
      }
      setClickStatePersisted(true);
    } else {
      setClickStatePersisted(false);
      setActiveButton(id);
    }
    onClick && onClick(e);
  };

  const iconMap = {
    positive: {
      filled: <ThumbsUpIcon />,
      outlined: <OutlinedThumbsUpIcon />
    },
    negative: {
      filled: <ThumbsDownIcon />,
      outlined: <OutlinedThumbsDownIcon />
    },
    copy: {
      filled: <CopyIcon />,
      outlined: <OutlinedCopyIcon />
    }
  };

  const getIcon = (actionName: string) => {
    const isClicked = activeButton === actionName;

    if (isClicked && useFilledIconsOnClick) {
      return iconMap[actionName].filled;
    }

    return iconMap[actionName].outlined;
  };

  return (
    <div ref={responseActions} className="pf-chatbot__response-actions">
      {positive && (
        <ResponseActionButton
          {...positive}
          ariaLabel={positive.ariaLabel ?? 'Good response'}
          clickedAriaLabel={positive.ariaLabel ?? 'Good response recorded'}
          onClick={(e) => handleClick(e, 'positive', positive.onClick)}
          className={positive.className}
          isDisabled={positive.isDisabled}
          tooltipContent={positive.tooltipContent ?? 'Good response'}
          clickedTooltipContent={positive.clickedTooltipContent ?? 'Good response recorded'}
          tooltipProps={positive.tooltipProps}
          icon={getIcon('positive')}
          isClicked={activeButton === 'positive'}
          ref={positive.ref}
          aria-expanded={positive['aria-expanded']}
          aria-controls={positive['aria-controls']}
        ></ResponseActionButton>
      )}
      {negative && (
        <ResponseActionButton
          {...negative}
          ariaLabel={negative.ariaLabel ?? 'Bad response'}
          clickedAriaLabel={negative.ariaLabel ?? 'Bad response recorded'}
          onClick={(e) => handleClick(e, 'negative', negative.onClick)}
          className={negative.className}
          isDisabled={negative.isDisabled}
          tooltipContent={negative.tooltipContent ?? 'Bad response'}
          clickedTooltipContent={negative.clickedTooltipContent ?? 'Bad response recorded'}
          tooltipProps={negative.tooltipProps}
          icon={getIcon('negative')}
          isClicked={activeButton === 'negative'}
          ref={negative.ref}
          aria-expanded={negative['aria-expanded']}
          aria-controls={negative['aria-controls']}
        ></ResponseActionButton>
      )}
      {copy && (
        <ResponseActionButton
          {...copy}
          ariaLabel={copy.ariaLabel ?? 'Copy'}
          clickedAriaLabel={copy.ariaLabel ?? 'Copied'}
          onClick={(e) => handleClick(e, 'copy', copy.onClick)}
          className={copy.className}
          isDisabled={copy.isDisabled}
          tooltipContent={copy.tooltipContent ?? 'Copy'}
          clickedTooltipContent={copy.clickedTooltipContent ?? 'Copied'}
          tooltipProps={copy.tooltipProps}
          icon={getIcon('copy')}
          isClicked={activeButton === 'copy'}
          ref={copy.ref}
          aria-expanded={copy['aria-expanded']}
          aria-controls={copy['aria-controls']}
        ></ResponseActionButton>
      )}
      {edit && (
        <ResponseActionButton
          {...edit}
          ariaLabel={edit.ariaLabel ?? 'Edit'}
          clickedAriaLabel={edit.ariaLabel ?? 'Editing'}
          onClick={(e) => handleClick(e, 'edit', edit.onClick)}
          className={edit.className}
          isDisabled={edit.isDisabled}
          tooltipContent={edit.tooltipContent ?? 'Edit '}
          clickedTooltipContent={edit.clickedTooltipContent ?? 'Editing'}
          tooltipProps={edit.tooltipProps}
          icon={<PencilAltIcon />}
          isClicked={activeButton === 'edit'}
          ref={edit.ref}
          aria-expanded={edit['aria-expanded']}
          aria-controls={edit['aria-controls']}
        ></ResponseActionButton>
      )}
      {share && (
        <ResponseActionButton
          {...share}
          ariaLabel={share.ariaLabel ?? 'Share'}
          clickedAriaLabel={share.ariaLabel ?? 'Shared'}
          onClick={(e) => handleClick(e, 'share', share.onClick)}
          className={share.className}
          isDisabled={share.isDisabled}
          tooltipContent={share.tooltipContent ?? 'Share'}
          clickedTooltipContent={share.clickedTooltipContent ?? 'Shared'}
          tooltipProps={share.tooltipProps}
          icon={<ExternalLinkAltIcon />}
          isClicked={activeButton === 'share'}
          ref={share.ref}
          aria-expanded={share['aria-expanded']}
          aria-controls={share['aria-controls']}
        ></ResponseActionButton>
      )}
      {download && (
        <ResponseActionButton
          {...download}
          ariaLabel={download.ariaLabel ?? 'Download'}
          clickedAriaLabel={download.ariaLabel ?? 'Downloaded'}
          onClick={(e) => handleClick(e, 'download', download.onClick)}
          className={download.className}
          isDisabled={download.isDisabled}
          tooltipContent={download.tooltipContent ?? 'Download'}
          clickedTooltipContent={download.clickedTooltipContent ?? 'Downloaded'}
          tooltipProps={download.tooltipProps}
          icon={<DownloadIcon />}
          isClicked={activeButton === 'download'}
          ref={download.ref}
          aria-expanded={download['aria-expanded']}
          aria-controls={download['aria-controls']}
        ></ResponseActionButton>
      )}
      {listen && (
        <ResponseActionButton
          {...listen}
          ariaLabel={listen.ariaLabel ?? 'Listen'}
          clickedAriaLabel={listen.ariaLabel ?? 'Listening'}
          onClick={(e) => handleClick(e, 'listen', listen.onClick)}
          className={listen.className}
          isDisabled={listen.isDisabled}
          tooltipContent={listen.tooltipContent ?? 'Listen'}
          clickedTooltipContent={listen.clickedTooltipContent ?? 'Listening'}
          tooltipProps={listen.tooltipProps}
          icon={<VolumeUpIcon />}
          isClicked={activeButton === 'listen'}
          ref={listen.ref}
          aria-expanded={listen['aria-expanded']}
          aria-controls={listen['aria-controls']}
        ></ResponseActionButton>
      )}

      {Object.keys(additionalActions).map((action) => (
        <ResponseActionButton
          {...additionalActions[action]}
          key={action}
          ariaLabel={additionalActions[action]?.ariaLabel}
          clickedAriaLabel={additionalActions[action]?.clickedAriaLabel}
          onClick={(e) => handleClick(e, action, additionalActions[action]?.onClick)}
          className={additionalActions[action]?.className}
          isDisabled={additionalActions[action]?.isDisabled}
          tooltipContent={additionalActions[action]?.tooltipContent}
          tooltipProps={additionalActions[action]?.tooltipProps}
          clickedTooltipContent={additionalActions[action]?.clickedTooltipContent}
          icon={additionalActions[action]?.icon}
          isClicked={activeButton === action}
          ref={additionalActions[action]?.ref}
          aria-expanded={additionalActions[action]?.['aria-expanded']}
          aria-controls={additionalActions[action]?.['aria-controls']}
        />
      ))}
    </div>
  );
};

export default ResponseActions;
