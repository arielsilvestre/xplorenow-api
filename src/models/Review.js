const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  stars: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.STRING(300) },
  // userId y activityId se agregan via asociaciones en models/index.js
}, {
  indexes: [{ unique: true, fields: ['userId', 'activityId'] }],
});

module.exports = Review;
