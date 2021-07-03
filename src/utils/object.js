const clearUndefinedFields = (obj) => Object.keys(obj).reduce((acc, key) => {
    if (obj[key] === undefined) return acc;

    return {
        ...acc,
        [key]: obj[key]
    }
}, {});

module.exports = {
    clearUndefinedFields
};
