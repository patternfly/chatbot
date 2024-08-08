// ============================================================================
// Chatbot Footer - Footnote
// ============================================================================

import React from 'react';

// Import Patternfly components
import { Button, Content, ContentVariants, PopoverProps } from '@patternfly/react-core';

// Import Patternfly icons
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

// Import Chatbot components
import Popover from '../Popover/Popover';

export interface FootnoteProps extends React.HTMLProps<HTMLDivElement> {
  /** Label to show for the footnote */
  label: string;
  /** Config for the popover which opens up when footnote is clicked */
  popover?: FootnotePopover;
  /** Custom classname for the Footnote component */
  className?: string;
}

export interface FootnotePopover {
  /** Title for the Footnote popover */
  title: string;
  /** Description for the Footnote popover */
  description: string;
  /** Optional Banner Image that can be shown in the Footnote Popover */
  bannerImage?: FootnotePopoverBannerImage;
  /** Optional CTA button that can be used to trigger an action and close the popover */
  cta?: FootnotePopoverCTA;
  /** Optional link that can be used to show and external link like **Learn More** */
  link?: FootnotePopoverLink;
  /** Props for PF Popover */
  popoverProps?: PopoverProps;
}

export interface FootnotePopoverCTA {
  /** Label for the CTA */
  label: string;
  /** Callback for the CTA */
  onClick: () => void;
}

export interface FootnotePopoverBannerImage {
  /** Source for the banner image */
  src: string;
  /** Alternate text for the banner image */
  alt: string;
}
export interface FootnotePopoverLink {
  /** Label for the Link */
  label: string;
  /** URL for the Link */
  url: string;
}

export const Footnote: React.FunctionComponent<FootnoteProps> = ({
  label,
  popover,
  className,
  ...props
}: FootnoteProps) => {
  // Popover visibility state
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  // Define popover body content
  const popoverBodyContent = (
    <>
      {popover?.bannerImage && <img src={popover.bannerImage.src} alt={popover.bannerImage.alt} />}
      <Content component={ContentVariants.h3}>{popover?.title}</Content>
      <Content component={ContentVariants.p}>{popover?.description}</Content>
    </>
  );

  // Define popover footer content
  const popoverFooterContent = (
    <>
      {popover?.cta && (
        <Button
          variant="secondary"
          onClick={() => {
            setIsVisible(false);
            popover.cta?.onClick();
          }}
        >
          {popover.cta?.label || 'Got it'}
        </Button>
      )}
      {popover?.link && (
        <Button
          variant="link"
          component="a"
          href={popover.link.url}
          target="_blank"
          icon={<ExternalLinkAltIcon />}
          iconPosition="end"
        >
          {popover.link.label}
        </Button>
      )}
    </>
  );

  return (
    <div className={`pf-chatbot__footnote ${className}`} {...props}>
      {popover && (
        <Popover
          className="pf-chatbot__popover--footnote"
          aria-label={popover.popoverProps?.['aria-label'] || 'More information'}
          isVisible={isVisible}
          shouldOpen={(_event, _fn) => setIsVisible(true)}
          shouldClose={(_event, _fn) => setIsVisible(false)}
          bodyContent={popoverBodyContent}
          footerContent={popoverFooterContent}
          minWidth={popover.popoverProps?.minWidth || '432'}
          maxWidth={popover.popoverProps?.maxWidth || '432'}
          distance={popover.popoverProps?.distance || 16}
          {...popover.popoverProps}
        >
          <Button variant="plain">
            {label} <InfoCircleIcon />
          </Button>
        </Popover>
      )}
      {!popover && <Content component={ContentVariants.small}>{label}</Content>}
    </div>
  );
};

export default Footnote;
