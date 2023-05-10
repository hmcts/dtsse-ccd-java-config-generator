const { generateFile } = require('./fs');
const { groupBy } = require('./transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

const fileFileTypeFieldId = {
  '**/AuthorisationCaseEvent.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  'AuthorisationCaseEvent/**/*.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  '**/CaseEvent.json': [field => field.ID, 'events'],
  'CaseEvent/**/*.json': [field => field.ID, 'events'],
  '**/CaseEventToFields.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  'CaseEventToFields/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  '**/CaseEventToComplexTypes.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
  '**/CaseEventToComplexTypes/**/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventComplexTypes'],
};

const generateEventClasses = (jsonConfig, pkgName) => {

  jsonConfig['events'].forEach(event => {
    const permissions = groupBy(
      jsonConfig["eventPermissions"],
      field => field.CaseEventID
    )[event['ID']]['AccessControl'];

    const context = {
      packageName: pkgName,
      className: event['ID'][0].toUpperCase() + event['ID'].slice(1),
      event,
      permissions
    };

    const res = nunjucks.render('EventConfigTemplate.java', context);
    generateFile(context.className, res);
  })
};

module.exports = { generateEventClasses };
