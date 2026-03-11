const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Availability = sequelize.define('Availability', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  spotsLeft: { type: DataTypes.INTEGER, allowNull: false },
  // activityId se agrega via asociaciones en models/index.js
});

module.exports = Availability;
