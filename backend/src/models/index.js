const { Sequelize } = require('sequelize');
const userModelDef = require('./userModel');
const roleModelDef = require('./roleModel');
const propertiesModelDef = require('./properties');
const locationsModelDef = require('./locations');
const auditLogsModelDef = require('./audit_logs');
const propertyApprovalsModelDef = require('./propertyApprovals');
const propertyImagesModelDef = require('./propertyImages');
const roomsModelDef = require('./rooms');
const roomAvailabilityModelDef = require('./roomAvailability');
const amenitiesModelDef = require('./amenities');
const propertyAmenitiesModelDef = require('./propertyAmenities');
const bookingsModelDef = require('./bookings');
const couponsModelDef = require('./coupons');
const paymentsModelDef = require('./payments');
const reviewsModelDef = require('./reviews');
const notificationsModelDef = require('./notifications');

const initModels = (sequelize) => {
  const models = {
    User: userModelDef(sequelize, Sequelize.DataTypes),
    Role: roleModelDef(sequelize, Sequelize.DataTypes),
    Properties: propertiesModelDef(sequelize, Sequelize.DataTypes),
    Locations: locationsModelDef(sequelize, Sequelize.DataTypes),
    AuditLogs: auditLogsModelDef(sequelize, Sequelize.DataTypes),
    PropertyApprovals: propertyApprovalsModelDef(sequelize, Sequelize.DataTypes),
    PropertyImages: propertyImagesModelDef(sequelize, Sequelize.DataTypes),
    Rooms: roomsModelDef(sequelize, Sequelize.DataTypes),
    RoomAvailability: roomAvailabilityModelDef(sequelize, Sequelize.DataTypes),
    Amenities: amenitiesModelDef(sequelize, Sequelize.DataTypes),
    PropertyAmenities: propertyAmenitiesModelDef(sequelize, Sequelize.DataTypes),
    Bookings: bookingsModelDef(sequelize, Sequelize.DataTypes),
    Coupons: couponsModelDef(sequelize, Sequelize.DataTypes),
    Payments: paymentsModelDef(sequelize, Sequelize.DataTypes),
    Reviews: reviewsModelDef(sequelize, Sequelize.DataTypes),
    Notifications: notificationsModelDef(sequelize, Sequelize.DataTypes)
  };

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

module.exports = { initModels };
