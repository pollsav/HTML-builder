const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const mainDirPath = path.join(__dirname, 'assets');
const copyDirPath = path.join(__dirname, 'project-dist', 'assets');

const writeHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), {
  encoding: 'utf8',
});
const writeStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {
  encoding: 'utf8',
});
mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

async function copyDir(src, copy) {
  try {
    await mkdir(copy, { recursive: true });

    const files = await fs.promises.readdir(src);

    for (const file of files) {
      const srcPath = path.join(src, file);
      const copyPath = path.join(copy, file);
      const stats = await fs.promises.stat(srcPath);

      if (stats.isDirectory()) {
        await copyDir(srcPath, copyPath);
      } else {
        await copyFile(srcPath, copyPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles() {
  const allFiles = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const filteredStyles = allFiles.filter((file) => path.extname(file) === '.css');

  for (const file of filteredStyles) {
    const contentFile = await fs.promises.readFile(path.join(__dirname, 'styles', file), {
      encoding: 'utf8',
    });
    writeStyles.write(contentFile + '\n');
  }
}

async function createHtmlBundle() {
  try {
    const htmlTemplate = await readFile(path.join(__dirname, 'template.html'), {
      encoding: 'utf8',
    });
    const htmlComponent = htmlTemplate.match(/{{.*}}/gi);
    let replacedHtml = htmlTemplate;

    for (let nameComponent of htmlComponent) {
      const component = await readFile(
        path.join(__dirname, 'components', `${nameComponent.replace(/{{|}}/g, '')}.html`),
        { encoding: 'utf8' },
      );
      replacedHtml = replacedHtml.replace(nameComponent, component);
    }
    writeHtml.write(replacedHtml);
  } catch (err) {
    console.error(err);
  }
}
copyDir(mainDirPath, copyDirPath);
mergeStyles();
createHtmlBundle();
