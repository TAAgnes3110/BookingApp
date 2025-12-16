const { DataTypes } = require('sequelize');

const RoomAvailability = (sequelize) => {
  const roomAvailability = sequelize.define('room_availability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_id: {
      type: DataTypes.UUID,
      references: {
        model: 'rooms',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price_override: {
      type: DataTypes.DECIMAL(15, 2)
    },
    booked_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'room_availability',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['room_id', 'date']
      }
    ]
  });

  return roomAvailability;
};

module.exports = RoomAvailability;
