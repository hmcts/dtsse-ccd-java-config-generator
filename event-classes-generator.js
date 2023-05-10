const { generateFile } = require('./fs');
const { groupBy, transformJson } = require('./transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

const jsonDataMappings = {
  '**/AuthorisationCaseEvent.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  'AuthorisationCaseEvent/**/*.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  '**/CaseEvent.json': [field => field.ID, 'events'],
  'CaseEvent/**/*.json': [field => field.ID, 'events'],
  '**/CaseEventToFields.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  'CaseEventToFields/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  '**/CaseEventToComplexTypes.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
  '**/CaseEventToComplexTypes/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
};

const generateEventClasses = (basePackage, service) => {

  const jsonConfig = transformJson(jsonDataMappings);

  jsonConfig['events'].forEach(event => {
    const permissions = groupBy(
      jsonConfig["eventPermissions"],
      field => field.CaseEventID
    )[event['ID']]['AccessControl'];

    const context = {
      packageName: `${basePackage}.${service}`,
      className: event['ID'][0].toUpperCase() + event['ID'].slice(1),
      event,
      permissions
    };

    const res = nunjucks.render('EventConfigTemplate.java', context);
    generateFile(`${service}/${context.className}`, res);
  })
  const res = nunjucks.render('UserRolesTemplate.java', { packageName: `${basePackage}.${service}.enums` });
  generateFile(`${service}/enums/UserRole`, res);
};

module.exports = { generateEventClasses };
