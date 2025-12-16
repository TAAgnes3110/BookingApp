const { DataTypes } = require('sequelize');

const Locations = (sequelize) => {
  const locations = sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'Vietnam',
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'locations',
    timestamps: false
  });

  return locations;
};

module.exports = Locations;
