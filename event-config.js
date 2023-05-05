#!/usr/bin/env node

const { generateFile } = require('./fs');
const { groupBy } = require('./transform');
const nunjucks = require('nunjucks');

nunjucks.configure('templates', { autoescape: true });

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
