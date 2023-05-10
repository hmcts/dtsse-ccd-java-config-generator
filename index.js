#!/usr/bin/env node

const { resolveFiles, generateFile } = require('./fs');
const { getFields } = require('./transform');
const nunjucks = require('nunjucks');
const { generateEventClasses } = require("./event-classes-generator");

const PACKAGE = 'uk.gov.hmcts.reform.fpl';

const fileFileTypeFieldId = {
  './Jurisdiction.json': [field => field.ID, 'jurisdiction'],
  './CaseType.json': [field => field.ID, 'caseTypes'],
  '**/AuthorisationCaseState.json': [field => `${field.CaseStateID}:${field.UserRole}`, 'statePermissions'],
  '**/AuthorisationCaseType.json': [field => field.UserRole, 'caseTypePermissions'],
  '**/CaseField.json': [field => field.ID, 'fields'],
  '**/CaseRoles.json': [field => field.ID, 'casePermissions'],
  '**/SearchInputFields.json': [field => field.CaseFieldID, 'searchInputs'],
  '**/SearchResultFields.json': [field => field.CaseFieldID, 'searchResults'],
  'State.json': [field => field.ID, 'states'],
  'State/**/State.json': [field => field.ID, 'states'],
  '**/WorkBasketInputFields.json': [field => field.CaseFieldID, 'wbInputs'],
  '**/WorkBasketResultFields.json': [field => field.CaseFieldID, 'wbResults'],
  '**/AuthorisationCaseEvent.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  'AuthorisationCaseEvent/**/*.json': [field => `${field.CaseEventID}:${field.AccessControl}`, 'eventPermissions'],
  'AuthorisationCaseField/**/*.json': [field => `${field.CaseFieldID}:${field.UserRole}`, 'fieldPermissions'],
  'CaseEvent/**/*.json': [field => field.ID, 'events'],
  'ComplexTypes/*.json': [field => `${field.ID}:${field.ListElementCode}`, 'complexTypes'],
  'CaseEventToFields/*.json': [field => `${field.CaseFieldID}:${field.CaseEventID}`, 'eventFields'],
  'CaseTypeTab/*.json': [field => `${field.TabID}:${field.CaseFieldID}:${field.UserRole}`, 'caseTypeTab'],
  'FixedLists/*.json': [field => `${field.ID}:${field.ListElementCode}`, 'fixedLists']
};

const jsonConfig = Object.entries(fileFileTypeFieldId)
  .flatMap(resolveFiles)
  .map(getFields)
  .reduce(
    (prev, curr) => ({ ...prev, [curr.type]: [...prev[curr.type] || [], ...curr.fields] }),
    {});

nunjucks.configure('templates', { autoescape: true });

const context = {
  packageName: PACKAGE,
  className: "MainCcdConfig"
};
const jurisdiction = jsonConfig['jurisdiction'];
context["jurisdiction"] = jurisdiction[Object.keys(jurisdiction)[0]];

context["caseTypes"] = [];
Object.entries(jsonConfig['caseTypes']).forEach((caseType, index) => {
  context["caseTypes"][index] = { ...caseType[1] };
})
const res = nunjucks.render('MainConfigTemplate.java', context);
generateFile(context.className, res);

generateEventClasses(jsonConfig, PACKAGE);

