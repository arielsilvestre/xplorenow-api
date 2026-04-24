/**
 * Seed 10 destinos en la base de datos.
 * Uso: node src/seeds/seedDestinations.js
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
const { Destination } = require('../models');

const destinations = [
  {
    name: 'Nueva York, USA',
    description: 'La ciudad que nunca duerme: rascacielos icónicos, Central Park, el Museo MET y el vibrante skyline de Manhattan. Una experiencia urbana única en el mundo.',
    imageUrl: 'https://picsum.photos/seed/newyork/800/400',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    name: 'Villa Ventana, Buenos Aires',
    description: 'Pueblo serrano escondido entre los cerros de la Provincia de Buenos Aires. Ideal para trekking, escalada y desconectarse de la ciudad en plena naturaleza.',
    imageUrl: 'https://picsum.photos/seed/villaventana/800/400',
    latitude: -38.0667,
    longitude: -61.9667,
  },
  {
    name: 'Cancún, México',
    description: 'Paraíso caribeño con playas de arena blanca, aguas turquesas y arrecifes de coral. A pocos kilómetros encontrarás las ruinas mayas de Tulum y Chichén Itzá.',
    imageUrl: 'https://picsum.photos/seed/cancun/800/400',
    latitude: 21.1619,
    longitude: -86.8515,
  },
  {
    name: 'París, Francia',
    description: 'La ciudad del amor y la luz: la Torre Eiffel, el Louvre, Notre-Dame y los grandes bulevares. Gastronomía refinada, moda y arte en cada rincón.',
    imageUrl: 'https://picsum.photos/seed/paris/800/400',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    name: 'Mar del Plata, Buenos Aires',
    description: 'La perla del Atlántico: playas icónicas, vida nocturna, el puerto con sus lobos marinos y una intensa vida cultural. La ciudad más visitada de la Argentina.',
    imageUrl: 'https://picsum.photos/seed/mardel/800/400',
    latitude: -38.0055,
    longitude: -57.5426,
  },
  {
    name: 'Jujuy, Argentina',
    description: 'La Quebrada de Humahuaca, los cerros de colores de Purmamarca y las salinas de la Puna. Una cultura milenaria y paisajes únicos en el noroeste argentino.',
    imageUrl: 'https://picsum.photos/seed/jujuy/800/400',
    latitude: -24.1858,
    longitude: -65.2995,
  },
  {
    name: 'California, USA',
    description: 'Desde los viñedos de Napa Valley hasta las playas de Malibú y los parques de Yosemite. Silicon Valley, Hollywood y la costa del Pacífico en un mismo estado.',
    imageUrl: 'https://picsum.photos/seed/california/800/400',
    latitude: 36.7783,
    longitude: -119.4179,
  },
  {
    name: 'Tokio, Japón',
    description: 'La metrópolis del futuro: barrios como Shibuya y Shinjuku, templos milenarios, gastronomía incomparable y la perfecta fusión entre tradición y tecnología de punta.',
    imageUrl: 'https://picsum.photos/seed/tokio/800/400',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    name: 'Río de Janeiro, Brasil',
    description: 'El Cristo Redentor, el Carnaval más famoso del mundo, Copacabana, Ipanema y el Pan de Azúcar. La ciudad maravillosa te recibe con samba y caipirinha.',
    imageUrl: 'https://picsum.photos/seed/riodejaneiro/800/400',
    latitude: -22.9068,
    longitude: -43.1729,
  },
  {
    name: 'Bariloche, Argentina',
    description: 'La Patagonia en todo su esplendor: lagos cristalinos, cerros nevados, bosques de lengas y el mejor chocolate artesanal del país. Paraíso del ski y el trekking.',
    imageUrl: 'https://picsum.photos/seed/bariloche/800/400',
    latitude: -41.1335,
    longitude: -71.3103,
  },
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    await sequelize.sync({ alter: true });

    for (const d of destinations) {
      const [dest, created] = await Destination.findOrCreate({
        where: { name: d.name },
        defaults: d,
      });
      console.log(`${created ? 'Creado' : 'Ya existe'}: ${dest.name}`);
    }

    console.log('\n✓ Seed completado — 10 destinos listos.');
    process.exit(0);
  } catch (err) {
    console.error('Error en el seed:', err);
    process.exit(1);
  }
})();
