const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TourGuide = sequelize.define('TourGuide', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT },
  languages: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  photoUrl: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = TourGuide;
