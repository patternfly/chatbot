#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Builds tree-shaking scenarios and reports bundle metrics from source maps.
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const demoRoot = resolve(__dirname, '..');

const scenarios = [
  { id: 'barrel', label: 'ChatbotToggle (root barrel import, source alias)' },
  { id: 'dynamic', label: 'ChatbotToggle (dist/dynamic import, source alias)' },
  { id: 'full', label: 'Multi-component ChatBot UI (dist/dynamic import, source alias)' }
];

function ensureChatbotBuilt() {
  const distIndex = resolve(demoRoot, '../module/dist/esm/index.js');
  if (!existsSync(distIndex)) {
    console.error(
      '\n@patternfly/chatbot dist/ is missing. Build the library before running analysis:\n\n  npm run build -w @patternfly/chatbot\n'
    );
    process.exit(1);
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function collectJsFiles(dir) {
  const files = [];
  if (!existsSync(dir)) {
    return files;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsFiles(fullPath));
    } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.map')) {
      files.push(fullPath);
    }
  }
  return files;
}

function collectSourceMapFiles(dir) {
  const files = [];
  if (!existsSync(dir)) {
    return files;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceMapFiles(fullPath));
    } else if (entry.name.endsWith('.js.map')) {
      files.push(fullPath);
    }
  }
  return files;
}

function analyzeFromSources(sources) {
  const uniqueSources = [...new Set(sources)];

  const iconSources = uniqueSources.filter((s) => s.includes('react-icons') && s.includes('/icons/'));
  const uniqueIcons = [...new Set(iconSources.map((s) => s.split('/icons/').pop()))];

  const chatbotSources = uniqueSources.filter(
    (s) => (s.includes('/chatbot/') || s.includes('/module/')) && (s.includes('/dist/esm/') || s.includes('/src/'))
  );
  const uniqueComponents = [
    ...new Set(
      chatbotSources
        .map((s) => {
          const match = s.match(/\/(?:dist\/esm|src)\/([A-Z][a-zA-Z]+)\//);
          return match ? match[1] : null;
        })
        .filter(Boolean)
    )
  ];

  const monacoSources = uniqueSources.filter((s) => s.includes('monaco'));
  const reactCoreSources = uniqueSources.filter((s) => s.includes('react-core') && s.includes('/components/'));
  const reactCoreComponents = [
    ...new Set(
      reactCoreSources
        .map((s) => {
          const match = s.match(/\/components\/([^/]+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean)
    )
  ].sort();

  return {
    totalSources: uniqueSources.length,
    iconCount: uniqueIcons.length,
    icons: uniqueIcons.sort(),
    chatbotComponentCount: uniqueComponents.length,
    chatbotComponents: uniqueComponents.sort(),
    monacoRefs: monacoSources.length,
    reactCoreComponentCount: reactCoreComponents.length,
    reactCoreComponents
  };
}

function analyzeBundle(scenario) {
  const distDir = join(demoRoot, 'dist', scenario.id);
  const jsFiles = collectJsFiles(distDir);
  const initialFiles = jsFiles.filter((file) => file.includes('/assets/main-'));
  const asyncFiles = jsFiles.filter((file) => !file.includes('/assets/main-'));
  let totalSize = 0;
  let initialSize = 0;
  let asyncSize = 0;
  for (const file of jsFiles) {
    const size = statSync(file).size;
    totalSize += size;
    if (initialFiles.includes(file)) {
      initialSize += size;
    } else {
      asyncSize += size;
    }
  }

  const mapFiles = collectSourceMapFiles(distDir);
  const allSources = [];
  const initialSources = [];
  const asyncSources = [];
  for (const mapFile of mapFiles) {
    const map = JSON.parse(readFileSync(mapFile, 'utf8'));
    const sources = map.sources ?? [];
    allSources.push(...sources);
    if (mapFile.includes('/assets/main-')) {
      initialSources.push(...sources);
    } else {
      asyncSources.push(...sources);
    }
  }
  const mapAnalysis = mapFiles.length ? analyzeFromSources(allSources) : null;
  const initialAnalysis = mapFiles.length ? analyzeFromSources(initialSources) : null;
  const asyncAnalysis = mapFiles.length ? analyzeFromSources(asyncSources) : null;

  return {
    id: scenario.id,
    label: scenario.label,
    jsFileCount: jsFiles.length,
    initialFileCount: initialFiles.length,
    asyncFileCount: asyncFiles.length,
    totalSize,
    initialSize,
    asyncSize,
    ...mapAnalysis,
    initial: initialAnalysis,
    async: asyncAnalysis
  };
}

function printReport(results) {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║         ChatBot Tree-Shaking Verification Report            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  for (const result of results) {
    console.log(`── ${result.label} ──`);
    console.log(`  Bundle size (JS):       ${formatBytes(result.totalSize)}`);
    console.log(
      `    Initial JS:           ${formatBytes(result.initialSize)} (${result.initialFileCount} chunk${result.initialFileCount === 1 ? '' : 's'})`
    );
    console.log(
      `    Async JS:             ${formatBytes(result.asyncSize)} (${result.asyncFileCount} chunk${result.asyncFileCount === 1 ? '' : 's'})`
    );
    console.log(`  Source modules:         ${result.totalSources ?? 'n/a'}`);
    console.log(`  PatternFly icons:       ${result.iconCount ?? 'n/a'}`);
    console.log(`  ChatBot components:     ${result.chatbotComponentCount ?? 'n/a'}`);
    console.log(`  React-Core groups:      ${result.reactCoreComponentCount ?? 'n/a'}`);
    if (result.initial) {
      console.log(
        `  Initial payload only:   ${result.initial.chatbotComponentCount} ChatBot comps, ${result.initial.iconCount} icons, ${result.initial.reactCoreComponentCount} react-core groups`
      );
      if (result.initial.reactCoreComponentCount > 0 && result.initial.reactCoreComponentCount <= 50) {
        console.log(`    Initial react-core:   ${result.initial.reactCoreComponents.join(', ')}`);
      }
    }
    if (result.async && result.async.totalSources > 0) {
      console.log(
        `  Async chunks only:      ${result.async.chatbotComponentCount} ChatBot comps, ${result.async.iconCount} icons, ${result.async.reactCoreComponentCount} react-core groups`
      );
      if (result.async.reactCoreComponentCount > 0 && result.async.reactCoreComponentCount <= 50) {
        console.log(`    Async react-core:     ${result.async.reactCoreComponents.join(', ')}`);
      }
    }
    if (result.reactCoreComponentCount > 0 && result.reactCoreComponentCount <= 50) {
      console.log(`  All react-core:         ${result.reactCoreComponents.join(', ')}`);
    }
    if (result.monacoRefs > 0) {
      console.log(`  Monaco editor refs:     ${result.monacoRefs} ⚠`);
    }
    if (result.iconCount > 0 && result.iconCount <= 30) {
      console.log(`  Icons: ${result.icons.join(', ')}`);
    }
    if (result.chatbotComponentCount > 0 && result.chatbotComponentCount <= 20) {
      console.log(`  Components: ${result.chatbotComponents.join(', ')}`);
    }
    console.log('');
  }

  console.log('Interactive treemap reports:');
  for (const { id } of scenarios) {
    console.log(`  dist/${id}/stats.html`);
  }
  console.log('');
}

console.log('Building tree-shaking demo scenarios...\n');

ensureChatbotBuilt();

for (const scenario of scenarios) {
  process.stdout.write(`  Building "${scenario.id}"...`);
  execSync(`npx vite build --mode ${scenario.id}`, {
    cwd: demoRoot,
    stdio: ['inherit', 'pipe', 'inherit']
  });
  console.log(' done');
}

const results = scenarios.map(analyzeBundle);
printReport(results);
