/**
 * Seed principal — siembra todas las tablas en orden de dependencias.
 * Uso: npm run seed  ó  node src/seeds/seedAll.js
 * Es idempotente: puede ejecutarse varias veces sin duplicar datos (usa findOrCreate).
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const {
  Destination, TourGuide, Activity, Availability,
  User, Reservation, Review, Image, News,
} = require('../models');

// ── 1. DESTINATIONS ──────────────────────────────────────────────────────────

const destinationsData = [
  { name: 'Nueva York, USA',         description: 'La ciudad que nunca duerme: rascacielos icónicos, Central Park, el Museo MET y el vibrante skyline de Manhattan. Una experiencia urbana única en el mundo.',                                                          imageUrl: 'https://picsum.photos/seed/newyork/800/400',       latitude:  40.7128, longitude:  -74.0060 },
  { name: 'Villa Ventana, Buenos Aires', description: 'Pueblo serrano escondido entre los cerros de la Provincia de Buenos Aires. Ideal para trekking, escalada y desconectarse de la ciudad en plena naturaleza.',                                                       imageUrl: 'https://picsum.photos/seed/villaventana/800/400',  latitude: -38.0667, longitude:  -61.9667 },
  { name: 'Cancún, México',          description: 'Paraíso caribeño con playas de arena blanca, aguas turquesas y arrecifes de coral. A pocos kilómetros encontrarás las ruinas mayas de Tulum y Chichén Itzá.',                                                         imageUrl: 'https://picsum.photos/seed/cancun/800/400',        latitude:  21.1619, longitude:  -86.8515 },
  { name: 'París, Francia',          description: 'La ciudad del amor y la luz: la Torre Eiffel, el Louvre, Notre-Dame y los grandes bulevares. Gastronomía refinada, moda y arte en cada rincón.',                                                                       imageUrl: 'https://picsum.photos/seed/paris/800/400',         latitude:  48.8566, longitude:    2.3522 },
  { name: 'Mar del Plata, Buenos Aires', description: 'La perla del Atlántico: playas icónicas, vida nocturna, el puerto con sus lobos marinos y una intensa vida cultural. La ciudad más visitada de la Argentina.',                                                    imageUrl: 'https://picsum.photos/seed/mardel/800/400',        latitude: -38.0055, longitude:  -57.5426 },
  { name: 'Jujuy, Argentina',        description: 'La Quebrada de Humahuaca, los cerros de colores de Purmamarca y las salinas de la Puna. Una cultura milenaria y paisajes únicos en el noroeste argentino.',                                                           imageUrl: 'https://picsum.photos/seed/jujuy/800/400',         latitude: -24.1858, longitude:  -65.2995 },
  { name: 'California, USA',         description: 'Desde los viñedos de Napa Valley hasta las playas de Malibú y los parques de Yosemite. Silicon Valley, Hollywood y la costa del Pacífico en un mismo estado.',                                                        imageUrl: 'https://picsum.photos/seed/california/800/400',   latitude:  36.7783, longitude: -119.4179 },
  { name: 'Tokio, Japón',            description: 'La metrópolis del futuro: barrios como Shibuya y Shinjuku, templos milenarios, gastronomía incomparable y la perfecta fusión entre tradición y tecnología de punta.',                                                   imageUrl: 'https://picsum.photos/seed/tokio/800/400',         latitude:  35.6762, longitude:  139.6503 },
  { name: 'Río de Janeiro, Brasil',  description: 'El Cristo Redentor, el Carnaval más famoso del mundo, Copacabana, Ipanema y el Pan de Azúcar. La ciudad maravillosa te recibe con samba y caipirinha.',                                                                imageUrl: 'https://picsum.photos/seed/riodejaneiro/800/400',  latitude: -22.9068, longitude:  -43.1729 },
  { name: 'Bariloche, Argentina',    description: 'La Patagonia en todo su esplendor: lagos cristalinos, cerros nevados, bosques de lengas y el mejor chocolate artesanal del país. Paraíso del ski y el trekking.',                                                      imageUrl: 'https://picsum.photos/seed/bariloche/800/400',     latitude: -41.1335, longitude:  -71.3103 },
];

// ── 2. TOUR GUIDES ───────────────────────────────────────────────────────────

const tourGuidesData = [
  // idx 0 — Carlos
  { name: 'Carlos Mendoza',   bio: 'Especialista en destinos patagónicos y serranos. 10 años guiando grupos por Argentina con un enfoque en naturaleza y cultura local.',                       languages: ['Español', 'English'],               photoUrl: 'https://picsum.photos/seed/guide-carlos/200/200', rating: 4.8 },
  // idx 1 — María
  { name: 'María González',   bio: 'Guía certificada por la Federación Europea de Turismo. Experta en arte, historia y gastronomía de Francia e Italia.',                                      languages: ['Español', 'Français', 'English'],   photoUrl: 'https://picsum.photos/seed/guide-maria/200/200',  rating: 4.9 },
  // idx 2 — Yuki
  { name: 'Yuki Nakamura',    bio: 'Nacida en Osaka, lleva 15 años acercando la cultura japonesa a viajeros hispanohablantes. Especialista en historia del período Edo y gastronomía nipona.', languages: ['Español', '日本語', 'English'],     photoUrl: 'https://picsum.photos/seed/guide-yuki/200/200',   rating: 4.7 },
  // idx 3 — Lucas
  { name: 'Lucas Ferreira',   bio: 'Carioca apasionado por la música, la naturaleza y la gastronomía brasileña. Guía oficial del Parque Nacional de la Tijuca.',                               languages: ['Español', 'Português', 'English'],  photoUrl: 'https://picsum.photos/seed/guide-lucas/200/200',  rating: 4.6 },
  // idx 4 — Ana
  { name: 'Ana Gutiérrez',    bio: 'Especialista en América del Norte y el Caribe. Certificada como guía de aventura y ecoturismo. Apasionada por los deportes acuáticos.',                    languages: ['Español', 'English'],               photoUrl: 'https://picsum.photos/seed/guide-ana/200/200',    rating: 4.8 },
];

// Índice de guía por destino (mismo orden que destinationsData)
// 0=Carlos · 1=María · 2=Yuki · 3=Lucas · 4=Ana
const guidePerDest = [4, 0, 4, 1, 0, 0, 4, 2, 3, 0];

// ── 3. ACTIVITIES (2 por destino, mismo orden que destinationsData) ───────────

const activitiesPerDestination = [
  // 0 — Nueva York
  [
    { name: 'Tour por Manhattan en bicicleta',   description: 'Recorrido guiado por los barrios más icónicos de Manhattan, incluyendo Central Park y el High Line.',                                               price: 65,  capacity: 15, category: 'tour',      duration: '3 horas',  meetingPoint: 'Columbus Circle, Manhattan',              imageUrl: 'https://picsum.photos/seed/nyc-bike/800/600' },
    { name: 'Free Tour por Brooklyn',             description: 'Explorá el vibrante barrio de Brooklyn a pie con un guía local. Incluye DUMBO, Williamsburg y el puente de Brooklyn.',                             price: 0,   capacity: 20, category: 'free_tour', duration: '2.5 horas',meetingPoint: 'Brooklyn Bridge Park, Pier 1',            imageUrl: 'https://picsum.photos/seed/brooklyn-tour/800/600' },
  ],
  // 1 — Villa Ventana
  [
    { name: 'Trekking a la Ventana',              description: 'Caminata de montaña hasta el arco natural de la Ventana con vistas panorámicas de la sierra bonaerense.',                                          price: 40,  capacity: 12, category: 'excursion', duration: '5 horas',  meetingPoint: 'Guardería del Parque Provincial',         imageUrl: 'https://picsum.photos/seed/ventana-trek/800/600' },
    { name: 'Avistaje de aves en la sierra',      description: 'Excursión matutina para observar las aves autóctonas de las sierras bonaerenses con guía ornitólogo.',                                            price: 35,  capacity: 8,  category: 'experience',duration: '3 horas',  meetingPoint: 'Plaza de Villa Ventana',                  imageUrl: 'https://picsum.photos/seed/birds-sierra/800/600' },
  ],
  // 2 — Cancún
  [
    { name: 'Snorkel en el arrecife mesoamericano', description: 'Inmersión en el segundo arrecife de coral más grande del mundo. Incluye equipo completo y guía certificado.',                                    price: 55,  capacity: 20, category: 'excursion', duration: '4 horas',  meetingPoint: 'Muelle de Cancún Centro',                 imageUrl: 'https://picsum.photos/seed/cancun-snorkel/800/600' },
    { name: 'Tour a Chichén Itzá',                description: 'Visita guiada a la pirámide maya de Chichén Itzá con traslado desde la zona hotelera y almuerzo incluido.',                                       price: 120, capacity: 25, category: 'tour',      duration: '10 horas', meetingPoint: 'Hotel Zone, lobby central',               imageUrl: 'https://picsum.photos/seed/chichen-itza/800/600' },
  ],
  // 3 — París
  [
    { name: 'Tour nocturno por la Torre Eiffel',  description: 'Visita nocturna al icónico monumento parisino con acceso a los pisos 1 y 2 y champagne de bienvenida.',                                           price: 95,  capacity: 15, category: 'tour',      duration: '2 horas',  meetingPoint: 'Champ de Mars, entrada norte de la Torre', imageUrl: 'https://picsum.photos/seed/eiffel-night/800/600' },
    { name: 'Free Tour por Montmartre',           description: 'Descubrí el barrio bohemio de los artistas, la Basílica del Sagrado Corazón y el glamour de la Belle Époque.',                                    price: 0,   capacity: 25, category: 'free_tour', duration: '2 horas',  meetingPoint: 'Place des Abbesses, salida del metro',    imageUrl: 'https://picsum.photos/seed/montmartre/800/600' },
  ],
  // 4 — Mar del Plata
  [
    { name: 'Kayak en la costa marplatense',      description: 'Paddling a lo largo de los acantilados de Mar del Plata con vistas únicas de la ciudad desde el mar.',                                            price: 45,  capacity: 10, category: 'experience',duration: '2 horas',  meetingPoint: 'Club Náutico Mar del Plata',               imageUrl: 'https://picsum.photos/seed/mdp-kayak/800/600' },
    { name: 'Tour gastronómico por el puerto',    description: 'Recorrido por el puerto histórico degustando langostinos, mejillones y los mejores productos frescos del mar.',                                    price: 60,  capacity: 12, category: 'tour',      duration: '3 horas',  meetingPoint: 'Acceso al Puerto, pescaderías',           imageUrl: 'https://picsum.photos/seed/mdp-puerto/800/600' },
  ],
  // 5 — Jujuy
  [
    { name: 'Excursión a la Quebrada de Humahuaca', description: 'Viaje a la Quebrada declarada Patrimonio de la Humanidad. Incluye Tilcara, Purmamarca y el Cerro de los 7 Colores.',                          price: 80,  capacity: 20, category: 'excursion', duration: '9 horas',  meetingPoint: 'Terminal de Ómnibus de Jujuy',            imageUrl: 'https://picsum.photos/seed/humahuaca/800/600' },
    { name: 'Taller de tejido con artesanas locales', description: 'Experiencia auténtica aprendiendo técnicas ancestrales de tejido con mujeres artesanas de comunidades originarias de la Puna.',              price: 50,  capacity: 8,  category: 'experience',duration: '3 horas',  meetingPoint: 'Comunidad de Purmamarca',                 imageUrl: 'https://picsum.photos/seed/jujuy-craft/800/600' },
  ],
  // 6 — California
  [
    { name: 'Tour por Yosemite y las secuoyas',   description: 'Recorrido de un día por Yosemite con guía naturalista, incluyendo las cascadas, los géisers y las secuoyas milenarias.',                          price: 150, capacity: 20, category: 'tour',      duration: '10 horas', meetingPoint: 'San Francisco – Union Square',            imageUrl: 'https://picsum.photos/seed/yosemite/800/600' },
    { name: 'Surf lesson en Venice Beach',        description: 'Clase de surf para principiantes en las icónicas playas de Los Ángeles. Incluye tabla, traje y instructor certificado.',                           price: 85,  capacity: 10, category: 'experience',duration: '2 horas',  meetingPoint: 'Venice Beach Boardwalk, frente al gimnasio', imageUrl: 'https://picsum.photos/seed/venice-surf/800/600' },
  ],
  // 7 — Tokio
  [
    { name: 'Tour al Monte Fuji y onsen',         description: 'Excursión de día completo al Monte Fuji con baño en aguas termales tradicionales (onsen) al atardecer.',                                          price: 130, capacity: 15, category: 'excursion', duration: '12 horas', meetingPoint: 'Shinjuku Station, salida sur',            imageUrl: 'https://picsum.photos/seed/fuji-onsen/800/600' },
    { name: 'Free Tour por Shibuya y Harajuku',   description: 'Descubrí el cruce más transitado del mundo, la cultura kawaii de Harajuku y la moda pop japonesa con guía hispanohablante.',                       price: 0,   capacity: 20, category: 'free_tour', duration: '2.5 horas',meetingPoint: 'Shibuya Crossing, estatua de Hachiko',    imageUrl: 'https://picsum.photos/seed/shibuya/800/600' },
  ],
  // 8 — Río de Janeiro
  [
    { name: 'Trekking al Pão de Açúcar',         description: 'Ascenso al Pan de Azúcar por senderos de montaña con vistas privilegiadas de la bahía de Guanabara y la ciudad maravillosa.',                      price: 70,  capacity: 12, category: 'excursion', duration: '4 horas',  meetingPoint: 'Praia Vermelha, entrada dos trilhos',     imageUrl: 'https://picsum.photos/seed/rio-pao/800/600' },
    { name: 'Clase de samba en La Lapa',          description: 'Aprendé los fundamentos del samba con bailarines profesionales en un contexto cultural único en el barrio histórico de La Lapa.',                   price: 55,  capacity: 15, category: 'experience',duration: '1.5 horas',meetingPoint: 'Escadaria Selarón, Lapa',                 imageUrl: 'https://picsum.photos/seed/rio-samba/800/600' },
  ],
  // 9 — Bariloche
  [
    { name: 'Ski en el Cerro Catedral',           description: 'Día de ski en el centro de esquí más grande de Sudamérica. Incluye forfait, equipo completo y instructor.',                                        price: 200, capacity: 10, category: 'excursion', duration: '6 horas',  meetingPoint: 'Base del Cerro Catedral',                 imageUrl: 'https://picsum.photos/seed/catedral-ski/800/600' },
    { name: 'Tour de chocolate y cerveza artesanal', description: 'Recorrido por las principales fábricas de chocolate suizo y cervecerías artesanales de la región andina.',                                     price: 55,  capacity: 20, category: 'tour',      duration: '3 horas',  meetingPoint: 'Centro Cívico de Bariloche',              imageUrl: 'https://picsum.photos/seed/bariloche-choc/800/600' },
  ],
];

// ── 9. NEWS (indices de activityRecords: destIdx*2 + actIdx) ─────────────────

const newsData = [
  {
    title: '¡Nuevas fechas para el Tour al Monte Fuji!',
    description: 'Abrimos más salidas para el tour más solicitado de Tokio.',
    content: 'Debido a la alta demanda registrada esta temporada, hemos sumado nuevas salidas para el tour al Monte Fuji con baño en onsen. Las nuevas fechas están disponibles desde julio hasta octubre. ¡Reservá con anticipación y asegurá tu lugar!',
    imageUrl: 'https://picsum.photos/seed/news-fuji/800/400',
    type: 'NOTICIA',
    activityIdx: 14, // dest 7 (Tokio) act 0 → Monte Fuji
  },
  {
    title: '20% OFF en tours por Bariloche en julio',
    description: 'Aprovechá los precios de temporada baja en la Patagonia andina.',
    content: 'Durante el mes de julio ofrecemos un descuento especial del 20% en todos nuestros tours y excursiones por Bariloche. Nieve garantizada en el Cerro Catedral. Incluye equipo completo e instructor certificado.',
    imageUrl: 'https://picsum.photos/seed/news-bariloche/800/400',
    type: 'OFERTA',
    discount: '20%',
    activityIdx: 18, // dest 9 (Bariloche) act 0 → Ski Catedral
  },
  {
    title: 'Descubrí la Quebrada de Humahuaca',
    description: 'Patrimonio de la Humanidad en el corazón de la Argentina profunda.',
    content: 'La Quebrada de Humahuaca es uno de los paisajes más impresionantes de Sudamérica. Sus cerros de colores, sus pueblos de adobe y su cultura milenaria la convierten en un destino único. Nuestras excursiones parten desde Jujuy capital.',
    imageUrl: 'https://picsum.photos/seed/news-quebrada/800/400',
    type: 'DESTINO',
    activityIdx: 10, // dest 5 (Jujuy) act 0 → Quebrada
  },
  {
    title: 'Temporada de verano en el Caribe mexicano',
    description: 'Cancún y sus arrecifes te esperan con las mejores experiencias acuáticas.',
    content: 'El verano boreal es la temporada ideal para explorar las aguas cristalinas del Caribe mexicano. Nuestro tour de snorkel en el arrecife mesoamericano es el más solicitado de la temporada. ¡No te quedes sin lugar!',
    imageUrl: 'https://picsum.photos/seed/news-cancun/800/400',
    type: 'DESTINO',
    activityIdx: 4,  // dest 2 (Cancún) act 0 → Snorkel
  },
  {
    title: '¿Qué son los Free Tours y cómo aprovecharlos?',
    description: 'Todo lo que necesitás saber antes de sumarte a un free tour.',
    content: 'Los free tours son una excelente forma de conocer una ciudad nueva con guías locales apasionados. No tienen precio fijo: al finalizar, podés dejar la propina que consideres justa según tu experiencia. Los ofrecemos en Brooklyn, Montmartre y Shibuya.',
    imageUrl: 'https://picsum.photos/seed/news-freetour/800/400',
    type: 'NOTICIA',
    activityIdx: 1,  // dest 0 (Nueva York) act 1 → Free Tour Brooklyn
  },
];

// ── SEED ──────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('DB connected\n');

    // 1. Destinations
    console.log('── Destinations ──────────────────────────────────');
    const destRecords = [];
    for (const d of destinationsData) {
      const [dest, created] = await Destination.findOrCreate({ where: { name: d.name }, defaults: d });
      destRecords.push(dest);
      console.log(`  ${created ? '✓' : '–'} ${dest.name}`);
    }

    // 2. Tour Guides
    console.log('\n── Tour Guides ────────────────────────────────────');
    const guideRecords = [];
    for (const g of tourGuidesData) {
      const [guide, created] = await TourGuide.findOrCreate({ where: { name: g.name }, defaults: g });
      guideRecords.push(guide);
      console.log(`  ${created ? '✓' : '–'} ${guide.name}`);
    }

    // 3. Activities
    console.log('\n── Activities ─────────────────────────────────────');
    const activityRecords = [];
    for (let i = 0; i < destinationsData.length; i++) {
      const dest  = destRecords[i];
      const guide = guideRecords[guidePerDest[i]];
      for (const a of activitiesPerDestination[i]) {
        const [act, created] = await Activity.findOrCreate({
          where:    { name: a.name, destinationId: dest.id },
          defaults: { ...a, destinationId: dest.id, guideId: guide.id },
        });
        activityRecords.push(act);
        console.log(`  ${created ? '✓' : '–'} ${act.name}`);
      }
    }

    // 4. Availabilities — 4 fechas futuras por actividad (cada 7 días)
    console.log('\n── Availabilities ─────────────────────────────────');
    const today = new Date();
    let availCreated = 0;
    const hours = ['09:00', '14:00', '10:00', '16:00'];
    for (let i = 0; i < activityRecords.length; i++) {
      const act   = activityRecords[i];
      const guide = guideRecords[guidePerDest[Math.floor(i / 2)]];
      for (let w = 1; w <= 4; w++) {
        const d = new Date(today);
        d.setDate(today.getDate() + w * 7);
        const dateStr = d.toISOString().split('T')[0];
        const [, created] = await Availability.findOrCreate({
          where:    { activityId: act.id, date: dateStr },
          defaults: {
            date:       dateStr,
            hour:       hours[w - 1],
            spotsLeft:  act.capacity,
            precio:     parseFloat(act.price),
            totalQuota: act.capacity,
            activityId: act.id,
            guideId:    guide.id,
          },
        });
        if (created) availCreated++;
      }
    }
    console.log(`  ✓ ${availCreated} slots creados (4 fechas × ${activityRecords.length} actividades)`);

    // 5. Users
    console.log('\n── Users ──────────────────────────────────────────');
    const testPwd  = await bcrypt.hash('Test1234',  10);
    const adminPwd = await bcrypt.hash('Admin1234', 10);

    const [testUser, tc] = await User.findOrCreate({
      where:    { email: 'test@xplorenow.com' },
      defaults: { name: 'Usuario Test', email: 'test@xplorenow.com', password: testPwd, emailVerified: true, role: 'user' },
    });
    const [, ac] = await User.findOrCreate({
      where:    { email: 'admin@xplorenow.com' },
      defaults: { name: 'Admin XploreNow', email: 'admin@xplorenow.com', password: adminPwd, emailVerified: true, role: 'admin' },
    });
    console.log(`  ${tc ? '✓' : '–'} test@xplorenow.com   password: Test1234`);
    console.log(`  ${ac ? '✓' : '–'} admin@xplorenow.com  password: Admin1234`);

    // 6. Reservations — 3 reservas para el usuario test
    console.log('\n── Reservations ───────────────────────────────────');
    const resTargets = [
      activityRecords[0],  // Tour Manhattan
      activityRecords[8],  // Kayak Mar del Plata
      activityRecords[16], // Trekking Pão de Açúcar
    ];
    for (const act of resTargets) {
      const rd = new Date(today);
      rd.setDate(today.getDate() + 14);
      const [, created] = await Reservation.findOrCreate({
        where:    { userId: testUser.id, activityId: act.id },
        defaults: {
          date:       rd.toISOString().split('T')[0],
          people:     2,
          status:     'confirmed',
          totalPrice: parseFloat(act.price) * 2,
          userId:     testUser.id,
          activityId: act.id,
        },
      });
      console.log(`  ${created ? '✓' : '–'} ${act.name}`);
    }

    // 7. Reviews — 3 reseñas del usuario test
    console.log('\n── Reviews ────────────────────────────────────────');
    const reviewTargets = [
      { act: activityRecords[0],  stars: 5, guideRating: 5, comment: 'Increíble experiencia. El guía conocía cada rincón de Manhattan.' },
      { act: activityRecords[8],  stars: 4, guideRating: 4, comment: 'Muy recomendable. El kayak fue emocionante y el guía muy profesional.' },
      { act: activityRecords[16], stars: 5, guideRating: 5, comment: 'Subir al Pão de Açúcar fue lo mejor del viaje. Lucas es un guía excelente.' },
    ];
    for (const r of reviewTargets) {
      const [, created] = await Review.findOrCreate({
        where:    { userId: testUser.id, activityId: r.act.id },
        defaults: { stars: r.stars, comment: r.comment, guideRating: r.guideRating, userId: testUser.id, activityId: r.act.id },
      });
      console.log(`  ${created ? '✓' : '–'} ${r.act.name}  ${r.stars}★`);
    }

    // 8. Images — 2 imágenes adicionales por actividad
    console.log('\n── Images ─────────────────────────────────────────');
    let imgCreated = 0;
    for (let i = 0; i < activityRecords.length; i++) {
      const act = activityRecords[i];
      for (const suffix of ['extra1', 'extra2']) {
        const url = `https://picsum.photos/seed/xplore-${i}-${suffix}/800/600`;
        const [, created] = await Image.findOrCreate({ where: { url }, defaults: { url, activityId: act.id } });
        if (created) imgCreated++;
      }
    }
    console.log(`  ✓ ${imgCreated} imágenes creadas`);

    // 9. News
    console.log('\n── News ───────────────────────────────────────────');
    for (const n of newsData) {
      const { activityIdx, ...fields } = n;
      const actId = activityIdx !== undefined ? (activityRecords[activityIdx]?.id ?? null) : null;
      const [, created] = await News.findOrCreate({
        where:    { title: n.title },
        defaults: { ...fields, activityId: actId },
      });
      console.log(`  ${created ? '✓' : '–'} [${n.type}] ${n.title}`);
    }

    console.log('\n✓ Seed completo.');
    process.exit(0);
  } catch (err) {
    console.error('\nSeed failed:', err);
    process.exit(1);
  }
}

seed();
