const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Image = sequelize.define('Image', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.TEXT, allowNull: false },
  // activityId se agrega via asociaciones en models/index.js
});

module.exports = Image;
