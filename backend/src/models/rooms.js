const { DataTypes } = require('sequelize');

const Rooms = (sequelize) => {
  const rooms = sequelize.define('rooms', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    base_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    max_adults: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    max_children: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    size_sqm: {
      type: DataTypes.INTEGER
    },
    bed_config: {
      type: DataTypes.JSONB
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'rooms',
    timestamps: false
  });

  return rooms;
};

module.exports = Rooms;
