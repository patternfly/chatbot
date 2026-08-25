import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import MarkdownContent, {
  preloadMarkdownRenderer,
  whenMarkdownRendererReady
} from '../MarkdownContent/MarkdownContent';

/** Preloads and warms the lazy MarkdownRenderer so synchronous getByText assertions work. */
export async function warmupMarkdownRenderer() {
  preloadMarkdownRenderer();
  await whenMarkdownRendererReady();
  const { unmount } = render(createElement(MarkdownContent, { content: '.' }));
  await screen.findByText('.', {}, { timeout: 10000 });
  unmount();
}

/** Waits for lazy-loaded markdown to render and asserts bold text. */
export async function expectBoldMarkdownText(text: string) {
  const element = await screen.findByText(text, {}, { timeout: 10000 });
  expect(element.closest('strong')).not.toBeNull();
}
