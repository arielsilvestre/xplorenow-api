const User = require('./User');
const Destination = require('./Destination');
const TourGuide = require('./TourGuide');
const Activity = require('./Activity');
const Availability = require('./Availability');
const Reservation = require('./Reservation');

// Asociaciones
Activity.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });
Destination.hasMany(Activity, { foreignKey: 'destinationId', as: 'activities' });

Activity.belongsTo(TourGuide, { foreignKey: 'guideId', as: 'guide' });
TourGuide.hasMany(Activity, { foreignKey: 'guideId', as: 'activities' });

Activity.hasMany(Availability, { foreignKey: 'activityId', as: 'availability' });
Availability.belongsTo(Activity, { foreignKey: 'activityId' });

Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });

Reservation.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Reservation, { foreignKey: 'activityId', as: 'reservations' });

module.exports = { User, Destination, TourGuide, Activity, Availability, Reservation };
