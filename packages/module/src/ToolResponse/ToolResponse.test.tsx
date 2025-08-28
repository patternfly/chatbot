import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ToolResponse from './ToolResponse';

describe('ToolResponse', () => {
  const defaultProps = {
    collapsedToggleText: 'Show details',
    expandedToggleText: 'Hide details',
    cardTitle: 'Title',
    cardBody: 'Body'
  };

  it('should render with required props only', () => {
    render(<ToolResponse {...defaultProps} />);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByText('Hide details')).toBeTruthy();
  });

  it('should render expanded by default', () => {
    render(<ToolResponse {...defaultProps} />);
    expect(screen.getByText('Hide details')).toBeTruthy();
    expect(screen.queryByText('Show details')).toBeFalsy();
  });

  it('should toggle between expanded and collapsed states', async () => {
    const user = userEvent.setup();
    render(<ToolResponse {...defaultProps} />);
    const toggleButton = screen.getByRole('button', { name: /Hide details/i });
    expect(screen.getByText('Hide details')).toBeTruthy();
    await user.click(toggleButton);
    expect(screen.getByText('Show details')).toBeTruthy();
    expect(screen.queryByText('Hide details')).toBeFalsy();

    // Click to expand again
    await user.click(screen.getByRole('button', { name: /Show details/i }));
    expect(screen.getByText('Hide details')).toBeTruthy();
    expect(screen.queryByText('Show details')).toBeFalsy();
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
});
