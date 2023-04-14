
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

const getDiff = ([filename, masterDef, getFieldId]) => {
  const masterWithoutBlacklistedKeys = masterDef.map(removeBlacklistedKeys);
  const masterKeys = masterWithoutBlacklistedKeys.reduce((keys, item) => ({ ...keys, ...item }), {});
  const masterAndBranchKeys = masterKeys;
  const keys = Object.keys(masterAndBranchKeys);
  const masterWithConsistentKeys = masterWithoutBlacklistedKeys.map(ensureKeys(keys));
  const masterFields = groupBy(masterWithConsistentKeys, getFieldId);
  const masterFieldKeys = Object.keys(masterFields);


  return { file: filename, masterFields };
};

module.exports = { getDiff };
