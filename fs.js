const { globSync } = require('glob');
const { existsSync, writeFile } = require('fs');

const masterDir = 'definition/';

const loadFile = path => existsSync(path) ? require("./" + path) : [];

const getFilename = path => path.replace(masterDir, '');

const resolveFiles = ([file, fileTypeGetFieldId]) => {
  const masterFiles = globSync(masterDir + file);
  const allFiles = [...masterFiles].map(getFilename);

  return allFiles
    .map(file => [file, loadFile(masterDir + file), fileTypeGetFieldId]);
};

const generateFile = (fileName, content) => {

  writeFile('generated/'+fileName+'.java', content, err => {
    if (err) {
      console.error(err);
    }
    console.log(`File ${fileName}.java generated successfully`);
  });

};

module.exports = { resolveFiles, generateFile };
