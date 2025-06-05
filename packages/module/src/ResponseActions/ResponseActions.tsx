import type { FunctionComponent, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  ExternalLinkAltIcon,
  VolumeUpIcon,
  OutlinedThumbsUpIcon,
  OutlinedThumbsDownIcon,
  OutlinedCopyIcon,
  DownloadIcon
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
export interface ResponseActionProps {
  /** Props for message actions, such as feedback (positive or negative), copy button, share, and listen */
  actions: Record<string, ExtendedActionProps | undefined> & {
    positive?: ActionProps;
    negative?: ActionProps;
    copy?: ActionProps;
    share?: ActionProps;
    download?: ActionProps;
    listen?: ActionProps;
  };
}

export const ResponseActions: FunctionComponent<ResponseActionProps> = ({ actions }) => {
  const [activeButton, setActiveButton] = useState<string>();
  const { positive, negative, copy, share, download, listen, ...additionalActions } = actions;
  const responseActions = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (responseActions.current && !responseActions.current.contains(e.target)) {
        setActiveButton(undefined);
      }
    };
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClick = (
    e: MouseEvent | MouseEvent<Element, MouseEvent> | KeyboardEvent,
    id: string,
    onClick?: (event: MouseEvent | MouseEvent<Element, MouseEvent> | KeyboardEvent) => void
  ) => {
    setActiveButton(id);
    onClick && onClick(e);
  };

  return (
    <div ref={responseActions} className="pf-chatbot__response-actions">
      {positive && (
        <ResponseActionButton
          {...positive}
          ariaLabel={positive.ariaLabel ?? 'Good response'}
          clickedAriaLabel={positive.ariaLabel ?? 'Response recorded'}
          onClick={(e) => handleClick(e, 'positive', positive.onClick)}
          className={positive.className}
          isDisabled={positive.isDisabled}
          tooltipContent={positive.tooltipContent ?? 'Good response'}
          clickedTooltipContent={positive.clickedTooltipContent ?? 'Response recorded'}
          tooltipProps={positive.tooltipProps}
          icon={<OutlinedThumbsUpIcon />}
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
          clickedAriaLabel={negative.ariaLabel ?? 'Response recorded'}
          onClick={(e) => handleClick(e, 'negative', negative.onClick)}
          className={negative.className}
          isDisabled={negative.isDisabled}
          tooltipContent={negative.tooltipContent ?? 'Bad response'}
          clickedTooltipContent={negative.clickedTooltipContent ?? 'Response recorded'}
          tooltipProps={negative.tooltipProps}
          icon={<OutlinedThumbsDownIcon />}
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
          icon={<OutlinedCopyIcon />}
          isClicked={activeButton === 'copy'}
          ref={copy.ref}
          aria-expanded={copy['aria-expanded']}
          aria-controls={copy['aria-controls']}
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
