const { DataTypes } = require('sequelize');

const Reviews = (sequelize) => {
  const reviews = sequelize.define('reviews', {
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
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    property_id: {
      type: DataTypes.UUID,
      references: {
        model: 'properties',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    cleanliness: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    accuracy: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    communication: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    check_in: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    value: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT
    },
    response: {
      type: DataTypes.TEXT
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reviews',
    timestamps: false
  });

  return reviews;
};

module.exports = Reviews;
