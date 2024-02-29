const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');

const root = process.cwd();

const ENV_AGNOSTIC_ROOT = `${root}/src`

const sourceFiles = glob.sync(path.resolve(__dirname, './src/*/index.ts'))

async function generateIndex(files) {
  // ensure the dynamic root exists
  fse.ensureDirSync(path.resolve(ENV_AGNOSTIC_ROOT));

  const destFile = `${ENV_AGNOSTIC_ROOT}/index.ts`;

  const stream = fse.createWriteStream(destFile);
  stream.once('open', () => {
    stream.write('// this file is autogenerated by generate-index.js, modifying it manually will have no effect\n');

    files.forEach(file => {
      const name = file.replace('/index.ts', '').split('/').pop();
      stream.write(`\nexport { default as ${name} } from './${name}';\n`);
      stream.write(`export * from './${name}';\n`);
    });
    stream.end();
  });

  return Promise.resolve();
}

async function run(files) {
  try {
    await generateIndex(files);

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}
  
run(sourceFiles);
  