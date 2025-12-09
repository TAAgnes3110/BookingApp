const models = {};

const initModels = (sequelize) => {
  models.User = require('./user.model')(sequelize);
  // Add other models here

  // Setup associations if any
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

module.exports = { initModels, models };

