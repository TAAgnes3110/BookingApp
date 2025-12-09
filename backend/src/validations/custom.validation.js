const objectId = (value, helpers) => {
  // For MongoDB ObjectId
  if (value.match(/^[0-9a-fA-F]{24}$/)) {
    return value;
  }
  // For SQL integer IDs
  if (Number.isInteger(Number(value))) {
    return value;
  }
  return helpers.message('"{{#label}}" must be a valid id');
};

module.exports = {
  objectId,
};

