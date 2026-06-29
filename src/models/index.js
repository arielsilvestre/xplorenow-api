const User = require('./User');
const OtpCode = require('./OtpCode');
const Destination = require('./Destination');
const TourGuide = require('./TourGuide');
const Activity = require('./Activity');
const Availability = require('./Availability');
const Reservation = require('./Reservation');
const Favorite = require('./Favorite');
const FavoriteDestination = require('./FavoriteDestination');
const Review = require('./Review');
const Image = require('./Image');
const News = require('./News');

// Activity associations
Activity.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });
Destination.hasMany(Activity, { foreignKey: 'destinationId', as: 'activities' });

Activity.belongsTo(TourGuide, { foreignKey: 'guideId', as: 'guide' });
TourGuide.hasMany(Activity, { foreignKey: 'guideId', as: 'activities' });

Activity.hasMany(Availability, { foreignKey: 'activityId', as: 'availability' });
Availability.belongsTo(Activity, { foreignKey: 'activityId' });

// Availability → TourGuide (slot-level guide assignment)
Availability.belongsTo(TourGuide, { foreignKey: 'guideId', as: 'guide' });
TourGuide.hasMany(Availability, { foreignKey: 'guideId', as: 'slots' });

// Image associations
Activity.hasMany(Image, { foreignKey: 'activityId', as: 'images' });
Image.belongsTo(Activity, { foreignKey: 'activityId' });

// News associations
News.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(News, { foreignKey: 'activityId', as: 'news' });

// Reservation associations
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });

Reservation.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Reservation, { foreignKey: 'activityId', as: 'reservations' });

// Favorite associations
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Favorite, { foreignKey: 'activityId', as: 'favorites' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(Review, { foreignKey: 'activityId', as: 'reviews' });

// FavoriteDestination associations
FavoriteDestination.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(FavoriteDestination, { foreignKey: 'userId', as: 'favoriteDestinations' });
FavoriteDestination.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });
Destination.hasMany(FavoriteDestination, { foreignKey: 'destinationId', as: 'favoriteDestinations' });

module.exports = {
  User, OtpCode, Destination, TourGuide, Activity, Availability,
  Reservation, Favorite, FavoriteDestination, Review, Image, News,
};
