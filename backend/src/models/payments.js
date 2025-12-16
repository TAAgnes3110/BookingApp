const { DataTypes } = require('sequelize');

const Payments = (sequelize) => {
  const payments = sequelize.define('payments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.STRING(20),
      references: {
        model: 'bookings',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    transaction_gateway_id: {
      type: DataTypes.STRING(255)
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'payments',
    timestamps: false
  });

  return payments;
};

module.exports = Payments;
