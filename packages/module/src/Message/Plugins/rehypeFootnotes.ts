import { visit } from 'unist-util-visit';

export const rehypeFootnotes = () => (tree) => {
  const visitedFootnotes = new Set();

  visit(tree, 'element', (node, index, parent) => {
    // Each footnote backref generates an li with N footnote backrefs
    if (node.tagName === 'li') {
      if (!visitedFootnotes.has(node.properties.id)) {
        visitedFootnotes.add(node.properties.id);
      }
    }
    // The class name is added by remark-gfm and is pretty standard
    if (
      node.tagName === 'a' &&
      node.properties.className &&
      node.properties.className.includes('data-footnote-backref')
    ) {
      // Get the ID of the footnote from the href
      const backrefId = node.properties.href.replace('#', '').replace('fnref', 'fn');

      // Check if we have already seen a back-reference for this footnote.
      // If it is a repeat, it will not be in the list exactly
      // Footnote id will be bot-message-fn-1, and there will be backrefs
      // bot-message-fnref-1 and bot-message-fnref-1-2, etc.
      if (!visitedFootnotes.has(backrefId)) {
        if (parent && parent.children) {
          parent.children.splice(index, 1);
        }
      }
    }
  });
};
