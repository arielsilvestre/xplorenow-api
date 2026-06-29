const { User } = require('../../models');

const toDto = (user) => ({
  id_traveller: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone ?? null,
  photoUrl: user.photoUrl ?? null,
  preferences: user.preferences ?? [],
});

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(toDto(user));
  } catch (err) {
    console.error('Error fetching traveller:', err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, phone, photoUrl, preferences } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.update({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(preferences !== undefined && { preferences }),
    });

    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(toDto(updated));
  } catch (err) {
    console.error('Error updating traveller:', err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

module.exports = { getMe, updateMe };
