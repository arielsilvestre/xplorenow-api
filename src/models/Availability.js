const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Availability = sequelize.define('Availability', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  hour: { type: DataTypes.STRING },
  spotsLeft: { type: DataTypes.INTEGER, allowNull: false },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    get() { return this.getDataValue('precio') ? parseFloat(this.getDataValue('precio')) : null; },
  },
  totalQuota: { type: DataTypes.INTEGER },
  // activityId y guideId se agregan via asociaciones en models/index.js
});

module.exports = Availability;
