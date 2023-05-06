const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(secretFolder, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log('Error', err);
        return;
      }
      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.extname(file);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    });
  });
});
