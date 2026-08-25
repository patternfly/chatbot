/* global globalThis */
// Docs-site worker setup for rspack/webpack. Paths target hoisted monaco-editor in the
// workspace root (../../../node_modules/...). npm consumers should import
// @patternfly/chatbot/monaco-environment instead (../../monaco-editor/... layout).
// Each branch must use inline new Worker(new URL(...)) so rspack emits worker chunks.
const workerOptions = { type: 'module' };

if (typeof globalThis !== 'undefined' && !globalThis.MonacoEnvironment?.getWorker) {
  globalThis.MonacoEnvironment = {
    getWorker(_workerId, label) {
      switch (label) {
        case 'json':
          return new Worker(
            new URL('../../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
            workerOptions
          );
        case 'css':
        case 'scss':
        case 'less':
          return new Worker(
            new URL('../../../node_modules/monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url),
            workerOptions
          );
        case 'html':
        case 'handlebars':
        case 'razor':
          return new Worker(
            new URL('../../../node_modules/monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url),
            workerOptions
          );
        case 'typescript':
        case 'javascript':
          return new Worker(
            new URL('../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
            workerOptions
          );
        default:
          return new Worker(
            new URL('../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            workerOptions
          );
      }
    }
  };
}
