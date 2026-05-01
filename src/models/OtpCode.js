const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OtpCode = sequelize.define('OtpCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('email_verification', 'password_reset'),
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = OtpCode;
