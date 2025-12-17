const { DataTypes } = require('sequelize');

const User = (sequelize) => {
  const user = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      passwordHash: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      avatarUrl: DataTypes.TEXT,
      role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
      },
      bio: DataTypes.TEXT,
      addressLine1: DataTypes.STRING,
      addressLine2: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
      },
      providerId: DataTypes.STRING,
      lastLoginAt: DataTypes.DATE
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return user;
};

module.exports = User;
