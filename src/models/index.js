const User = require('./User');
const OtpCode = require('./OtpCode');
const Destination = require('./Destination');
const TourGuide = require('./TourGuide');
const Activity = require('./Activity');
const Availability = require('./Availability');
const Reservation = require('./Reservation');
const Favorite = require('./Favorite');
const Review = require('./Review');

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

Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Favorite, { foreignKey: 'activityId', as: 'favorites' });

Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Review, { foreignKey: 'activityId', as: 'reviews' });

module.exports = { User, OtpCode, Destination, TourGuide, Activity, Availability, Reservation, Favorite, Review };
