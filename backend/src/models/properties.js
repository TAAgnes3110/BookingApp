const { DataTypes } = require('sequelize');

const Properties = (sequelize) => {
  const properties = sequelize.define('properties', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    host_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    manager_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address_full: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8)
    },
    check_in_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '14:00'
    },
    check_out_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '12:00'
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending_approval'
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rating_avg: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return properties;
};

module.exports = Properties;

