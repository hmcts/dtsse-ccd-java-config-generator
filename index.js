#!/usr/bin/env node

const { resolveFiles, generateFile } = require('./fs');
const { getDiff } = require('./diff');
const nunjucks = require('nunjucks');

const fileFieldId = {
  '**/AuthorisationCaseState.json': field => `${field.CaseStateID}:${field.UserRole}`,
  '**/AuthorisationCaseType.json': field => field.UserRole,
  '**/CaseField.json': field => field.ID,
  '**/CaseRoles.json': field => field.ID,
  '**/SearchInputFields.json': field => field.CaseFieldID,
  '**/SearchResultFields.json': field => field.CaseFieldID,
  'State.json': field => field.ID,
  'State/State.json': field => field.ID,
  '**/WorkBasketInputFields.json': field => field.CaseFieldID,
  '**/WorkBasketResultFields.json': field => field.CaseFieldID,
  '**/AuthorisationCaseEvent.json': field => `${field.CaseEventID}:${field.UserRole}`,
  'AuthorisationCaseField/*.json': field => `${field.CaseFieldID}:${field.UserRole}`,
  'ComplexTypes/*.json': field => `${field.ID}:${field.ListElementCode}`,
  'CaseEventToFields/*.json': field => `${field.CaseFieldID}:${field.CaseEventID}`,
  'CaseTypeTab/*.json': field => `${field.TabID}:${field.CaseFieldID}:${field.UserRole}`,
  'FixedLists/*.json': field => `${field.ID}:${field.ListElementCode}`
};

const eventFileFieldId = { 'CaseEvent/*.json': field => field.ID };

const jsonConfig = Object
  .entries(fileFieldId)
  .flatMap(resolveFiles)
  .map(getDiff);

const eventsConfig = Object
  .entries(eventFileFieldId)
  .flatMap(resolveFiles);

nunjucks.configure('templates', { autoescape: true });


eventsConfig.forEach(event => {
  const context = {
    packageName: 'uk.gov.hmcts.ccd.sdk.jsonToJavaConfig',
    className: 'ExampleCcdConfig',
    eventId: event[1][0]['ID'],
    eventName: event[1][0]['Name']
  };
  const res = nunjucks.render('event.java', context);
  generateFile(context.className, res);
})

