// ============================================================================
// Chatbot Main - Messages - Sources Card
// ============================================================================
import type { FunctionComponent } from 'react';
// Import PatternFly components
import {
  ButtonProps,
  CardBodyProps,
  CardFooterProps,
  CardProps,
  CardTitleProps,
  pluralize,
  TruncateProps
} from '@patternfly/react-core';
import SourcesCardBase from '../SourcesCardBase';

export interface SourcesCardProps extends CardProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** Flag indicating if the pagination is disabled. */
  isDisabled?: boolean;
  /** @deprecated ofWord has been deprecated. Label for the English word "of." */
  ofWord?: string;
  /** Accessible label for the pagination component. */
  paginationAriaLabel?: string;
  /** Content rendered inside the paginated card */
  sources: {
    /** Title of sources card */
    title?: string;
    /** Subtitle of sources card */
    subtitle?: string;
    /** Link to source */
    link: string;
    /** Body of sources card */
    body?: React.ReactNode | string;
    /** Whether link is external */
    isExternal?: boolean;
    /** Whether sources card is expandable */
    hasShowMore?: boolean;
    /** onClick event applied to the title of the Sources card */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** Any additional props applied to the title of the Sources card  */
    titleProps?: ButtonProps;
    /** Custom footer applied to the Sources card */
    footer?: React.ReactNode;
    /** Additional props passed to Truncate component */
    truncateProps?: TruncateProps;
  }[];
  /** Label for the English word "source" */
  sourceWord?: string;
  /** Plural for sourceWord */
  sourceWordPlural?: string;
  /** Accessible label for the button which moves to the next page. */
  toNextPageAriaLabel?: string;
  /** Accessible label for the button which moves to the previous page. */
  toPreviousPageAriaLabel?: string;
  /** Function called when user clicks to navigate to next page. */
  onNextClick?: (event: React.SyntheticEvent<HTMLButtonElement>, page: number) => void;
  /** Function called when user clicks to navigate to previous page. */
  onPreviousClick?: (event: React.SyntheticEvent<HTMLButtonElement>, page: number) => void;
  /** Function called when page is changed. */
  onSetPage?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => void;
  /** Label for English words "show more" */
  showMoreWords?: string;
  /** Label for English words "show less" */
  showLessWords?: string;
  /** Additional props passed to card title */
  cardTitleProps?: CardTitleProps;
  /** Additional props passed to card body */
  cardBodyProps?: CardBodyProps;
  /** Additional props passed to card footer */
  cardFooterProps?: CardFooterProps;
}

const SourcesCard: FunctionComponent<SourcesCardProps> = ({
  sources,
  sourceWord = 'source',
  sourceWordPlural = 'sources',
  ...props
}: SourcesCardProps) => (
  <div className="pf-chatbot__source">
    <span>{pluralize(sources.length, sourceWord, sourceWordPlural)}</span>
    <SourcesCardBase sources={sources} {...props} />
  </div>
);

export default SourcesCard;
