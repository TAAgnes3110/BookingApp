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
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
      },
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
      password: {
        type: DataTypes.STRING,
        field: 'password_hash'
      },
      phoneNumber: {
        type: DataTypes.STRING,
        field: 'phone_number'
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        field: 'avatar_url'
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id'
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified'
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_phone_verified'
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
      },
      bio: DataTypes.TEXT,
      addressLine1: {
        type: DataTypes.STRING,
        field: 'address_line1'
      },
      addressLine2: {
        type: DataTypes.STRING,
        field: 'address_line2'
      },
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      zipCode: {
        type: DataTypes.STRING,
        field: 'zip_code'
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
      },
      providerId: {
        type: DataTypes.STRING,
        field: 'provider_id'
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        field: 'last_login_at'
      }
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
