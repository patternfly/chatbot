import { visit } from 'unist-util-visit';
import { Element } from 'hast';
import { Node } from 'unist';

// Rehype plugin to remove images from within p tags and put them as separate block-level elements.
// This allows us to avoid having a blue background on images - this is something Kayla requested.
export const rehypeMoveImagesOutOfParagraphs = () => (tree: Node) => {
  const nodesToRemove: { parent: Element; index: number; node: Element }[] = [];

  visit(tree, 'element', (node: Element, index: number | null, parent: Element | null) => {
    if (node.tagName === 'p' && node.children) {
      const imagesInParagraph: { node: Element; index: number }[] = [];

      node.children.forEach((child: Node, childIndex: number) => {
        if (child.type === 'element' && (child as Element).tagName === 'img') {
          imagesInParagraph.push({ node: child as Element, index: childIndex });
        }
      });

      if (imagesInParagraph.length > 0 && parent && index !== null) {
        imagesInParagraph.forEach(({ node: imgNode, index: imgIndex }) => {
          nodesToRemove.push({ parent: node, index: imgIndex, node: imgNode });
        });

        // To avoid issues with index shifting during removal, we process in reverse
        for (let i = nodesToRemove.length - 1; i >= 0; i--) {
          const { parent: pTag, index: imgIndexToRemove } = nodesToRemove[i];
          if (pTag.children) {
            pTag.children.splice(imgIndexToRemove, 1);
          }
        }

        // Insert the removed images after the paragraph
        const paragraphIndexInParent = parent.children.indexOf(node);
        if (paragraphIndexInParent !== -1) {
          imagesInParagraph.forEach(({ node: imgNode }) => {
            parent.children.splice(paragraphIndexInParent + 1, 0, imgNode);
          });
        }

        // Remove paragraph if it's now empty after image removal
        if (node.children.length === 0) {
          const paragraphIndexInParent = parent.children.indexOf(node);
          if (paragraphIndexInParent !== -1) {
            parent.children.splice(paragraphIndexInParent, 1);
          }
        }

        nodesToRemove.length = 0;
      }
    }
  });
};
