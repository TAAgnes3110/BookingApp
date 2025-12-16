const { DataTypes } = require('sequelize');

const PropertyImages = (sequelize) => {
  const propertyImages = sequelize.define(
    'property_images',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      property_id: {
        type: DataTypes.UUID,
        references: {
          model: 'properties',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      caption: {
        type: DataTypes.STRING(100)
      },
      is_main: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      tableName: 'property_images',
      timestamps: false
    }
  );

  return propertyImages;
}

module.exports = PropertyImages;
