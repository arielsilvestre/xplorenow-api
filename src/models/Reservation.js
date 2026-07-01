const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  people: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
  },
  totalPrice: { type: DataTypes.DECIMAL(10, 2) },
  voucherCode: { type: DataTypes.STRING(20), unique: true, allowNull: true },
  checkedIn: { type: DataTypes.BOOLEAN, defaultValue: false },
  checkedInAt: { type: DataTypes.DATE, allowNull: true },
  // userId y activityId se agregan via asociaciones en models/index.js
});

module.exports = Reservation;
