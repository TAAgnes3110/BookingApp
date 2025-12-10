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
        type: DataTypes.JSON
      }
    },
    {
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return role;
};

module.exports = Roles;
