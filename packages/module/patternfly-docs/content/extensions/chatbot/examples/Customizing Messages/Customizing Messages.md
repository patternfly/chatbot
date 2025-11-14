---
# Sidenav top-level section
# should be the same for all markdown files
section: Extensions
subsection: ChatBot
# Sidenav secondary level section
# should be the same for all markdown files
id: Customizing messages
source: Customizing messages
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
sortValue: 60
---

## Modifying static content

The ChatBot extension `<Message>` component transforms Markdown to PatternFly React components via [react-markdown](https://github.com/remarkjs/react-markdown), which supports both [rehype](https://unifiedjs.com/explore/package/rehype/) and [remark](https://unifiedjs.com/explore/package/remark/) plugins for further output customization.

remark parses Markdown as input and serializes Markdown as output, while rehype does the same for HTML. This allows you to target and make transformations at specific checkpoints in the transformation process: either while the text tree is still in Markdown, or while the text tree is in HTML format. For more detailed information on the architecture of this library, see the [react-markdown documentation](https://github.com/remarkjs/react-markdown?tab=readme-ov-file#architecture).

You may need these plugins if, for example, you wanted to change the `href` on a link based on the link text. The `<Message>` prop `rehypePlugins` will accept any custom rehype plugins. We use already use these plugins in ChatBot to [render images a certain way](https://www.npmjs.com/package/rehype-unwrap-images) and [handle external links](https://www.npmjs.com/package/rehype-external-links).

There are many open source libraries available for other common customization needs. If you can't find one for your use case, [Unified](https://unifiedjs.com/) has a helpful [guide on creating custom plugins](https://unifiedjs.com/learn/guide/create-a-rehype-plugin/).
For a more direct example, if we wanted to change the `href` on links that included the text string `react`, we could write a very basic plugin like this:

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

## Modifying dynamic content

Props can also be used to modify dynamic content in messages.

Continuing with our link modification example, let's say you also wanted to add custom `onClick` events. In this case, you would not use `remark` or `rehype`, since they're for static tree manipulation.

Instead, you can utilize ChatBot features to customize dynamic content. We offer many `<Message>` props that allow you to implement custom behavior.
For example, you can use `linkProps` to pass `onClick` events and other PatternFly `<Button>` props down to links. A very basic example would be `linkProps={{onClick: (event) => console.log(event}}`, which would apply to every link in the `<Message>`. Or, you could use the `event.target`, adding your own custom `onClick` logic based on the `innerText`, `innerHTML`, or other attributes of the `event.target`.
