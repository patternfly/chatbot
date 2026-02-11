// ============================================================================
// Chatbot Main - Messages - Sources Card
// ============================================================================
import type { FunctionComponent } from 'react';
import {
  ButtonProps,
  CardBodyProps,
  CardFooterProps,
  CardProps,
  CardTitleProps,
  pluralize,
  TruncateProps
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import SourcesCardBase from '../SourcesCardBase';

export interface SourcesCardProps extends CardProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** The layout used to display source cards. Use wrap to display and wrap all sources at once. */
  layout?: 'paginated' | 'wrap';
  /** Max width of a source card when the wrap layout is used. Can be any valid CSS width value. */
  cardMaxWidth?: string;
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
  layout = 'paginated',
  cardMaxWidth = '400px',
  ...props
}: SourcesCardProps) => (
  <div className={css('pf-chatbot__source', layout === 'wrap' && 'pf-m-wrap')}>
    <span>{pluralize(sources.length, sourceWord, sourceWordPlural)}</span>
    <SourcesCardBase sources={sources} layout={layout} cardMaxWidth={cardMaxWidth} {...props} />
  </div>
);

export default SourcesCard;
