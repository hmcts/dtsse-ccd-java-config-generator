const { generateFile } = require('../fs');
const { groupBy, transformJson } = require('../transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

const OFFSET = "caseworker-publiclaw-".length;

const jsonDataMappings = {
  '**/AuthorisationCaseEvent.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  '**/AuthorisationCaseEvent/**/*.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  '**/CaseEvent.json': [field => field.ID, 'events'],
  '**/CaseEvent/**/*.json': [field => field.ID, 'events'],
  '**/CaseEventToFields.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  '**/CaseEventToFields/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  '**/CaseEventToComplexTypes.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
  '**/CaseEventToComplexTypes/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
};

const generateEventClasses = (basePackage, service) => {

  const jsonConfig = transformJson(jsonDataMappings);

  let allPermissions = [];

  jsonConfig['events'].forEach(event => {
    const permissions = groupBy(jsonConfig["eventPermissions"], field => field.CaseEventID)[event['ID']]
      .map(permission => ({ ...permission, role: permission["UserRole"].slice(OFFSET).toUpperCase() }));

    const fields = groupBy(jsonConfig["eventFields"], field => field.CaseEventID)[event['ID']]
      .map(field => ({ ...field, fieldName: `get${field["CaseFieldID"][0].toUpperCase()}${field["CaseFieldID"].slice(1)}`  }));

    const crudImports = new Set(
      permissions.map(permission => permission["CRUD"])
    );

    const context = {
      packageName: `${basePackage}.${service}`,
      className: event['ID'][0].toUpperCase() + event['ID'].slice(1),
      event,
      fields,
      permissions,
      crudImports
    };

    allPermissions = [...permissions];

    const res = nunjucks.render('EventTemplate.java', context);
    generateFile(`${service}/${context.className}`, res);
  })
  const res = nunjucks.render('UserRolesTemplate.java', {
    packageName: `${basePackage}.${service}.enums`,
    allPermissions
  });
  generateFile(`${service}/enums/UserRole`, res);
};

module.exports = { generateEventClasses };
