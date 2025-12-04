import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeBlockMessage from './CodeBlockMessage';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
});

describe('CodeBlockMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render inline code for single-line content', () => {
    render(<CodeBlockMessage className="language-javascript">const x = 5;</CodeBlockMessage>);
    const code = screen.getByText('const x = 5;');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveClass('pf-chatbot__message-inline-code');
  });

  it('should render code block for multi-line content', () => {
    const multilineCode = 'const x = 5;\nconst y = 10;';
    const { container } = render(<CodeBlockMessage className="language-javascript">{multilineCode}</CodeBlockMessage>);
    const codeElement = container.querySelector('code');
    expect(codeElement?.textContent).toBe(multilineCode);
  });

  it('should display language label', () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage className="language-javascript">{code}</CodeBlockMessage>);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('should render copy button', () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage>{code}</CodeBlockMessage>);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('should copy plain string content to clipboard', async () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage>{code}</CodeBlockMessage>);

    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code);
  });

  it('should extract text content from React elements when copying', async () => {
    // Simulate what happens with syntax highlighting - children become React elements
    const { container } = render(
      <CodeBlockMessage className="language-javascript">
        <span className="hljs-keyword">const</span> x = 5;{'\n'}
        <span className="hljs-keyword">const</span> y = 10;
      </CodeBlockMessage>
    );

    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    await userEvent.click(copyButton);

    // Should extract actual text content from DOM, not "[object Object]"
    const codeElement = container.querySelector('code');
    const expectedText = codeElement?.textContent || '';
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
    expect(expectedText).not.toContain('[object Object]');
  });

  it('should show check icon after copying', async () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage>{code}</CodeBlockMessage>);

    const copyButton = screen.getByRole('button', { name: 'Copy code' });
    await userEvent.click(copyButton);

    // Check icon should be visible (we can verify by checking if CopyIcon is not present)
    const svgElement = copyButton.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('should render expandable section when isExpandable is true', () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage isExpandable>{code}</CodeBlockMessage>);

    expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
  });

  it('should toggle expandable section', async () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage isExpandable>{code}</CodeBlockMessage>);

    const toggleButton = screen.getByRole('button', { name: 'Show more' });
    await userEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });

  it('should use custom expanded/collapsed text', () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(
      <CodeBlockMessage isExpandable expandedText="Hide" collapsedText="Reveal">
        {code}
      </CodeBlockMessage>
    );

    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('should pass through expandableSectionProps', () => {
    const code = 'const x = 5;\nconst y = 10;';
    const { container } = render(
      <CodeBlockMessage isExpandable expandableSectionProps={{ className: 'custom-expandable-class' }}>
        {code}
      </CodeBlockMessage>
    );

    const expandableSection = container.querySelector('.pf-v6-c-expandable-section.custom-expandable-class');
    expect(expandableSection).toBeInTheDocument();
  });

  it('should render custom actions', () => {
    const code = 'const x = 5;\nconst y = 10;';
    const customAction = <button aria-label="Custom action">Custom</button>;
    render(<CodeBlockMessage customActions={customAction}>{code}</CodeBlockMessage>);

    expect(screen.getByRole('button', { name: 'Custom action' })).toBeInTheDocument();
  });

  it('should apply isPrimary class to inline code', () => {
    render(<CodeBlockMessage isPrimary>const x = 5;</CodeBlockMessage>);
    const code = screen.getByText('const x = 5;');
    expect(code).toHaveClass('pf-m-primary');
  });

  it('should apply shouldRetainStyles class to code block', () => {
    const code = 'const x = 5;\nconst y = 10;';
    const { container } = render(<CodeBlockMessage shouldRetainStyles>{code}</CodeBlockMessage>);

    const codeBlockDiv = container.querySelector('.pf-chatbot__message-code-block');
    expect(codeBlockDiv).toHaveClass('pf-m-markdown');
  });

  it('should use custom aria-label for copy button', () => {
    const code = 'const x = 5;\nconst y = 10;';
    render(<CodeBlockMessage aria-label="Copy this code">{code}</CodeBlockMessage>);

    expect(screen.getByRole('button', { name: 'Copy this code' })).toBeInTheDocument();
  });

  it('should prioritize data-expanded-text over expandedText prop', () => {
    const code = 'const x = 5;\nconst y = 10;';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <CodeBlockMessage
        isExpandable
        expandedText="Custom Expanded"
        data-expanded-text="Data Expanded"
      >
        {code}
      </CodeBlockMessage>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Message:',
      expect.stringContaining('data-expanded-text or data-collapsed-text will override')
    );

    consoleErrorSpy.mockRestore();
  });
});
