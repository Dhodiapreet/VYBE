const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base route (Health Check)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }
  });
});

// Module Routes will be mounted here
const authRoutes = require('./modules/auth/auth.routes');
const movieRoutes = require('./modules/movies/movie.routes');
const searchRoutes = require('./modules/search/search.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/search', searchRoutes);

const musicRoutes = require('./modules/music/music.routes');
const sportsRoutes = require('./modules/sports/sports.routes');
const reviewRoutes = require('./modules/reviews/review.routes');
const ratingRoutes = require('./modules/ratings/rating.routes');
const collectionRoutes = require('./modules/collections/collection.routes');

app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/sports', sportsRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/collections', collectionRoutes);

const socialRoutes = require('./modules/social/social.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const watchlistRoutes = require('./modules/watchlist/watchlist.routes');
const recommendationRoutes = require('./modules/recommendations/recommendation.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
    errors: []
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
