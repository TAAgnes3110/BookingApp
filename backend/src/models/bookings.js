const { DataTypes } = require('sequelize');

const Bookings = (sequelize) => {
  const bookings = sequelize.define('bookings', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    property_id: {
      type: DataTypes.UUID,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    room_id: {
      type: DataTypes.UUID,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    final_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    guest_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'unpaid'
    },
    cancellation_policy: {
      type: DataTypes.STRING(50),
      defaultValue: 'flexible'
    },
    special_requests: {
      type: DataTypes.TEXT
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'bookings',
    timestamps: false
  });

  return bookings;
};

module.exports = Bookings;
