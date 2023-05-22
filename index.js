#!/usr/bin/env node

const { generateFile } = require('./fs');
const nunjucks = require('nunjucks');
const { generateEventClasses } = require("./generators/event-classes-generator");
const { transformJson } = require("./transform");
const {generateStateClass} = require("./generators/state-class-generator");
const {generateModelClasses} = require("./generators/model-classes-generator");

const SERVICE = 'cft';
const BASE_PACKAGE = 'uk.gov.hmcts.reform';

const jsonDataMappings = {
  '**/Jurisdiction.json': [field => field.ID, 'jurisdiction'],
  '**/CaseType.json': [field => field.ID, 'caseTypes'],
  '**/AuthorisationCaseType.json': [field => field.UserRole, 'caseTypePermissions']
};

const jsonConfig = transformJson(jsonDataMappings);

nunjucks.configure('templates', { autoescape: true });

const context = {
  packageName: `${BASE_PACKAGE}.${SERVICE}`,
  className: "MainCcdConfig"
};
const jurisdiction = jsonConfig['jurisdiction'];
context["jurisdiction"] = jurisdiction[Object.keys(jurisdiction)[0]];

context["caseTypes"] = [];
Object.entries(jsonConfig['caseTypes']).forEach((caseType, index) => {
  context["caseTypes"][index] = { ...caseType[1] };
})
const res = nunjucks.render('MainTemplate.java', context);
generateFile(`${SERVICE}/${context.className}`, res);

generateEventClasses(BASE_PACKAGE, SERVICE);
generateModelClasses(BASE_PACKAGE, SERVICE);
generateStateClass(BASE_PACKAGE, SERVICE);

