const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, OtpCode } = require('../models');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./emailService');

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateOtp = async (email, type) => {
  // Invalidar OTPs previos del mismo tipo
  await OtpCode.update({ used: true }, { where: { email, type, used: false } });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

  await OtpCode.create({ email, code, type, expiresAt });
  return code;
};

const validateOtp = async (email, code, type) => {
  const otp = await OtpCode.findOne({
    where: {
      email,
      code,
      type,
      used: false,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!otp) {
    throw { status: 400, message: 'Código inválido o expirado' };
  }

  await otp.update({ used: true });
  return otp;
};

// ── Auth principal ────────────────────────────────────────────────────────────

const register = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const code = await generateOtp(email, 'email_verification');
  await sendVerificationEmail(email, code);

  return { id: user.id, name: user.name, email: user.email };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 401, message: 'Credenciales inválidas' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 401, message: 'Credenciales inválidas' };

  if (!user.emailVerified) {
    throw { status: 403, message: 'EMAIL_NOT_VERIFIED' };
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };
  return user;
};

// ── OTP flows ─────────────────────────────────────────────────────────────────

const verifyEmail = async ({ email, code }) => {
  await validateOtp(email, code, 'email_verification');
  await User.update({ emailVerified: true }, { where: { email } });
  return { message: 'Email verificado correctamente' };
};

const resendOtp = async ({ email, type }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };

  const code = await generateOtp(email, type);
  if (type === 'email_verification') {
    await sendVerificationEmail(email, code);
  } else {
    await sendPasswordResetEmail(email, code);
  }
  return { message: 'Código reenviado' };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });
  // Respuesta genérica para evitar enumeración de usuarios
  if (user) {
    const code = await generateOtp(email, 'password_reset');
    await sendPasswordResetEmail(email, code);
  }
  return { message: 'Si el email está registrado, recibirás un código' };
};

const resetPassword = async ({ email, code, newPassword }) => {
  await validateOtp(email, code, 'password_reset');
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { email } });
  return { message: 'Contraseña actualizada correctamente' };
};

module.exports = { register, login, getMe, verifyEmail, resendOtp, forgotPassword, resetPassword };
