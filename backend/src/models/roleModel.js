const { DataTypes } = require('sequelize');

const Roles = (sequelize) => {
  const role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT
      },
      permissions: {
        type: DataTypes.JSONB
      }
    },
    {
      tableName: 'roles',
      timestamps: false
    }
  );

  return role;
};

module.exports = Roles;
