/* eslint-env jest */
const fse = require('fs-extra');
const os = require('os');
const path = require('path');

const { BARREL_EXCLUDE, getModuleName, filterBarrelFiles, generateIndex } = require('./generate-index');

describe('generate-index', () => {
  describe('BARREL_EXCLUDE', () => {
    it('excludes internal modules from the barrel', () => {
      expect(BARREL_EXCLUDE).toEqual(new Set(['AttachmentEdit', 'CodeModal', 'PreviewAttachment', 'tracking']));
    });
  });

  describe('getModuleName', () => {
    it('extracts the module name from an index.ts path', () => {
      expect(getModuleName('/project/src/Chatbot/index.ts')).toBe('Chatbot');
      expect(getModuleName('/project/src/tracking/index.ts')).toBe('tracking');
    });
  });

  describe('filterBarrelFiles', () => {
    const files = [
      '/project/src/AttachmentEdit/index.ts',
      '/project/src/Chatbot/index.ts',
      '/project/src/CodeModal/index.ts',
      '/project/src/PreviewAttachment/index.ts',
      '/project/src/tracking/index.ts'
    ];

    it('removes excluded modules from the file list', () => {
      expect(filterBarrelFiles(files)).toEqual(['/project/src/Chatbot/index.ts']);
    });
  });

  describe('generateIndex', () => {
    let tempDir;

    beforeEach(async () => {
      tempDir = await fse.mkdtemp(path.join(os.tmpdir(), 'generate-index-test-'));
    });

    afterEach(async () => {
      await fse.remove(tempDir);
    });

    it('writes exports for included modules and skips excluded ones', async () => {
      const files = [
        '/project/src/AttachmentEdit/index.ts',
        '/project/src/Chatbot/index.ts',
        '/project/src/CodeModal/index.ts',
        '/project/src/PreviewAttachment/index.ts',
        '/project/src/tracking/index.ts'
      ];

      await generateIndex(files, tempDir);

      const indexContents = await fse.readFile(path.join(tempDir, 'index.ts'), 'utf8');

      expect(indexContents).toContain("export { default as Chatbot } from './Chatbot';");
      expect(indexContents).toContain("export * from './Chatbot';");
      expect(indexContents).not.toContain('AttachmentEdit');
      expect(indexContents).not.toContain('CodeModal');
      expect(indexContents).not.toContain('PreviewAttachment');
      expect(indexContents).not.toContain('tracking');
    });
  });
});
