const { Notification } = require('../../models');

// Long-polling simplificado: retorna notificaciones pendientes inmediatamente.
// Android reintenta cada 5s si recibe lista vacía, lo que produce el efecto de polling.
// El parámetro ?timeout= es ignorado (Railway no soporta long-polling real).
const poll = async (req, res) => {
  try {
    const pending = await Notification.findAll({
      where: { userId: req.user.id, delivered: false },
      order: [['createdAt', 'ASC']],
    });

    const dtos = pending.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      reserveId: n.reserveId,
    }));

    if (pending.length > 0) {
      const ids = pending.map(n => n.id);
      await Notification.update({ delivered: true }, { where: { id: ids } });
    }

    res.json(dtos);
  } catch (err) {
    console.error('Error en notification poll:', err);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

module.exports = { poll };
