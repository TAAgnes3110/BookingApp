const { DataTypes } = require('sequelize');

const PropertyApprovals = (sequelize) => {
  const propertyApprovals = sequelize.define('property_approvals', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    reviewed_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    admin_notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'property_approvals',
    timestamps: false
  });

  return propertyApprovals;
};

module.exports = PropertyApprovals;
