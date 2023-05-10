const { generateFile } = require('./fs');
const { groupBy, transformJson } = require('./transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

const jsonDataMappings = {
  '**/AuthorisationCaseState.json': [field => `${field.CaseStateID}:${field.AccessControl}`, 'statePermissions'],
  'AuthorisationCaseState/**/*.json': [field => `${field.CaseStateID}:${field.AccessControl}`, 'eventPermissions'],
  '**/State.json': [field => field.ID, 'events'],
  'State/**/*.json': [field => field.ID, 'events']
};

const generateStateClass = (basePackage, service) => {

  const jsonConfig = transformJson(jsonDataMappings);

  const context = {
    packageName: `${basePackage}.${service}.enums`,
    className: "State",
  };

  const res = nunjucks.render('StateTemplate.java', context);
  generateFile(`${service}/enums/${context.className}`, res);
};

module.exports = { generateStateClass };
