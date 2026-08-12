# ChatBot Tree-Shaking Demo

This package verifies that `@patternfly/chatbot` tree-shakes correctly and demonstrates the recommended import patterns for production applications.

## Quick start

From the repository root:

```bash
# Build the ChatBot library first
npm run build -w @patternfly/chatbot

# Run the analysis (builds scenarios and prints a report)
npm run analyze:tree-shaking
```

## Verification results

Running the analysis against Vite 6 confirms tree-shaking is working:

| Scenario | JS size | Icons | ChatBot components |
|----------|---------|-------|--------------------|
| ChatbotToggle only (root barrel) | ~184 KB | 4 | 1 |
| ChatbotToggle only (`dist/dynamic`) | ~184 KB | 4 | 1 |
| Multi-component UI (7 imports) | ~895 KB | 49 | 17 |

**Key takeaway:** Root barrel and `dist/dynamic` imports tree-shake to the same size. `dist/dynamic` imports are preferred for faster builds and for components excluded from the root barrel (`CodeModal`, `PreviewAttachment`, `AttachmentEdit`).

## Scenarios

### 1. Dynamic per-component import (recommended)

```tsx
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
```

### 2. Root barrel import

```tsx
import { ChatbotToggle } from '@patternfly/chatbot';
```

Named imports from the root barrel tree-shake correctly when your bundler respects the package `sideEffects` field.

## Correct setup checklist

1. Import components from `dist/dynamic/<ComponentName>` or the root barrel
2. Import CSS once from: `@patternfly/chatbot/dist/css/main.css` and `@patternfly/react-core/dist/styles/base.css`
3. Import Monaco-related components from `dist/dynamic/<Component>` only

## Migration: root barrel changes

`CodeModal`, `PreviewAttachment`, `AttachmentEdit`, and `tracking` are no longer exported from the root barrel. Update imports as follows:

| Module | Before | After |
|--------|--------|-------|
| `CodeModal` | `import { CodeModal } from '@patternfly/chatbot'` | `import CodeModal from '@patternfly/chatbot/dist/dynamic/CodeModal'` |
| `PreviewAttachment` | `import { PreviewAttachment } from '@patternfly/chatbot'` | `import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment'` |
| `AttachmentEdit` | `import { AttachmentEdit } from '@patternfly/chatbot'` | `import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit'` |
| `tracking` | `import { getTrackingProviders } from '@patternfly/chatbot'` | `import { getTrackingProviders } from '@patternfly/chatbot/dist/dynamic/tracking'` |


## Files

```
src/barrel/         ChatbotToggle via root barrel
src/dynamic/        ChatbotToggle via dist/dynamic import
src/full/           Multi-component ChatBot UI
scripts/            Build and analysis tooling
dist/               Output bundles + stats.html treemaps
```
