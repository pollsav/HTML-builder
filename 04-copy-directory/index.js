const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mainDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

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
    console.log('Копирование завершено');
  } catch (err) {
    console.error(err);
  }
}

copyDir(mainDirPath, copyDirPath);
