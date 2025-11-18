import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ToolCall from './ToolCall';

describe('ToolCall', () => {
  const defaultProps = {
    titleText: 'ToolCall Title',
    loadingText: 'Loading ToolCall'
  };

  it('Renders with passed in titleText', () => {
    render(<ToolCall {...defaultProps} />);
    expect(screen.getByText(defaultProps.titleText)).toBeVisible();
  });

  it('Does not render with passed in loadingText when isLoading is false', () => {
    render(<ToolCall {...defaultProps} />);
    expect(screen.queryByText(defaultProps.loadingText)).not.toBeInTheDocument();
  });

  it('Renders with passed in loadingText when isLoading is true', () => {
    render(<ToolCall {...defaultProps} isLoading />);
    expect(screen.getByText(defaultProps.loadingText)).toBeVisible();
  });

  it('Does not render titleText when isLoading is true', () => {
    render(<ToolCall {...defaultProps} isLoading />);
    expect(screen.queryByText(defaultProps.titleText)).not.toBeInTheDocument();
  });

  it('Passes spinnerProps to Spinner', () => {
    render(<ToolCall {...defaultProps} isLoading spinnerProps={{ id: 'spinner-test-id' }} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('id', 'spinner-test-id');
  });

  it('Does not render expandable toggle by default', () => {
    render(<ToolCall {...defaultProps} />);
    expect(screen.queryByRole('button', { name: defaultProps.titleText })).not.toBeInTheDocument();
  });

  it('Renders titleText inside expandable toggle when expandableContent is passed', () => {
    render(<ToolCall {...defaultProps} expandableContent="Expandable Content" />);
    expect(screen.getByRole('button', { name: defaultProps.titleText })).toBeVisible();
  });

  it('Does not render expandable content when expandableContent is passed by default', () => {
    render(<ToolCall {...defaultProps} expandableContent="Expandable Content" />);
    expect(screen.queryByText('Expandable Content')).not.toBeVisible();
  });

  it('Renders expandable content when expandableContent is passed and toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<ToolCall {...defaultProps} expandableContent="Expandable Content" />);
    await user.click(screen.getByRole('button', { name: defaultProps.titleText }));

    expect(screen.getByText('Expandable Content')).toBeVisible();
  });

  it('Passes expandableSectionProps to ExpandableSection', () => {
    render(
      <ToolCall
        {...defaultProps}
        expandableContent="Expandable Content"
        expandableSectionProps={{ id: 'expandable-section-test-id', isExpanded: true }}
      />
    );
    expect(screen.getByRole('region').parentElement).toHaveAttribute('id', 'expandable-section-test-id');
  });

  it('Renders "run" action button by default', () => {
    render(<ToolCall {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Run tool' })).toBeVisible();
  });

  it('Renders "cancel" action button by default', () => {
    render(<ToolCall {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  it('Does not render "run" action button when isLoading is true', () => {
    render(<ToolCall {...defaultProps} isLoading />);
    expect(screen.queryByRole('button', { name: 'Run tool' })).not.toBeInTheDocument();
  });

  it('Does not render "cancel" action button when isLoading is true', () => {
    render(<ToolCall {...defaultProps} isLoading />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('Renders runButtonText when passed', () => {
    render(<ToolCall {...defaultProps} runButtonText="Run my custom tool" />);
    expect(screen.getByRole('button', { name: 'Run my custom tool' })).toBeVisible();
  });

  it('Renders cancelButtonText when passed', () => {
    render(<ToolCall {...defaultProps} cancelButtonText="Cancel my custom tool" />);
    expect(screen.getByRole('button', { name: 'Cancel my custom tool' })).toBeVisible();
  });

  it('Passes runButtonProps to Button', () => {
    render(<ToolCall {...defaultProps} runButtonProps={{ id: 'run-button-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' })).toHaveAttribute('id', 'run-button-test-id');
  });

  it('Passes cancelButtonProps to Button', () => {
    render(<ToolCall {...defaultProps} cancelButtonProps={{ id: 'cancel-button-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('id', 'cancel-button-test-id');
  });

  it('Passes runActionItemProps to ActionListItem', () => {
    render(<ToolCall {...defaultProps} runActionItemProps={{ id: 'run-action-item-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).parentElement).toHaveAttribute(
      'id',
      'run-action-item-test-id'
    );
  });

  it('Passes cancelActionItemProps to ActionListItem', () => {
    render(<ToolCall {...defaultProps} cancelActionItemProps={{ id: 'cancel-action-item-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Cancel' }).parentElement).toHaveAttribute(
      'id',
      'cancel-action-item-test-id'
    );
  });

  it('Passes actionListProps to ActionList', () => {
    render(<ToolCall {...defaultProps} actionListProps={{ id: 'action-list-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).closest('#action-list-test-id')).toBeVisible();
  });

  it('Passes actionListGroupProps to ActionListGroup', () => {
    render(<ToolCall {...defaultProps} actionListGroupProps={{ id: 'action-list-group-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).closest('#action-list-group-test-id')).toBeVisible();
  });

  it('Passes actionListItemProps to ActionListItem for default actions', () => {
    render(<ToolCall {...defaultProps} actionListItemProps={{ className: 'action-list-item-test-class' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).parentElement).toHaveClass('action-list-item-test-class');
    expect(screen.getByRole('button', { name: 'Cancel' }).parentElement).toHaveClass('action-list-item-test-class');
  });

  it('Renders custom actions instead of default actions when actions are passed', () => {
    render(
      <ToolCall
        {...defaultProps}
        actions={[<div key="custom-action-1">Custom action 1</div>, <div key="custom-action-2">Custom action 2</div>]}
      />
    );

    expect(screen.getByText('Custom action 1')).toBeVisible();
    expect(screen.getByText('Custom action 2')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Run tool' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('Passes actionListItemProps to ActionListItem for custom actions', () => {
    render(
      <ToolCall
        {...defaultProps}
        actions={[<div key="custom-action-1">Custom action 1</div>, <div key="custom-action-2">Custom action 2</div>]}
        actionListItemProps={{ className: 'action-list-item-test-class' }}
      />
    );
    expect(screen.getByText('Custom action 1').parentElement).toHaveClass('action-list-item-test-class');
    expect(screen.getByText('Custom action 2').parentElement).toHaveClass('action-list-item-test-class');
  });

  it('Passes cardProps to Card', () => {
    render(<ToolCall {...defaultProps} cardProps={{ id: 'card-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).closest('#card-test-id')).toBeVisible();
  });

  it('Passes cardBodyProps to CardBody', () => {
    render(<ToolCall {...defaultProps} cardBodyProps={{ id: 'card-body-test-id' }} />);
    expect(screen.getByText(defaultProps.titleText).closest('#card-body-test-id')).toBeVisible();
  });

  it('Passes cardFooterProps to CardFooter', () => {
    render(<ToolCall {...defaultProps} cardFooterProps={{ id: 'card-footer-test-id' }} />);
    expect(screen.getByRole('button', { name: 'Run tool' }).closest('#card-footer-test-id')).toBeVisible();
  });

  it('Renders collapsed by default when expandableContent is provided', () => {
    render(<ToolCall {...defaultProps} expandableContent="Expandable Content" />);

    expect(screen.getByRole('button', { name: defaultProps.titleText })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Expandable Content')).not.toBeVisible();
  });

  it('Renders expanded when isDefaultExpanded is true', () => {
    render(<ToolCall {...defaultProps} isDefaultExpanded expandableContent="Expandable Content" />);

    expect(screen.getByRole('button', { name: defaultProps.titleText })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Expandable Content')).toBeVisible();
  });

  it('expandableSectionProps.isExpanded overrides isDefaultExpanded', () => {
    render(
      <ToolCall
        {...defaultProps}
        isDefaultExpanded={false}
        expandableContent="Expandable Content"
        expandableSectionProps={{ isExpanded: true }}
      />
    );

    expect(screen.getByRole('button', { name: defaultProps.titleText })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Expandable Content')).toBeVisible();
  });

  it('expandableSectionProps.onToggle overrides internal onToggle behavior', async () => {
    const user = userEvent.setup();
    const customOnToggle = jest.fn();

    render(
      <ToolCall
        {...defaultProps}
        isDefaultExpanded={false}
        expandableContent="Expandable Content"
        expandableSectionProps={{ onToggle: customOnToggle }}
      />
    );

    const toggleButton = screen.getByRole('button', { name: defaultProps.titleText });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(customOnToggle).toHaveBeenCalledTimes(1);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Expandable Content')).not.toBeVisible();
  });

  it('should render titleText as markdown when isTitleMarkdown is true', () => {
    const titleText = '**Bold title**';
    const { container } = render(<ToolCall titleText={titleText} isTitleMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold title')).toBeTruthy();
  });

  it('should not render titleText as markdown when isTitleMarkdown is false', () => {
    const titleText = '**Bold title**';
    render(<ToolCall titleText={titleText} />);
    expect(screen.getByText('**Bold title**')).toBeTruthy();
  });

  it('should render expandableContent as markdown when isExpandableContentMarkdown is true', async () => {
    const user = userEvent.setup();
    const expandableContent = '**Bold expandable content**';
    const { container } = render(
      <ToolCall {...defaultProps} expandableContent={expandableContent} isExpandableContentMarkdown />
    );
    await user.click(screen.getByRole('button', { name: defaultProps.titleText }));
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold expandable content')).toBeTruthy();
  });

  it('should not render expandableContent as markdown when isExpandableContentMarkdown is false', async () => {
    const user = userEvent.setup();
    const expandableContent = '**Bold expandable content**';
    render(<ToolCall {...defaultProps} expandableContent={expandableContent} />);
    await user.click(screen.getByRole('button', { name: defaultProps.titleText }));
    expect(screen.getByText('**Bold expandable content**')).toBeTruthy();
  });

  it('should pass markdownContentProps to MarkdownContent component', () => {
    const titleText = '**Bold title**';
    const { container } = render(
      <ToolCall titleText={titleText} isTitleMarkdown markdownContentProps={{ isPrimary: true }} />
    );
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });
});
