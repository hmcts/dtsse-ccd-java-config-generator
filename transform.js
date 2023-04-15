
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

const getFields = ([filename, masterDef, fileTypeGetFieldId]) => {
  const masterWithoutBlacklistedKeys = masterDef.map(removeBlacklistedKeys);
  const masterKeys = masterWithoutBlacklistedKeys.reduce((keys, item) => ({ ...keys, ...item }), {});
  const masterAndBranchKeys = masterKeys;
  const keys = Object.keys(masterAndBranchKeys);
  const masterWithConsistentKeys = masterWithoutBlacklistedKeys.map(ensureKeys(keys));
  const masterFields = groupBy(masterWithConsistentKeys, fileTypeGetFieldId[0]);
  const masterFieldKeys = Object.keys(masterFields);

  return { [fileTypeGetFieldId[1]]: masterFields };
};

module.exports = { getFields };
