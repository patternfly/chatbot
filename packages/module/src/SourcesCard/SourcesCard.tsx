// ============================================================================
// Chatbot Main - Messages - Sources Card
// ============================================================================
import React from 'react';

// Import PatternFly components
import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  CardTitle,
  Icon,
  pluralize,
  Truncate
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';

export interface SourcesCardProps extends CardProps {
  /** Additional classes for the pagination navigation container. */
  className?: string;
  /** Flag indicating if the pagination is disabled. */
  isDisabled?: boolean;
  /** Label for the English word "of". */
  ofWord?: string;
  /** Accessible label for the pagination component. */
  paginationAriaLabel?: string;
  /** Content rendered inside the paginated card */
  sources: { title?: string; link: string; body?: React.ReactNode | string; isExternal?: boolean }[];
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
}

const SourcesCard: React.FunctionComponent<SourcesCardProps> = ({
  className,
  isDisabled,
  ofWord = 'of',
  paginationAriaLabel = 'Pagination',
  sources,
  sourceWord = 'source',
  sourceWordPlural = 'sources',
  toNextPageAriaLabel = 'Go to next page',
  toPreviousPageAriaLabel = 'Go to previous page',
  onNextClick,
  onPreviousClick,
  onSetPage,
  ...props
}: SourcesCardProps) => {
  const [page, setPage] = React.useState(1);

  const handleNewPage = (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
    onSetPage && onSetPage(_evt, newPage);
  };

  const renderTitle = (title?: string) => {
    if (title) {
      return <Truncate content={title} />;
    }
    return `Source ${page}`;
  };

  return (
    <div className="pf-chatbot__source">
      <span>{pluralize(sources.length, sourceWord, sourceWordPlural)}</span>
      <Card className="pf-chatbot__sources-card" {...props}>
        <CardTitle className="pf-chatbot__sources-card-title">
          <Button
            component="a"
            variant={ButtonVariant.link}
            href={sources[page - 1].link}
            icon={sources[page - 1].isExternal ? <ExternalLinkSquareAltIcon /> : undefined}
            iconPosition="end"
            isInline
            rel={sources[page - 1].isExternal ? 'noreferrer' : undefined}
            target={sources[page - 1].isExternal ? '_blank' : undefined}
          >
            {renderTitle(sources[page - 1].title)}
          </Button>
        </CardTitle>
        {sources[page - 1].body && (
          <CardBody
            className={`pf-chatbot__sources-card-body ${sources.length === 1 && 'pf-chatbot__sources-card-no-footer'}`}
          >
            {sources[page - 1].body}
          </CardBody>
        )}
        {sources.length > 1 && (
          <CardFooter className="pf-chatbot__sources-card-footer-container">
            <div className="pf-chatbot__sources-card-footer">
              <nav className={`pf-chatbot__sources-card-footer-buttons ${className}`} aria-label={paginationAriaLabel}>
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

              <span aria-hidden="true">
                {page} {ofWord} {sources.length}
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SourcesCard;
