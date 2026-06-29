const authService = require('../../services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

// Helpers para shape plana sin wrapper
const toUserShape = (user, token) => ({
  token,
  email: user.email,
  name: user.name,
  id: user.id,
});

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    // register no retorna token — retornamos solo datos básicos
    res.status(201).json({ email: result.email, name: result.name, id: result.id });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(toUserShape(result.user, result.token));
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp/request — { email } → dispara OTP de reset de contraseña
const requestOtp = async (req, res, next) => {
  try {
    await authService.forgotPassword({ email: req.body.email });
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/otp/verify — { email, otp } → verifica y retorna token
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // Validar el OTP de password_reset sin cambiar contraseña
    const { validateOtp } = require('../../services/authService');
    // authService no expone validateOtp directamente, usamos resetPassword con newPassword dummy
    // En su lugar: buscar el OTP directamente
    const { OtpCode } = require('../../models');
    const { Op } = require('sequelize');
    const otpRecord = await OtpCode.findOne({
      where: {
        email,
        code: otp,
        type: 'password_reset',
        used: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Código inválido o expirado' });
    }
    // No marcar como used aún — se usará en change-password
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = jwt.sign(
      { id: user.id, role: user.role, otpVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json(toUserShape(user, token));
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password — { currentPassword, newPassword } — requiere auth
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-email — { currentPassword, newEmail } — requiere auth
const changeEmail = async (req, res, next) => {
  try {
    const { currentPassword, newEmail } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    await user.update({ email: newEmail });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json(toUserShape({ ...user.toJSON(), email: newEmail }, token));
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, requestOtp, verifyOtp, changePassword, changeEmail };
