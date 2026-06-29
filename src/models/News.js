const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define('News', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.TEXT },
  type: {
    type: DataTypes.ENUM('NOTICIA', 'OFERTA', 'DESTINO'),
    defaultValue: 'NOTICIA',
  },
  discount: { type: DataTypes.STRING },
  // activityId e imageId se agregan via asociaciones en models/index.js
});

module.exports = News;
