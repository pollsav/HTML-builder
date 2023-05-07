const fs = require('fs');
const path = require('path');

const writeStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), {
  encoding: 'utf8',
});

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
mergeStyles();
