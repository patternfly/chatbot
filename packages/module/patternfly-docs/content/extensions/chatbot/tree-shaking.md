---
id: Tree-shaking
title: Tree-shaking
section: extensions
subsection: ChatBot
sortValue: 80
source: TreeShaking
---

**Note:** The PatternFly ChatBot extension lives in its own package [`@patternfly/chatbot`](https://www.npmjs.com/package/@patternfly/chatbot).

When you add ChatBot to your application, you want the bundler to include only the components you actually use — not the entire library or every PatternFly icon. ChatBot is designed to support tree-shaking when imported correctly.

---

## Recommended import pattern

Import each component from its dynamic entry point:

```tsx
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import ChatbotHeader from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
```

Named imports from the root barrel also tree-shake with modern bundlers:

```tsx
import { ChatbotToggle } from '@patternfly/chatbot';
```

Sub-components can be imported from the same entry point:

```tsx
import ChatbotHeader, {
  ChatbotHeaderMenu,
  ChatbotHeaderMain,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
```

Per-component `dist/dynamic` imports are preferred for faster builds and for components excluded from the root barrel (`CodeModal`, `PreviewAttachment`, `AttachmentEdit`).

## What to avoid

Do **not** use wildcard imports from the package root:

```tsx
// Avoid — may pull in the entire library
import * as Chatbot from '@patternfly/chatbot';
```

## Icon imports

Which PatternFly icons end up in your bundle depends on **which ChatBot components you import**, not on whether ChatBot source code or your app uses barrel or deep icon paths. Importing `ChatbotToggle` via `dist/dynamic` includes only the icons that component uses.

## CSS import

ChatBot styles are side-effectful and must be imported explicitly:

```tsx
import '@patternfly/chatbot/dist/css/main.css';
```

Place this import after your PatternFly CSS imports so ChatBot overrides apply correctly.

## Monaco editor (`CodeModal`, attachment preview and edit)

`CodeModal` (used by `PreviewAttachment` and `AttachmentEdit`) lazy-loads Monaco. Web workers must be configured before the modal opens. Import the package worker helper once at application startup:

```tsx
import '@patternfly/chatbot/monaco-environment';
import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
```

`CodeModal`, `PreviewAttachment`, and `AttachmentEdit` are excluded from the root barrel so Monaco stays out of root-barrel bundles. Import them from dynamic entry points:

```tsx
import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
```

`monaco-editor` and `@monaco-editor/react` are peer dependencies when you use these components.

## Markdown rendering (`Message`, `MarkdownContent`)

`MarkdownContent` lazy-loads its markdown parser so lightweight imports avoid pulling in `react-markdown`, syntax highlighting, and related dependencies until they are needed. That async chunk is roughly 400 KB.

`MessageBox` automatically preloads the markdown renderer and coordinates rendering so existing messages do not each flash an individual loading state — message chrome (avatars, timestamps, and so on) appears immediately, and markdown content fills in once the chunk is ready.

For chatbots that display messages on first render, you can call `preloadMarkdownRenderer()` earlier in your application — such as in your app's entry point or route loader — so the chunk is already loaded by the time the chatbot mounts:

```tsx
// App.tsx or route loader — call once at startup
import { preloadMarkdownRenderer } from '@patternfly/chatbot/dist/dynamic/MarkdownContent';

preloadMarkdownRenderer();
```

## Migration: root barrel changes

The following modules are **not** re-exported from the root barrel (`@patternfly/chatbot`). They were removed so Monaco and internal utilities stay out of default bundles. Update existing root imports to subpath entry points:

| Module | Before (no longer works) | After |
|--------|--------------------------|-------|
| `CodeModal` | `import { CodeModal } from '@patternfly/chatbot'` | `import CodeModal from '@patternfly/chatbot/dist/dynamic/CodeModal'` |
| `PreviewAttachment` | `import { PreviewAttachment } from '@patternfly/chatbot'` | `import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment'` |
| `AttachmentEdit` | `import { AttachmentEdit } from '@patternfly/chatbot'` | `import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit'` |
| `tracking` | `import { getTrackingProviders } from '@patternfly/chatbot'` | `import { getTrackingProviders } from '@patternfly/chatbot/dist/dynamic/tracking'` |

All other components remain available from the root barrel and continue to tree-shake when your bundler respects the package `sideEffects` field.

When using `CodeModal`, `PreviewAttachment`, or `AttachmentEdit`, also import the Monaco worker helper once at application startup:

```tsx
import '@patternfly/chatbot/monaco-environment';
```

## How ChatBot supports tree-shaking

- **ESM output** with a `module` field pointing to `dist/esm/`
- **`sideEffects`** in `package.json` so bundlers can drop unused re-exports from the root barrel while preserving CSS and the documentation-site style entry (`patternfly-docs/**`)
- **Per-component dynamic entry points** at `dist/dynamic/<Component>/`
- **Unbundled compilation** — icons and dependencies remain as external imports for your bundler to resolve
- **`exports`** field maps public subpaths for bundler-friendly resolution
- **Explicit CSS imports** (see above)
