const { generateFile } = require('./fs');
const { groupBy, transformJson } = require('./transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

const jsonDataMappings = {
  '**/AuthorisationCaseField.json': [field => `${field.CaseFieldID}:${field.AccessControl}`, 'fieldPermissions'],
  'AuthorisationCaseField/**/*.json': [field => `${field.CaseFieldID}:${field.AccessControl}`, 'fieldPermissions'],
  '**/CaseField.json': [field => field.ID, 'fields'],
  'CaseField/**/*.json': [field => field.ID, 'fields']
};

const generateModelClasses = (basePackage, service) => {

  const jsonConfig = transformJson(jsonDataMappings);

  const context = {
    packageName: `${basePackage}.${service}.model`,
    className: "CaseData",
  };

  const res = nunjucks.render('CaseDataTemplate.java', context);
  generateFile(`${service}/model/CaseData`, res);
};

module.exports = { generateModelClasses };
