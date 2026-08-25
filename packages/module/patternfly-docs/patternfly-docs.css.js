// Patternfly
// Monaco workers for CodeModal attachment examples — load before any editor opens.
// The docs framework aliases this file as the global client entry (client-styles), so
// side-effect imports belong here even though the filename suggests CSS only.
// Uses patternfly-docs/monaco-environment.js (monorepo node_modules paths), not the package export.
// This file must stay side-effectful — see package.json "sideEffects" ("patternfly-docs/**").
import './monaco-environment.js';
import '@patternfly/patternfly/patternfly.css';
// Patternfly utilities
import '@patternfly/patternfly/patternfly-addons.css';
// Global theme CSS
import '@patternfly/documentation-framework/global.css';

// Add your extension CSS below
import '@patternfly/chatbot/dist/css/main.css';
