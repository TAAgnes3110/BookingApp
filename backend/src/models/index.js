const { Sequelize } = require('sequelize');
const userModelDef = require('./userModel');
const roleModelDef = require('./roleModel');

const initModels = (sequelize) => {
  const models = {
    User: userModelDef(sequelize, Sequelize.DataTypes),
    Role: roleModelDef(sequelize, Sequelize.DataTypes)
  };

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

module.exports = { initModels };
