const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.STRING(50), allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT },
  reserveId: { type: DataTypes.INTEGER, allowNull: true },
  delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
  // userId se agrega via asociaciones en models/index.js
});

module.exports = Notification;
