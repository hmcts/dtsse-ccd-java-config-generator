const { globSync } = require('glob');
const { existsSync, writeFile } = require('fs');

const DIR = 'definition/';

const loadFile = path => existsSync(path) ? require("./" + path) : [];

const getFilename = path => path.replace(DIR, '');

const resolveFiles = ([file, fileTypeGetFieldId]) => {
  const masterFiles = globSync(DIR + file);
  const allFiles = [...masterFiles].map(getFilename);

  return allFiles
    .map(file => [loadFile(DIR + file), fileTypeGetFieldId]);
};

const generateFile = (fileName, content) => {

  writeFile('src/test/java/uk/gov/hmcts/reform/fpl/'+fileName+'.java', content, err => {
    if (err) {
      console.error(err);
    }
    console.log(`File ${fileName}.java generated successfully`);
  });

};

module.exports = { resolveFiles, generateFile };
