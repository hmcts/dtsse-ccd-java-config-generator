#!/usr/bin/env node

const { resolveFiles, generateFile } = require('./fs');
const { getFields } = require('./transform');
const nunjucks = require('nunjucks');

const fileFileTypeFieldId = {
  '**/AuthorisationCaseState.json': [field => `${field.CaseStateID}:${field.UserRole}`, 'statePermissions'],
  '**/AuthorisationCaseType.json': [field => field.UserRole, 'caseTypePermissions'],
  '**/CaseField.json': [field => field.ID, 'fields'],
  '**/CaseRoles.json': [field => field.ID, 'casePermissions'],
  '**/SearchInputFields.json': [field => field.CaseFieldID, 'searchInputs'],
  '**/SearchResultFields.json': [field => field.CaseFieldID, 'searchResults'],
  'State.json': [field => field.ID, 'states'],
  'State/State.json': [field => field.ID, 'states'],
  '**/WorkBasketInputFields.json': [field => field.CaseFieldID, 'wbInputs'],
  '**/WorkBasketResultFields.json': [field => field.CaseFieldID, 'wbResults'],
  '**/AuthorisationCaseEvent.json': [field => `${field.CaseEventID}:${field.UserRole}`, 'eventPermissions'],
  'AuthorisationCaseField/*.json': [field => `${field.CaseFieldID}:${field.UserRole}`, 'fieldPermissions'],
  'CaseEvent/*.json': [field => field.ID, 'events'],
  'ComplexTypes/*.json': [field => `${field.ID}:${field.ListElementCode}`, 'complexTypes'],
  'CaseEventToFields/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  'CaseTypeTab/*.json': [field => `${field.TabID}:${field.CaseFieldID}:${field.UserRole}`, 'caseTypeTab'],
  'FixedLists/*.json': [field => `${field.ID}:${field.ListElementCode}`, 'fixedLists']
};

const eventFileFieldId = { 'CaseEvent/*.json': [field => field.ID, 'events'] };

const jsonConfig = Object
  .entries(fileFileTypeFieldId)
  .flatMap(resolveFiles)
  .map(getFields)
  .reduce((prev, curr) => Object.assign(curr, prev));

const eventsConfig = Object
  .entries(eventFileFieldId)
  .flatMap(resolveFiles);

nunjucks.configure('templates', { autoescape: true });


Object.entries(jsonConfig['events']).forEach(event => {
  const context = {
    packageName: 'uk.gov.hmcts.ccd.sdk.jsonToJavaConfig',
    className: 'ExampleCcdConfig',
    eventId: event[1]['ID'],
    eventName: event[1]['Name']
  };
  const res = nunjucks.render('EventConfigTemplate.java', context);
  generateFile(context.className, res);
})

