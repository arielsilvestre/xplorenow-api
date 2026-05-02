const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FavoriteDestination = sequelize.define('FavoriteDestination', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  // userId y destinationId se agregan via asociaciones en models/index.js
}, {
  indexes: [{ unique: true, fields: ['userId', 'destinationId'] }],
});

module.exports = FavoriteDestination;
