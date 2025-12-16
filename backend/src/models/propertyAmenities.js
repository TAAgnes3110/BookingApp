const { DataTypes } = require('sequelize');

const PropertyAmenities = (sequelize) => {
  const propertyAmenities = sequelize.define('property_amenities', {
    property_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'properties',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    amenity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'amenities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'property_amenities',
    timestamps: false
  });

  return propertyAmenities;
};

module.exports = PropertyAmenities;
