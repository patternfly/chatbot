// ============================================================================
// Chatbot Footer - Footnote
// ============================================================================

import type { HTMLProps, FunctionComponent } from 'react';

import { useState } from 'react';

// Import Patternfly components
import { Button, Content, ContentVariants, Flex, PopoverProps } from '@patternfly/react-core';

// Import Patternfly icons
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

// Import Chatbot components
import ChatbotPopover from '../ChatbotPopover/ChatbotPopover';

export interface ChatbotFootnoteProps extends Omit<HTMLProps<HTMLDivElement>, 'popover'> {
  /** Label to show for the footnote */
  label: string;
  /** Config for the popover which opens up when footnote is clicked */
  popover?: ChatbotFootnotePopover;
  /** Custom classname for the Footnote component */
  className?: string;
}

export interface ChatbotFootnotePopover {
  /** Title for the Footnote popover */
  title: string;
  /** Description for the Footnote popover */
  description: string;
  /** Optional Banner Image that can be shown in the Footnote Popover */
  bannerImage?: ChatbotFootnotePopoverBannerImage;
  /** Optional CTA button that can be used to trigger an action and close the popover */
  cta?: ChatbotFootnotePopoverCTA;
  /** Optional link that can be used to show an external link like **View AI policy** */
  link?: ChatbotFootnotePopoverLink;
  /** Props for PF Popover */
  popoverProps?: PopoverProps;
  /** Flag indicating whether the popover close button is rendered. Either this or a cta that closes the popover
   * must be present.
   */
  showClose?: boolean;
}

export interface ChatbotFootnotePopoverCTA {
  /** Label for the CTA */
  label: string;
  /** Callback for the CTA */
  onClick: () => void;
}

export interface ChatbotFootnotePopoverBannerImage {
  /** Source for the banner image */
  src: string;
  /** Alternate text for the banner image */
  alt: string;
}
export interface ChatbotFootnotePopoverLink {
  /** Label for the Link */
  label: string;
  /** URL for the Link */
  url: string;
}

export const ChatbotFootnote: FunctionComponent<ChatbotFootnoteProps> = ({
  label,
  popover,
  className,
  ...props
}: ChatbotFootnoteProps) => {
  if (!popover?.cta && !popover?.showClose) {
    // eslint-disable-next-line no-console
    console.error(
      'ChatbotFootnote: You must provide either the popover.cta or popover.showClose props in order to render a button that can close the popover.'
    );
  }

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const popoverBodyContent = (
    <>
      {popover?.bannerImage && <img src={popover.bannerImage.src} alt={popover.bannerImage.alt} />}
      <Content component={ContentVariants.h3}>{popover?.title}</Content>
      <Content component={ContentVariants.p}>{popover?.description}</Content>
    </>
  );

  // Define popover footer content
  const popoverFooterContent = (
    <Flex gap={{ default: 'gapSm' }}>
      {popover?.cta && (
        <Button
          variant="secondary"
          onClick={() => {
            setIsVisible(false);
            popover.cta?.onClick();
          }}
        >
          {popover.cta?.label || 'Dismiss'}
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
    </Flex>
  );

  return (
    <div className={`pf-chatbot__footnote ${className ?? ''}`} {...props}>
      {popover && (
        <ChatbotPopover
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
          showClose={popover?.showClose || false}
          {...popover.popoverProps}
        >
          <Button aria-haspopup="dialog" isExpanded={isVisible} variant="link" size="sm">
            {label}
          </Button>
        </ChatbotPopover>
      )}
      {!popover && <Content component={ContentVariants.small}>{label}</Content>}
    </div>
  );
};

export default ChatbotFootnote;
