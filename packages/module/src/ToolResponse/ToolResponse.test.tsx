import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ToolResponse from './ToolResponse';

describe('ToolResponse', () => {
  const defaultProps = {
    toggleContent: 'Tool response: toolName',
    cardTitle: 'Title',
    cardBody: 'Body'
  };

  it('should render with required props only', () => {
    render(<ToolResponse {...defaultProps} />);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByText('Tool response: toolName')).toBeTruthy();
  });

  it('should render subheading when provided', () => {
    const subheading = 'Tool execution result';
    render(<ToolResponse {...defaultProps} subheading={subheading} />);
    expect(screen.getByText(subheading)).toBeTruthy();
  });

  it('should render body content when provided', () => {
    const body = 'This is the tool response body content';
    render(<ToolResponse {...defaultProps} body={body} />);
    expect(screen.getByText(body)).toBeTruthy();
  });

  it('should render with complex content including React elements', () => {
    const body = (
      <div>
        <p>Complex body content</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    );
    const cardTitle = <strong>API Response</strong>;
    const cardBody = (
      <div>
        <code>{"{ status: 'success' }"}</code>
      </div>
    );

    render(<ToolResponse {...defaultProps} body={body} cardTitle={cardTitle} cardBody={cardBody} />);
    expect(screen.getByText('Complex body content')).toBeTruthy();
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
    expect(screen.getByText('API Response')).toBeTruthy();
    expect(screen.getByText("{ status: 'success' }")).toBeTruthy();
  });

  it('should apply custom className from cardProps', () => {
    const { container } = render(
      <ToolResponse {...defaultProps} cardProps={{ className: 'custom-tool-response-class' }} />
    );
    expect(container.querySelector('.custom-tool-response-class')).toBeTruthy();
  });

  it('should pass through expandableSectionProps', () => {
    render(<ToolResponse {...defaultProps} expandableSectionProps={{ className: 'custom-expandable-class' }} />);
    expect(document.querySelector('.custom-expandable-class')).toBeTruthy();
  });

  it('should pass through toolResponseCardProps', () => {
    render(<ToolResponse {...defaultProps} toolResponseCardProps={{ className: 'custom-card-class' }} />);
    expect(document.querySelector('.custom-card-class')).toBeTruthy();
  });

  it('should not render subheading span when subheading is not provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} />);
    const subheadingContainer = container.querySelector('.pf-chatbot__tool-response-subheading');
    expect(subheadingContainer).toBeFalsy();
  });

  it('should not render card when cardTitle and cardBody are not provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} cardTitle={undefined} cardBody={undefined} />);
    expect(container.querySelector('.pf-chatbot__tool-response-card')).toBeFalsy();
  });

  it('should render card when only cardTitle is provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} cardBody={undefined} />);
    expect(container.querySelector('.pf-chatbot__tool-response-card')).toBeTruthy();
  });

  it('should render card when only cardBody is provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} cardTitle={undefined} />);
    expect(container.querySelector('.pf-chatbot__tool-response-card')).toBeTruthy();
  });

  it('should render divider when cardBody and cardTitle are provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} />);
    expect(container.querySelector('.pf-v6-c-divider')).toBeTruthy();
  });

  it('should not render divider when only cardBody is provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} cardTitle={undefined} />);
    expect(container.querySelector('.pf-v6-c-divider')).toBeFalsy();
  });

  it('should not render divider when only cardTitle is provided', () => {
    const { container } = render(<ToolResponse {...defaultProps} cardBody={undefined} />);
    expect(container.querySelector('.pf-v6-c-divider')).toBeFalsy();
  });

  it('Renders expanded by default', () => {
    render(<ToolResponse {...defaultProps} />);

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(defaultProps.cardTitle)).toBeVisible();
    expect(screen.getByText(defaultProps.cardBody)).toBeVisible();
  });

  it('Renders collapsed when isDefaultExpanded is false', () => {
    render(<ToolResponse isDefaultExpanded={false} {...defaultProps} />);

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(defaultProps.cardTitle)).not.toBeVisible();
    expect(screen.getByText(defaultProps.cardBody)).not.toBeVisible();
  });

  it('expandableSectionProps.isExpanded overrides isDefaultExpanded', () => {
    render(<ToolResponse {...defaultProps} isDefaultExpanded={false} expandableSectionProps={{ isExpanded: true }} />);

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(defaultProps.cardTitle)).toBeVisible();
    expect(screen.getByText(defaultProps.cardBody)).toBeVisible();
  });

  it('expandableSectionProps.onToggle overrides internal onToggle behavior', async () => {
    const user = userEvent.setup();
    const customOnToggle = jest.fn();

    render(
      <ToolResponse {...defaultProps} isDefaultExpanded={false} expandableSectionProps={{ onToggle: customOnToggle }} />
    );

    const toggleButton = screen.getByRole('button', { name: defaultProps.toggleContent });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(customOnToggle).toHaveBeenCalledTimes(1);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(defaultProps.cardTitle)).not.toBeVisible();
    expect(screen.getByText(defaultProps.cardBody)).not.toBeVisible();
  });

  it('should render toggleContent as markdown when isToggleContentMarkdown is true', () => {
    const toggleContent = '**Bold toggle**';
    const { container } = render(
      <ToolResponse {...defaultProps} toggleContent={toggleContent} isToggleContentMarkdown />
    );
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold toggle')).toBeTruthy();
  });

  it('should not render toggleContent as markdown when isToggleContentMarkdown is false', () => {
    const toggleContent = '**Bold toggle**';
    render(<ToolResponse {...defaultProps} toggleContent={toggleContent} />);
    expect(screen.getByText('**Bold toggle**')).toBeTruthy();
  });

  it('should render subheading as markdown when isSubheadingMarkdown is true', () => {
    const subheading = '**Bold subheading**';
    const { container } = render(<ToolResponse {...defaultProps} subheading={subheading} isSubheadingMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold subheading')).toBeTruthy();
  });

  it('should not render subheading as markdown when isSubheadingMarkdown is false', () => {
    const subheading = '**Bold subheading**';
    render(<ToolResponse {...defaultProps} subheading={subheading} />);
    expect(screen.getByText('**Bold subheading**')).toBeTruthy();
  });

  it('should render body as markdown when isBodyMarkdown is true', () => {
    const body = '**Bold body**';
    const { container } = render(<ToolResponse {...defaultProps} body={body} isBodyMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold body')).toBeTruthy();
  });

  it('should not render body as markdown when isBodyMarkdown is false', () => {
    const body = '**Bold body**';
    render(<ToolResponse {...defaultProps} body={body} />);
    expect(screen.getByText('**Bold body**')).toBeTruthy();
  });

  it('should render cardTitle as markdown when isCardTitleMarkdown is true', () => {
    const cardTitle = '**Bold card title**';
    const { container } = render(<ToolResponse {...defaultProps} cardTitle={cardTitle} isCardTitleMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold card title')).toBeTruthy();
  });

  it('should not render cardTitle as markdown when isCardTitleMarkdown is false', () => {
    const cardTitle = '**Bold card title**';
    render(<ToolResponse {...defaultProps} cardTitle={cardTitle} />);
    expect(screen.getByText('**Bold card title**')).toBeTruthy();
  });

  it('should render cardBody as markdown when isCardBodyMarkdown is true', () => {
    const cardBody = '**Bold card body**';
    const { container } = render(<ToolResponse {...defaultProps} cardBody={cardBody} isCardBodyMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold card body')).toBeTruthy();
  });

  it('should not render cardBody as markdown when isCardBodyMarkdown is false', () => {
    const cardBody = '**Bold card body**';
    render(<ToolResponse {...defaultProps} cardBody={cardBody} />);
    expect(screen.getByText('**Bold card body**')).toBeTruthy();
  });

  it('should pass markdownContentProps to MarkdownContent component', () => {
    const body = '**Bold body**';
    const { container } = render(
      <ToolResponse {...defaultProps} body={body} isBodyMarkdown markdownContentProps={{ isPrimary: true }} />
    );
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });
});
