const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ data: user, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ data: result, message: 'Login exitoso' });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({ data: user, message: 'ok' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
