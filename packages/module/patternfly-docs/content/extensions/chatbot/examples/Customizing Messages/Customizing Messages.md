---
# Sidenav top-level section
# should be the same for all markdown files
section: PatternFly-AI
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: Customizing Messages
source: Customizing Messages
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
sortValue: 60
---

# Modifying static content

The ChatBot extension `<Message>` component transforms Markdown to PatternFly React components. We use [react-markdown](https://github.com/remarkjs/react-markdown) to handle this mapping. This library supports both [rehype](https://unifiedjs.com/explore/package/rehype/) and [remark](https://unifiedjs.com/explore/package/remark/) plugins for further customization of the output.

Remark handles parsing Markdown as input and serializing Markdown as output, while rehype does the same for HTML. This allows you to target and make transformations at specific checkpoints in the transformation process: while the text tree is still in Markdown, or while the text tree is in HTML format. For more detailed information on the architecture of this library, see the [react-markdown documentation](https://github.com/remarkjs/react-markdown?tab=readme-ov-file#architecture).

You may need these plugins if, for example, you wanted to change the `href` on a link depending on the link text. The `<Message>` prop `rehypePlugins` will take any custom rehype plugins for the Message component. We use these plugins already within the extension for [rendering images a certain way](https://www.npmjs.com/package/rehype-unwrap-images) and [handling external links](https://www.npmjs.com/package/rehype-external-links). There are many open-source libraries available for other common use cases as well.

If you can't find one for your use case, [Unified](https://unifiedjs.com/) has [a helpful guide](https://unifiedjs.com/learn/guide/create-a-rehype-plugin/) on how to create custom plugins. For a more direct example, if we wanted to change the `href` on links that included the text string `react`, we could write a very basic plugin like this:

```
import { visit } from 'unist-util-visit';

export const rehypeLinkHrefUpdater = (options) => (tree) => {
  visit(tree, 'element', (node) => {
    if (node.tagName === 'a' && node.properties) {
      if (node.properties.href.includes('react')) {
        node.properties.href = '#';
      }
    }
  });
};

```

You could then pass `[rehypeLinkHrefUpdater]` to the `additionalRehypePlugins` prop on `<Message>` to have this applied to all relevant links read by that `<Message>` component.

# Modifying dynamic content

Continuing with our link modification example, let's say you also wanted to add custom onClick events. In this case, you would not use `remark` or `rehype`. These libraries are for static tree manipulation - JavaScript is done through the extension itself.

We offer many props on `<Message>` to allow for passing in custom behavior. As an example, you can use `linkProps` to pass onClick events and other PatternFly `<Button>` props down to links. A very basic example would be `linkProps={{onClick: (event) => console.log(event}}`. This would apply to every link in the Message, but you should be able to grab the event.target and add your own custom onClick logic based on the innerText, innerHTML, or other attributes of the event.target.
