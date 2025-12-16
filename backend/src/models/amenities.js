const { DataTypes } = require('sequelize');

const Amenities = (sequelize) => {
  const amenities = sequelize.define('amenities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    icon: {
      type: DataTypes.STRING(50)
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: 'general'
    }
  }, {
    tableName: 'amenities',
    timestamps: false
  });

  return amenities;
};

module.exports = Amenities;
