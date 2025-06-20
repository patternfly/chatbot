import { Component, createRef } from 'react';
import styles from '@patternfly/react-styles/css/components/ExpandableSection/expandable-section';
import { css } from '@patternfly/react-styles';
import lineClamp from '@patternfly/react-tokens/dist/esm/c_expandable_section_m_truncate__content_LineClamp';
import { debounce, getResizeObserver, getUniqueId, PickOptional } from '@patternfly/react-core';

export enum ExpandableSectionVariant {
  default = 'default',
  truncate = 'truncate'
}

/** The main expandable section component. */

export interface ExpandableSectionProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onToggle'> {
  /** Content rendered inside the expandable section. */
  children?: React.ReactNode;
  /** Additional classes added to the expandable section. */
  className?: string;
  /** Id of the content of the expandable section. When passing in the isDetached property, this
   * property's value should match the contentId property of the expandable section toggle sub-component.
   */
  contentId?: string;
  /** Id of the toggle of the expandable section, which provides an accessible name to the
   * expandable section content via the aria-labelledby attribute. When the isDetached property
   * is also passed in, the value of this property must match the toggleId property of the
   * expandable section toggle sub-component.
   */
  toggleId?: string;
  /** Display size variant. Set to "lg" for disclosure styling. */
  displaySize?: 'default' | 'lg';
  /** Indicates the expandable section has a detached toggle. */
  isDetached?: boolean;
  /** Flag to indicate if the content is expanded. */
  isExpanded?: boolean;
  /** Flag to indicate if the content is indented. */
  isIndented?: boolean;
  /** Flag to indicate the width of the component is limited. Set to "true" for disclosure styling. */
  isWidthLimited?: boolean;
  /** Truncates the expandable content to the specified number of lines when using the
   * "truncate" variant.
   */
  truncateMaxLines?: number;
  /** Determines the variant of the expandable section. When passing in "truncate" as the
   * variant, the expandable content will be truncated after 3 lines by default.
   */
  variant?: 'default' | 'truncate';
  language?: string;
}

interface ExpandableSectionState {
  isExpanded: boolean;
  hasToggle: boolean;
  previousWidth: number | undefined;
}

const setLineClamp = (element: HTMLDivElement | null, lines?: number, language?: string, isExpanded?: boolean) => {
  if (!element || !lines || lines < 1 || typeof isExpanded === 'undefined') {
    return;
  }

  if (language) {
    const selector = `.language-${language.toLowerCase()}`;
    const childElement = element.querySelector(selector) as HTMLDivElement;

    if (!childElement) {
      return;
    }
    if (isExpanded) {
      // Reset all truncation-related styles to their default values
      childElement.style.removeProperty('-webkit-line-clamp');
      childElement.style.removeProperty('display');
      childElement.style.removeProperty('-webkit-box-orient');
      childElement.style.removeProperty('overflow');
    } else {
      childElement.style.setProperty('-webkit-line-clamp', lines.toString());
      childElement.style.setProperty('display', '-webkit-box');
      childElement.style.setProperty('-webkit-box-orient', 'vertical');
      childElement.style.setProperty('overflow', 'hidden');
    }
  }
};

class ExpandableSectionForSyntaxHighlighter extends Component<ExpandableSectionProps, ExpandableSectionState> {
  static displayName = 'ExpandableSection';
  constructor(props: ExpandableSectionProps) {
    super(props);

    this.state = {
      isExpanded: props.isExpanded ?? false,
      hasToggle: true,
      previousWidth: undefined
    };
  }

  expandableContentRef = createRef<HTMLDivElement>();
  /* eslint-disable-next-line */
  observer: any = () => {};

  static defaultProps: PickOptional<ExpandableSectionProps> = {
    className: '',
    isDetached: false,
    displaySize: 'default',
    isWidthLimited: false,
    isIndented: false,
    variant: 'default'
  };

  componentDidMount() {
    if (this.props.variant === ExpandableSectionVariant.truncate) {
      const expandableContent = this.expandableContentRef.current;
      if (expandableContent) {
        this.setState({ previousWidth: expandableContent.offsetWidth });
        this.observer = getResizeObserver(expandableContent, this.handleResize, false);

        if (this.props.truncateMaxLines) {
          setLineClamp(expandableContent, this.props.truncateMaxLines, this.props.language, this.state.isExpanded);
        }
      }

      this.checkToggleVisibility();
    }
  }

  componentDidUpdate(prevProps: ExpandableSectionProps) {
    if (
      this.props.variant === ExpandableSectionVariant.truncate &&
      (prevProps.truncateMaxLines !== this.props.truncateMaxLines ||
        prevProps.children !== this.props.children ||
        prevProps.isExpanded !== this.props.isExpanded)
    ) {
      const expandableContent = this.expandableContentRef.current;
      setLineClamp(expandableContent, this.props.truncateMaxLines, this.props.language, this.props.isExpanded);
      this.checkToggleVisibility();
    }
  }

  componentWillUnmount() {
    if (this.props.variant === ExpandableSectionVariant.truncate) {
      this.observer();
    }
  }

  checkToggleVisibility = () => {
    if (this.expandableContentRef?.current) {
      const maxLines = this.props.truncateMaxLines || parseInt(lineClamp.value);
      const totalLines =
        this.expandableContentRef.current.scrollHeight /
        parseInt(getComputedStyle(this.expandableContentRef.current).lineHeight);

      this.setState({
        hasToggle: totalLines > maxLines
      });
    }
  };

  resize = () => {
    if (this.expandableContentRef.current) {
      const { offsetWidth } = this.expandableContentRef.current;
      if (this.state.previousWidth !== offsetWidth) {
        this.setState({ previousWidth: offsetWidth });
        this.checkToggleVisibility();
      }
    }
  };
  handleResize = debounce(this.resize, 250);

  render() {
    const {
      className,
      children,
      isExpanded,
      isDetached,
      displaySize,
      isWidthLimited,
      isIndented,
      contentId,
      toggleId,
      variant,
      // Gets rid of console error about it being on a DOM element
      // eslint-disable-next-line
      truncateMaxLines,
      ...props
    } = this.props;

    if (isDetached && !toggleId) {
      /* eslint-disable no-console */
      console.warn(
        'ExpandableSection: The toggleId value must be passed in and must match the toggleId of the ExpandableSectionToggle.'
      );
    }

    const uniqueContentId = contentId || getUniqueId('expandable-section-content');
    const uniqueToggleId = toggleId || getUniqueId('expandable-section-toggle');

    return (
      <div
        className={css(
          styles.expandableSection,
          isExpanded && styles.modifiers.expanded,
          displaySize === 'lg' && styles.modifiers.displayLg,
          isWidthLimited && styles.modifiers.limitWidth,
          isIndented && styles.modifiers.indented,
          variant === ExpandableSectionVariant.truncate && styles.modifiers.truncate,
          className
        )}
        {...props}
      >
        <div
          ref={this.expandableContentRef}
          className={css(styles.expandableSectionContent)}
          hidden={variant !== ExpandableSectionVariant.truncate && !isExpanded}
          id={uniqueContentId}
          aria-labelledby={uniqueToggleId}
          role="region"
        >
          {children}
        </div>
      </div>
    );
  }
}

export { ExpandableSectionForSyntaxHighlighter };
