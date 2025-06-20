import { visit } from 'unist-util-visit';
import { Element } from 'hast';
import { Node } from 'unist';

// Rehype plugin to add language information to code block props
// Per Eric, Ideally any toggle buttons that can be navigated to would have unique accessible names
// For the purposes of our examples this should suffice, but in a real-world use case they may need to be more unique
export const rehypeCodeBlockToggle = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'code' && node.properties?.className) {
      const className = node.properties.className as string[];
      const languageMatch = className.find((cls) => cls.startsWith('language-'));

      if (languageMatch) {
        const language = languageMatch.replace('language-', '').toUpperCase();

        // Add the language and toggle text as data attributes
        node.properties['data-language'] = language;
        node.properties['data-expanded-text'] = `Show less ${language} code`;
        node.properties['data-collapsed-text'] = `Show more ${language} code`;
      }
    }
  });
};
