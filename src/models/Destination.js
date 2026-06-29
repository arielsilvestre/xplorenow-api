const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  country: { type: DataTypes.STRING },
});

module.exports = Destination;
