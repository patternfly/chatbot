import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkdownContent from './MarkdownContent';
import rehypeExternalLinks from '../__mocks__/rehype-external-links';

const BOLD_TEXT = '**Bold text**';
const ITALIC_TEXT = '*Italic text*';
const INLINE_CODE = 'Here is inline code: `const x = 5`';
const CODE_BLOCK = `\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\``;
const HEADING = '# Heading 1';
const LINK = '[PatternFly](https://www.patternfly.org/)';
const UNORDERED_LIST = `
* Item 1
* Item 2
* Item 3
`;
const ORDERED_LIST = `
1. First item
2. Second item
3. Third item
`;
const TABLE = `
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
const BLOCKQUOTE = '> This is a blockquote';
const IMAGE = '![Alt text](https://example.com/image.png)';

describe('MarkdownContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render bold text correctly', () => {
    const { container } = render(<MarkdownContent content={BOLD_TEXT} />);
    expect(container.querySelector('strong')).toBeTruthy();
    expect(screen.getByText('Bold text')).toBeTruthy();
  });

  it('should render italic text correctly', () => {
    const { container } = render(<MarkdownContent content={ITALIC_TEXT} />);
    expect(container.querySelector('em')).toBeTruthy();
    expect(screen.getByText('Italic text')).toBeTruthy();
  });

  it('should render inline code correctly', () => {
    render(<MarkdownContent content={INLINE_CODE} />);
    expect(screen.getByText(/const x = 5/)).toBeTruthy();
  });

  it('should render code blocks correctly', () => {
    render(<MarkdownContent content={CODE_BLOCK} />);
    expect(screen.getByText(/function hello/)).toBeTruthy();
    expect(screen.getByText(/console.log/)).toBeTruthy();
  });

  it('should render headings correctly', () => {
    render(<MarkdownContent content={HEADING} />);
    expect(screen.getByRole('heading', { name: /Heading 1/i })).toBeTruthy();
  });

  it('should render links correctly', () => {
    render(<MarkdownContent content={LINK} />);
    expect(screen.getByRole('link', { name: /PatternFly/i })).toBeTruthy();
  });

  it('should render unordered lists correctly', () => {
    render(<MarkdownContent content={UNORDERED_LIST} />);
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
    expect(screen.getByText('Item 3')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('should render ordered lists correctly', () => {
    render(<MarkdownContent content={ORDERED_LIST} />);
    expect(screen.getByText('First item')).toBeTruthy();
    expect(screen.getByText('Second item')).toBeTruthy();
    expect(screen.getByText('Third item')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('should render tables correctly', () => {
    render(<MarkdownContent content={TABLE} tableProps={{ 'aria-label': 'Test table' }} />);
    expect(screen.getByRole('grid', { name: /Test table/i })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Column 1/i })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Column 2/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 1/i })).toBeTruthy();
    expect(screen.getByRole('cell', { name: /Cell 2/i })).toBeTruthy();
  });

  it('should render blockquotes correctly', () => {
    render(<MarkdownContent content={BLOCKQUOTE} />);
    expect(screen.getByText(/This is a blockquote/)).toBeTruthy();
  });

  it('should render images when hasNoImages is false', () => {
    render(<MarkdownContent content={IMAGE} hasNoImages={false} />);
    expect(screen.getByRole('img', { name: /Alt text/i })).toBeTruthy();
  });

  it('should not render images when hasNoImages is true', () => {
    render(<MarkdownContent content={IMAGE} hasNoImages />);
    expect(screen.queryByRole('img', { name: /Alt text/i })).toBeFalsy();
  });

  it('should disable markdown rendering when isMarkdownDisabled is true', () => {
    render(<MarkdownContent content={BOLD_TEXT} isMarkdownDisabled />);
    expect(screen.getByText('**Bold text**')).toBeTruthy();
  });

  it('should render text component when isMarkdownDisabled is true and textComponent is provided', () => {
    const textComponent = <div data-testid="custom-text">Custom text component</div>;
    render(<MarkdownContent content={BOLD_TEXT} isMarkdownDisabled textComponent={textComponent} />);
    expect(screen.getByTestId('custom-text')).toBeTruthy();
    expect(screen.getByText('Custom text component')).toBeTruthy();
  });

  it('should apply isPrimary prop to elements', () => {
    const { container } = render(<MarkdownContent content={INLINE_CODE} isPrimary />);
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });

  it('should apply shouldRetainStyles prop to elements', () => {
    const { container } = render(<MarkdownContent content={BOLD_TEXT} shouldRetainStyles />);
    expect(container.querySelector('.pf-m-markdown')).toBeTruthy();
  });

  it('should pass codeBlockProps to code blocks', () => {
    render(<MarkdownContent content={CODE_BLOCK} codeBlockProps={{ 'aria-label': 'Custom code block' }} />);
    expect(screen.getByRole('button', { name: /Custom code block/i })).toBeTruthy();
  });

  it('should pass tableProps to tables', () => {
    render(<MarkdownContent content={TABLE} tableProps={{ 'aria-label': 'Custom table label' }} />);
    expect(screen.getByRole('grid', { name: /Custom table label/i })).toBeTruthy();
  });

  it('should open links in new tab when openLinkInNewTab is true', () => {
    render(<MarkdownContent content={LINK} openLinkInNewTab />);
    expect(rehypeExternalLinks).toHaveBeenCalledTimes(1);
  });

  it('should not open links in new tab when openLinkInNewTab is false', () => {
    render(<MarkdownContent content={LINK} openLinkInNewTab={false} />);
    expect(rehypeExternalLinks).not.toHaveBeenCalled();
  });

  it('should pass linkProps to links', async () => {
    const onClick = jest.fn();
    render(<MarkdownContent content={LINK} linkProps={{ onClick }} />);
    const link = screen.getByRole('link', { name: /PatternFly/i });
    link.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle reactMarkdownProps.disallowedElements', () => {
    render(<MarkdownContent content={CODE_BLOCK} reactMarkdownProps={{ disallowedElements: ['code'] }} />);
    // Code block should not render when disallowed
    expect(screen.queryByRole('button', { name: /Copy code/i })).toBeFalsy();
  });

  it('should render plain text when no markdown is present', () => {
    render(<MarkdownContent content="Plain text without markdown" />);
    expect(screen.getByText('Plain text without markdown')).toBeTruthy();
  });

  it('should handle empty content', () => {
    const { container } = render(<MarkdownContent content="" />);
    expect(container.textContent).toBe('');
  });

  it('should handle undefined content', () => {
    const { container } = render(<MarkdownContent />);
    expect(container.textContent).toBe('');
  });

  it('should render multiple markdown elements together', () => {
    const content = `# Heading

**Bold text** and *italic text*

\`\`\`javascript
const x = 5;
\`\`\`

[Link](https://example.com)`;

    render(<MarkdownContent content={content} />);
    expect(screen.getByRole('heading', { name: /Heading/i })).toBeTruthy();
    expect(screen.getByText('Bold text')).toBeTruthy();
    expect(screen.getByText('italic text')).toBeTruthy();
    expect(screen.getByText(/const x = 5/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Link/i })).toBeTruthy();
  });
});
