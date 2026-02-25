import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DeepThinking from './DeepThinking';

describe('DeepThinking', () => {
  const defaultProps = {
    toggleContent: 'Show thinking'
  };

  it('should render with required props only', () => {
    render(<DeepThinking {...defaultProps} />);
    expect(screen.getByText('Show thinking')).toBeTruthy();
  });

  it('should render subheading when provided', () => {
    const subheading = 'Thought for 3 seconds';
    render(<DeepThinking {...defaultProps} subheading={subheading} />);
    expect(screen.getByText(subheading)).toBeTruthy();
  });

  it('should render body content when provided', () => {
    const body = "Here's why I think that";
    render(<DeepThinking {...defaultProps} body={body} />);
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

    render(<DeepThinking {...defaultProps} body={body} />);
    expect(screen.getByText('Complex body content')).toBeTruthy();
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });

  it('should apply custom className from cardProps', () => {
    const { container } = render(
      <DeepThinking {...defaultProps} cardProps={{ className: 'custom-tool-response-class' }} />
    );
    expect(container.querySelector('.custom-tool-response-class')).toBeTruthy();
  });

  it('should pass through expandableSectionProps', () => {
    render(<DeepThinking {...defaultProps} expandableSectionProps={{ className: 'custom-expandable-class' }} />);
    expect(document.querySelector('.custom-expandable-class')).toBeTruthy();
  });

  it('should not render subheading span when subheading is not provided', () => {
    const { container } = render(<DeepThinking {...defaultProps} />);
    const subheadingContainer = container.querySelector('.pf-chatbot__tool-response-subheading');
    expect(subheadingContainer).toBeFalsy();
  });

  it('should pass through cardBodyProps', () => {
    render(
      <DeepThinking {...defaultProps} body="Thinking content" cardBodyProps={{ className: 'custom-card-body-class' }} />
    );

    const cardBody = screen.getByText('Thinking content').closest('.pf-v6-c-card__body');
    expect(cardBody).toHaveClass('custom-card-body-class');
  });

  it('Renders expanded by default', () => {
    render(<DeepThinking {...defaultProps} body="Thinking content" />);

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Thinking content')).toBeVisible();
  });

  it('Renders collapsed when isDefaultExpanded is false', () => {
    render(<DeepThinking isDefaultExpanded={false} {...defaultProps} body="Thinking content" />);

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Thinking content')).not.toBeVisible();
  });

  it('expandableSectionProps.isExpanded overrides isDefaultExpanded', () => {
    render(
      <DeepThinking
        {...defaultProps}
        isDefaultExpanded={false}
        body="Thinking content"
        expandableSectionProps={{ isExpanded: true }}
      />
    );

    expect(screen.getByRole('button', { name: defaultProps.toggleContent })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Thinking content')).toBeVisible();
  });

  it('expandableSectionProps.onToggle overrides internal onToggle behavior', async () => {
    const user = userEvent.setup();
    const customOnToggle = jest.fn();

    render(
      <DeepThinking
        {...defaultProps}
        isDefaultExpanded={false}
        body="Thinking content"
        expandableSectionProps={{ onToggle: customOnToggle }}
      />
    );

    const toggleButton = screen.getByRole('button', { name: defaultProps.toggleContent });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(customOnToggle).toHaveBeenCalled();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Thinking content')).not.toBeVisible();
  });

  it('should render toggleContent as markdown when isToggleContentMarkdown is true', () => {
    const toggleContent = '**Bold thinking**';
    const { container } = render(<DeepThinking toggleContent={toggleContent} isToggleContentMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold thinking')).toBeTruthy();
  });

  it('should not render toggleContent as markdown when isToggleContentMarkdown is false', () => {
    const toggleContent = '**Bold thinking**';
    const { container } = render(<DeepThinking toggleContent={toggleContent} />);
    expect(container.querySelector('strong')).toBeFalsy();
    expect(screen.getByText('**Bold thinking**')).toBeTruthy();
  });

  it('should render subheading as markdown when isSubheadingMarkdown is true', () => {
    const subheading = '**Bold subheading**';
    const { container } = render(<DeepThinking {...defaultProps} subheading={subheading} isSubheadingMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold subheading')).toBeTruthy();
  });

  it('should not render subheading as markdown when isSubheadingMarkdown is false', () => {
    const subheading = '**Bold subheading**';
    render(<DeepThinking {...defaultProps} subheading={subheading} />);
    expect(screen.getByText('**Bold subheading**')).toBeTruthy();
  });

  it('should render body as markdown when isBodyMarkdown is true', () => {
    const body = '**Bold body**';
    const { container } = render(<DeepThinking {...defaultProps} body={body} isBodyMarkdown />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold body')).toBeTruthy();
  });

  it('should not render body as markdown when isBodyMarkdown is false', () => {
    const body = '**Bold body**';
    render(<DeepThinking {...defaultProps} body={body} />);
    expect(screen.getByText('**Bold body**')).toBeTruthy();
  });

  it('should pass markdownContentProps to MarkdownContent component', () => {
    const body = '**Bold body**';
    const { container } = render(
      <DeepThinking {...defaultProps} body={body} isBodyMarkdown markdownContentProps={{ isPrimary: true }} />
    );
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });

  it('should render spinner when isLoading is true', () => {
    render(<DeepThinking {...defaultProps} isLoading />);
    expect(screen.getByLabelText('Contents')).toBeInTheDocument();
  });

  it('should not render spinner when isLoading is false', () => {
    render(<DeepThinking {...defaultProps} />);
    expect(screen.queryByLabelText('Contents')).not.toBeInTheDocument();
  });

  it('should pass spinnerProps to Spinner component', () => {
    render(<DeepThinking {...defaultProps} isLoading spinnerProps={{ 'aria-label': 'Custom label' }} />);
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  it('should not render spinner when isToggleContentMarkdown is true', () => {
    const toggleContent = '**Bold thinking**';
    render(<DeepThinking toggleContent={toggleContent} isToggleContentMarkdown isLoading />);

    expect(screen.queryByLabelText('Contents')).not.toBeInTheDocument();
    expect(screen.getByText('Bold thinking')).toBeInTheDocument();
  });
});
