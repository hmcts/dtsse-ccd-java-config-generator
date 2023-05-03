
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

const getFields = ([masterDef, fileTypeGetFieldId]) => {
  const masterWithoutBlacklistedKeys = masterDef.map(removeBlacklistedKeys);
  const masterKeys = masterWithoutBlacklistedKeys.reduce((keys, item) => ({ ...keys, ...item }), {});
  const keys = Object.keys(masterKeys);
  const masterWithConsistentKeys = masterWithoutBlacklistedKeys.map(ensureKeys(keys));
  const masterFields = groupBy(masterWithConsistentKeys, fileTypeGetFieldId[0]);

  return { type: [fileTypeGetFieldId[1]], fields: masterFields };
};

module.exports = { getFields };
