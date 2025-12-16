const { DataTypes } = require('sequelize');

const Coupons = (sequelize) => {
  const coupons = sequelize.define('coupons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    discount_type: {
      type: DataTypes.STRING(20),
      defaultValue: 'percentage'
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    max_usage: {
      type: DataTypes.INTEGER
    },
    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    start_date: {
      type: DataTypes.DATE
    },
    end_date: {
      type: DataTypes.DATE
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'coupons',
    timestamps: false
  });

  return coupons;
};

module.exports = Coupons;
