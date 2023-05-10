const {resolveFiles} = require("./fs");

const blacklistedKeys = ['LiveFrom', 'SecurityClassification', 'CaseTypeID', 'DisplayOrder'];

const removeBlacklistedKeys = field => {
  return Object.fromEntries(
    Object.entries(field).filter(([key]) => !blacklistedKeys.includes(key))
  );
};

const ensureKeys = keys => row =>
  keys.reduce((row, key) => ({ [key]: '', ...row }), row);

const groupBy = (values, getId) => values.reduce((result, value) => {
  result[getId(value)] = value;

  return result;
}, {});

const getFields = ([masterDef, fileTypeGetFieldId]) =>
  ({ type: fileTypeGetFieldId[1], fields: masterDef.map(removeBlacklistedKeys) });

const getGroupedFields = ([masterDef, fileTypeGetFieldId]) => {
  const masterWithoutBlacklistedKeys = masterDef.map(removeBlacklistedKeys);
  const masterFields = groupBy(masterWithoutBlacklistedKeys, fileTypeGetFieldId[0]);
  return { type: fileTypeGetFieldId[1], fields: masterFields };
};

const transformJson = fileFileTypeFieldId =>  Object.entries(fileFileTypeFieldId)
  .flatMap(resolveFiles)
  .map(getFields)
  .reduce(
    (prev, curr) => ({ ...prev, [curr.type]: [...prev[curr.type] || [], ...curr.fields] }),
    {});

module.exports = { getFields, getGroupedFields, groupBy, transformJson };
