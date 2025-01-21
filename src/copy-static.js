const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', 'static');
const destDir = path.resolve(__dirname, 'static');

fs.copy(sourceDir, destDir)
  .then(() => console.log('Static files copied to src/static'))
  .catch(err => console.error('Error copying static files:', err));
