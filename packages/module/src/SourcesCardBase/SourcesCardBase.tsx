// ============================================================================
// Chatbot Main - Messages - Sources Card
// ============================================================================
import type { FunctionComponent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useState } from 'react';
// Import PatternFly components
import {
  Button,
  ButtonProps,
  ButtonVariant,
  Card,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  CardProps,
  CardTitle,
  CardTitleProps,
  ExpandableSection,
  ExpandableSectionVariant,
  Icon,
  List,
  ListProps,
  ListItem,
  ListItemProps,
  ListVariant,
  Truncate,
  TruncateProps
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';

export interface SourcesCardBaseProps extends CardProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** The layout used to display source cards. Use wrap to display and wrap all sources at once. */
  layout?: 'paginated' | 'wrap';
  /** Flag indicating if the pagination is disabled. */
  isDisabled?: boolean;
  /** @deprecated ofWord has been deprecated. Label for the English word "of." */
  ofWord?: string;
  /** Accessible label for the pagination component. */
  paginationAriaLabel?: string;
  /** Max width of a source card when the wrap layout is used. Can be any valid CSS width value. */
  cardMaxWidth?: string;
  /** Additional props to pass to the list of source cards when the wrap layout is used. */
  listProps?: ListProps;
  /** Additional props to pass to the list items of source cards when the wrap layout is used. */
  listItemProps?: Omit<ListItemProps, 'children'>;
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

const SourcesCardBase: FunctionComponent<SourcesCardBaseProps> = ({
  className,
  isDisabled,
  paginationAriaLabel = 'Pagination',
  sources,
  toNextPageAriaLabel = 'Go to next page',
  toPreviousPageAriaLabel = 'Go to previous page',
  onNextClick,
  onPreviousClick,
  onSetPage,
  showMoreWords = 'show more',
  showLessWords = 'show less',
  isCompact,
  cardTitleProps,
  cardBodyProps,
  cardFooterProps,
  layout = 'paginated',
  cardMaxWidth = '400px',
  listProps,
  listItemProps,
  ...props
}: SourcesCardBaseProps) => {
  const [page, setPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = (_event: ReactMouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const handleNewPage = (_evt: ReactMouseEvent | ReactKeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
    onSetPage && onSetPage(_evt, newPage);
  };

  const renderTitle = (title?: string, index?: number, truncateProps?: TruncateProps) => {
    if (title) {
      return <Truncate content={title} {...truncateProps} />;
    }
    return `Source ${index !== undefined ? index + 1 : page}`;
  };

  const renderUncontrolledSourceCard = (source: SourcesCardBaseProps['sources'][0], index: number) => (
    <ListItem key={index} className="pf-chatbot__sources-list-item" {...listItemProps}>
      <Card
        isCompact={isCompact}
        className="pf-chatbot__sources-card"
        style={{ maxWidth: cardMaxWidth }}
        component="span"
        {...props}
      >
        <CardTitle className="pf-chatbot__sources-card-title" {...cardTitleProps}>
          <div className="pf-chatbot__sources-card-title-container">
            <Button
              component="a"
              variant={ButtonVariant.link}
              href={source.link}
              icon={source.isExternal ? <ExternalLinkSquareAltIcon /> : undefined}
              iconPosition="end"
              isInline
              rel={source.isExternal ? 'noreferrer' : undefined}
              target={source.isExternal ? '_blank' : undefined}
              onClick={source.onClick ?? undefined}
              {...source.titleProps}
            >
              {renderTitle(source.title, index, source.truncateProps)}
            </Button>
            {source.subtitle && <span className="pf-chatbot__sources-card-subtitle">{source.subtitle}</span>}
          </div>
        </CardTitle>
        {source.body && (
          <CardBody
            className={`pf-chatbot__sources-card-body ${source.footer ? 'pf-chatbot__compact-sources-card-body' : undefined}`}
            {...cardBodyProps}
          >
            {source.hasShowMore ? (
              // prevents extra VO announcements of button text - parent Message has aria-live
              <div aria-live="off">
                <ExpandableSection
                  variant={ExpandableSectionVariant.truncate}
                  toggleTextCollapsed={showLessWords}
                  toggleTextExpanded={showMoreWords}
                  truncateMaxLines={2}
                >
                  {source.body}
                </ExpandableSection>
              </div>
            ) : (
              <div className="pf-chatbot__sources-card-body-text">{source.body}</div>
            )}
          </CardBody>
        )}
        {source.footer && (
          <CardFooter className="pf-chatbot__sources-card-footer" {...cardFooterProps}>
            {source.footer}
          </CardFooter>
        )}
      </Card>
    </ListItem>
  );

  if (layout === 'wrap') {
    return (
      <div className="pf-chatbot__sources-card-base pf-m-wrap">
        <List isPlain variant={ListVariant.inline} className="pf-chatbot__sources-list" {...listProps}>
          {sources.map((source, index) => renderUncontrolledSourceCard(source, index))}
        </List>
      </div>
    );
  }

  return (
    <div className="pf-chatbot__sources-card-base">
      <Card isCompact={isCompact} className="pf-chatbot__sources-card" {...props}>
        <CardTitle className="pf-chatbot__sources-card-title" {...cardTitleProps}>
          <div className="pf-chatbot__sources-card-title-container">
            <Button
              component="a"
              variant={ButtonVariant.link}
              href={sources[page - 1].link}
              icon={sources[page - 1].isExternal ? <ExternalLinkSquareAltIcon /> : undefined}
              iconPosition="end"
              isInline
              rel={sources[page - 1].isExternal ? 'noreferrer' : undefined}
              target={sources[page - 1].isExternal ? '_blank' : undefined}
              onClick={sources[page - 1].onClick ?? undefined}
              {...sources[page - 1].titleProps}
            >
              {renderTitle(sources[page - 1].title, undefined, sources[page - 1].truncateProps)}
            </Button>
            {sources[page - 1].subtitle && (
              <span className="pf-chatbot__sources-card-subtitle">{sources[page - 1].subtitle}</span>
            )}
          </div>
        </CardTitle>
        {sources[page - 1].body && (
          <CardBody
            className={`pf-chatbot__sources-card-body ${sources[page - 1].footer ? 'pf-chatbot__compact-sources-card-body' : undefined}`}
            {...cardBodyProps}
          >
            {sources[page - 1].hasShowMore ? (
              // prevents extra VO announcements of button text - parent Message has aria-live
              <div aria-live="off">
                <ExpandableSection
                  variant={ExpandableSectionVariant.truncate}
                  toggleText={isExpanded ? showLessWords : showMoreWords}
                  onToggle={onToggle}
                  isExpanded={isExpanded}
                  truncateMaxLines={2}
                >
                  {sources[page - 1].body}
                </ExpandableSection>
              </div>
            ) : (
              <div className="pf-chatbot__sources-card-body-text">{sources[page - 1].body}</div>
            )}
          </CardBody>
        )}
        {sources[page - 1].footer ? (
          <CardFooter className="pf-chatbot__sources-card-footer" {...cardFooterProps}>
            {sources[page - 1].footer}
          </CardFooter>
        ) : (
          sources.length > 1 && (
            <CardFooter className="pf-chatbot__sources-card-footer-container" {...cardFooterProps}>
              <div className="pf-chatbot__sources-card-footer">
                <nav
                  className={`pf-chatbot__sources-card-footer-buttons ${className}`}
                  aria-label={paginationAriaLabel}
                >
                  <Button
                    variant={ButtonVariant.plain}
                    isDisabled={isDisabled || page === 1}
                    data-action="previous"
                    onClick={(event) => {
                      const newPage = page >= 1 ? page - 1 : 1;
                      onPreviousClick && onPreviousClick(event, newPage);
                      handleNewPage(event, newPage);
                    }}
                    aria-label={toPreviousPageAriaLabel}
                  >
                    <Icon iconSize="lg">
                      {/* these are inline because the viewBox that works in a round icon is different than the PatternFly default */}
                      <svg
                        className="pf-v6-svg"
                        viewBox="0 0 280 500"
                        fill="currentColor"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                      >
                        <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
                      </svg>
                    </Icon>
                  </Button>
                  <span aria-hidden="true">
                    {page}/{sources.length}
                  </span>
                  <Button
                    variant={ButtonVariant.plain}
                    isDisabled={isDisabled || page === sources.length}
                    aria-label={toNextPageAriaLabel}
                    data-action="next"
                    onClick={(event) => {
                      const newPage = page + 1 <= sources.length ? page + 1 : sources.length;
                      onNextClick && onNextClick(event, newPage);
                      handleNewPage(event, newPage);
                    }}
                  >
                    <Icon isInline iconSize="lg">
                      {/* these are inline because the viewBox that works in a round icon is different than the PatternFly default */}
                      <svg
                        className="pf-v6-svg"
                        viewBox="0 0 180 500"
                        fill="currentColor"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                      >
                        <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path>
                      </svg>
                    </Icon>
                  </Button>
                </nav>
              </div>
            </CardFooter>
          )
        )}
      </Card>
    </div>
  );
};

export default SourcesCardBase;
