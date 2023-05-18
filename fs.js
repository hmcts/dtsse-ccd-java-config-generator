const { globSync } = require('glob');
const { existsSync, writeFile } = require('fs');

const JSON_DIR = 'definition/CIVIL_FAMILY_TRIBUNALS';
const JAVA_DIR = 'generated/src/test/java/uk/gov/hmcts/reform';

const loadFile = path => existsSync(path) ? require("./" + path) : [];

const getFilename = path => path.replace(JSON_DIR, '');

const resolveFiles = ([file, fileTypeGetFieldId]) => {
  const masterFiles = globSync(JSON_DIR + file);
  const allFiles = [...masterFiles].map(getFilename);

  return allFiles
    .map(file => [loadFile(JSON_DIR + file), fileTypeGetFieldId]);
};

const generateFile = (fileName, content) => {

  writeFile(`${JAVA_DIR}/${fileName}.java`, content, err => {
    if (err) {
      console.error(err);
    }
    console.log(`File ${fileName}.java generated successfully`);
  });

};

module.exports = { resolveFiles, generateFile };
