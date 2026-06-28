const { News, Activity } = require('../../models');

const toDto = (news) => {
  const plain = news.toJSON ? news.toJSON() : news;
  return {
    id: plain.id,
    title: plain.title,
    description: plain.description,
    content: plain.content,
    imageUrl: plain.imageUrl,
    type: plain.type,
    discount: plain.discount,
    activityId: plain.activityId,
    activity: plain.activity ? {
      id: plain.activity.id,
      title: plain.activity.name,
    } : null,
  };
};

const getAll = async (req, res) => {
  try {
    const news = await News.findAll({
      include: [{ model: Activity, as: 'activity', attributes: ['id', 'name'], required: false }],
      order: [['createdAt', 'DESC']],
    });
    res.json(news.map(toDto));
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ message: 'Error al obtener noticias' });
  }
};

const getById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: Activity, as: 'activity', attributes: ['id', 'name'], required: false }],
    });
    if (!news) return res.status(404).json({ message: 'Noticia no encontrada' });
    res.json(toDto(news));
  } catch (err) {
    console.error('Error fetching news item:', err);
    res.status(500).json({ message: 'Error al obtener noticia' });
  }
};

module.exports = { getAll, getById };
