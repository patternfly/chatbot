import { screen } from '@testing-library/react';

/** Waits for lazy-loaded markdown to render and asserts bold text. */
export async function expectBoldMarkdownText(text: string) {
  await import('../MarkdownContent/MarkdownRenderer');
  const element = await screen.findByText(text, {}, { timeout: 10000 });
  expect(element.closest('strong')).not.toBeNull();
}
