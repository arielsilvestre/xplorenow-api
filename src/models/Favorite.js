const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  // userId y activityId se agregan via asociaciones en models/index.js
}, {
  indexes: [{ unique: true, fields: ['userId', 'activityId'] }],
});

module.exports = Favorite;
