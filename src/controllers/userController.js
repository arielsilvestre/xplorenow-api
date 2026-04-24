const { User } = require('../models');

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, phone, photoUrl, preferences } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    await user.update({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(preferences !== undefined && { preferences }),
    });

    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

module.exports = { getMe, updateMe };
