// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  verbose: true,
  coverageDirectory: './coverage/',
  collectCoverage: true,
  // most of these are to fix https://github.com/remarkjs/react-markdown/issues/635
  transformIgnorePatterns: [
    'node_modules/(?!@patternfly|@data-driven-forms|remark-gfm|react-markdown|remark-parse|devlop|hast-util-to-jsx-runtime|comma-separated-tokens|estree-util-is-identifier-name|hast-util-whitespace|property-information|space-separated-tokens|unist-util-position|vfile-message|unist-util-stringify-position|html-url-attributes|mdast-util-from-markdown|mdast-util-to-string|micromark|decode-named-character-reference|remark-rehype|mdast-util-to-hast|trim-lines|unist-util-visit|unist-util-is|unified|bail|is-plain-obj|trough|vfile|mdast-util-gfm|ccount|mdast-util-find-and-replace|escape-string-regexp|markdown-table|mdast-util-to-markdown|zwitch|longest-streak|mdast-util-phrasing)'
    // Uncomment the below line if you face any errors with jest
    // '/node_modules/(?!@redhat-cloud-services)',
  ],
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.js',
    '!<rootDir>/packages/**/stories/*',
    '!<rootDir>/packages/**/index.js',
    '!<rootDir>/packages/**/*{c|C}ontext*.js',
    '!<rootDir>/packages/components/src/Components/Table/*',
    '<rootDir>/packages/**/src/**/*.tsx'
  ],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.js', 'jest-canvas-mock'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost:5000/'
  },
  setupFiles: ['./jest.setup.js'],
  roots: ['<rootDir>/packages/'],
  // modulePathIgnorePatterns: ['<rootDir>/packages/create-crc-app/templates', '<rootDir>/packages/docs/.cache'],
  modulePathIgnorePatterns: [
    '<rootDir>/packages/*.*/dist/*.*',
    '<rootDir>/packages/*.*/public/*.*',
    '<rootDir>/packages/*.*/.cache/*.*'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^lodash-es$': 'lodash',
    customReact: 'react',
    reactRedux: 'react-redux',
    PFReactCore: '@patternfly/react-core',
    PFReactTable: '@patternfly/react-table'
  },
  globalSetup: '<rootDir>/config/globalSetup.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './packages/module/tsconfig.json' }],
    // Ensure ES modules are transformed
    '^.+\\.js$': 'babel-jest'
  }
};
