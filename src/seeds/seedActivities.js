require('dotenv').config();
const { sequelize } = require('../config/database');
const { Activity, Destination } = require('../models');

const activitiesPerDestination = [
  // Nueva York
  [
    { name: 'Tour por Manhattan en bicicleta', description: 'Recorrido guiado por los barrios más icónicos de Manhattan, incluyendo Central Park y el High Line.', price: 65, capacity: 15, category: 'tour', imageUrl: 'https://picsum.photos/seed/nyc-bike/800/600' },
    { name: 'Free Tour por Brooklyn', description: 'Explorá el vibrante barrio de Brooklyn a pie con un guía local. Incluye DUMBO, Williamsburg y el puente.', price: 0, capacity: 20, category: 'free_tour', imageUrl: 'https://picsum.photos/seed/brooklyn-tour/800/600' },
  ],
  // Villa Ventana
  [
    { name: 'Trekking a la Ventana', description: 'Caminata de montaña hasta el arco natural de la Ventana con vistas panorámicas de la sierra.', price: 40, capacity: 12, category: 'excursion', imageUrl: 'https://picsum.photos/seed/ventana-trek/800/600' },
    { name: 'Avistaje de aves en la sierra', description: 'Excursión matutina para observar las aves autóctonas de las sierras bonaerenses con guía ornitólogo.', price: 35, capacity: 8, category: 'experience', imageUrl: 'https://picsum.photos/seed/birds-sierra/800/600' },
  ],
  // Cancún
  [
    { name: 'Snorkel en el arrecife mesoamericano', description: 'Inmersión en el segundo arrecife de coral más grande del mundo. Incluye equipo y guía certificado.', price: 55, capacity: 20, category: 'excursion', imageUrl: 'https://picsum.photos/seed/cancun-snorkel/800/600' },
    { name: 'Tour a Chichén Itzá', description: 'Visita guiada a la pirámide maya de Chichén Itzá con traslado desde la zona hotelera y almuerzo incluido.', price: 120, capacity: 25, category: 'tour', imageUrl: 'https://picsum.photos/seed/chichen-itza/800/600' },
  ],
  // París
  [
    { name: 'Tour nocturno por la Torre Eiffel', description: 'Visita nocturna al icónico monumento parisino con acceso a los pisos 1 y 2 y champagne de bienvenida.', price: 95, capacity: 15, category: 'tour', imageUrl: 'https://picsum.photos/seed/eiffel-night/800/600' },
    { name: 'Free Tour por Montmartre', description: 'Descubrí el barrio bohemio de los artistas, la Basílica del Sagrado Corazón y el glamour de la Belle Époque.', price: 0, capacity: 25, category: 'free_tour', imageUrl: 'https://picsum.photos/seed/montmartre/800/600' },
  ],
  // Mar del Plata
  [
    { name: 'Kayak en la costa marplatense', description: 'Paddling a lo largo de los acantilados de Mar del Plata con vistas únicas de la ciudad desde el mar.', price: 45, capacity: 10, category: 'experience', imageUrl: 'https://picsum.photos/seed/mdp-kayak/800/600' },
    { name: 'Tour gastronómico por el puerto', description: 'Recorrido por el puerto histórico degustando langostinos, mejillones y los mejores productos del mar.', price: 60, capacity: 12, category: 'tour', imageUrl: 'https://picsum.photos/seed/mdp-puerto/800/600' },
  ],
  // Jujuy
  [
    { name: 'Excursión a la Quebrada de Humahuaca', description: 'Viaje a la Quebrada declarada Patrimonio de la Humanidad. Incluye Tilcara, Purmamarca y el Cerro de 7 Colores.', price: 80, capacity: 20, category: 'excursion', imageUrl: 'https://picsum.photos/seed/humahuaca/800/600' },
    { name: 'Taller de tejido con tejedoras locales', description: 'Experiencia auténtica aprendiendo las técnicas ancestrales de tejido con mujeres artesanas de comunidades originarias.', price: 50, capacity: 8, category: 'experience', imageUrl: 'https://picsum.photos/seed/jujuy-craft/800/600' },
  ],
  // California
  [
    { name: 'Tour por los parques nacionales de California', description: 'Recorrido de un día por Yosemite con guía naturalista, incluyendo los géisers y las secuoyas milenarias.', price: 150, capacity: 20, category: 'tour', imageUrl: 'https://picsum.photos/seed/yosemite/800/600' },
    { name: 'Surf lesson en Venice Beach', description: 'Clase de surf para principiantes en las icónicas playas de Los Ángeles. Incluye tabla, traje y instructor certificado.', price: 85, capacity: 10, category: 'experience', imageUrl: 'https://picsum.photos/seed/venice-surf/800/600' },
  ],
  // Tokio
  [
    { name: 'Tour al Monte Fuji y onsen', description: 'Excursión de día completo al Monte Fuji con baño en aguas termales tradicionales (onsen) al atardecer.', price: 130, capacity: 15, category: 'excursion', imageUrl: 'https://picsum.photos/seed/fuji-onsen/800/600' },
    { name: 'Free Tour por el barrio de Shibuya', description: 'Descubrí el cruce más transitado del mundo, Harajuku y la cultura pop japonesa con guía hispanohablante.', price: 0, capacity: 20, category: 'free_tour', imageUrl: 'https://picsum.photos/seed/shibuya/800/600' },
  ],
  // Río de Janeiro
  [
    { name: 'Trekking al Pão de Açúcar', description: 'Ascenso al Pan de Azúcar por senderos de montaña con vistas privilegiadas de la bahía de Guanabara.', price: 70, capacity: 12, category: 'excursion', imageUrl: 'https://picsum.photos/seed/rio-pao/800/600' },
    { name: 'Clase de samba en el centro histórico', description: 'Aprendé los fundamentos del samba con bailarines profesionales en un contexto cultural único en La Lapa.', price: 55, capacity: 15, category: 'experience', imageUrl: 'https://picsum.photos/seed/rio-samba/800/600' },
  ],
  // Bariloche
  [
    { name: 'Ski en el Cerro Catedral', description: 'Día de ski en el centro de esquí más grande de Sudamérica. Incluye forfait, equipo completo y instructor.', price: 200, capacity: 10, category: 'excursion', imageUrl: 'https://picsum.photos/seed/catedral-ski/800/600' },
    { name: 'Tour de chocolate y cerveza artesanal', description: 'Recorrido por las principales fábricas de chocolate suizo y cervecerías artesanales de la región andina.', price: 55, capacity: 20, category: 'tour', imageUrl: 'https://picsum.photos/seed/bariloche-choc/800/600' },
  ],
];

async function seed() {
  await sequelize.authenticate();
  console.log('DB connected');

  const destinations = await Destination.findAll({ order: [['name', 'ASC']] });

  if (destinations.length === 0) {
    console.error('No destinations found. Run seedDestinations.js first.');
    process.exit(1);
  }

  // Match destinations by name (order-insensitive)
  const destMap = {
    'Nueva York': 0,
    'Villa Ventana': 1,
    'Cancún': 2,
    'París': 3,
    'Mar del Plata': 4,
    'Jujuy': 5,
    'California': 6,
    'Tokio': 7,
    'Río de Janeiro': 8,
    'Bariloche': 9,
  };

  let created = 0;
  let skipped = 0;

  for (const dest of destinations) {
    const idx = destMap[dest.name];
    if (idx === undefined) {
      console.log(`Skipping unknown destination: ${dest.name}`);
      continue;
    }

    for (const actData of activitiesPerDestination[idx]) {
      const [, wasCreated] = await Activity.findOrCreate({
        where: { name: actData.name, destinationId: dest.id },
        defaults: { ...actData, destinationId: dest.id },
      });
      if (wasCreated) created++;
      else skipped++;
    }
  }

  console.log(`Seed complete: ${created} activities created, ${skipped} skipped.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
