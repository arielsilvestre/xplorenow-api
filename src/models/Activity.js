const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    get() { return parseFloat(this.getDataValue('price')); },
  },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  category: {
    type: DataTypes.ENUM('tour', 'free_tour', 'excursion', 'experience'),
    defaultValue: 'tour',
  },
  duration: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING, defaultValue: 'Español' },
  meetingPoint: { type: DataTypes.STRING },
  whatsIncluded: { type: DataTypes.TEXT },
  cancellationPolicy: { type: DataTypes.TEXT },
  // destinationId y guideId se agregan via asociaciones en models/index.js
});

module.exports = Activity;
