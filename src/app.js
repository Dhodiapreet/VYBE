const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.set('trust proxy', 1); // Trust first proxy for rate limiting behind reverse proxies

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Rate limiting
// Keep the production API protected, but do not let repeated local development
// page loads exhaust the global API budget and make the catalog unusable.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
const seriesRoutes = require('./modules/series/series.routes');
const peopleRoutes = require('./modules/people/person.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/series', seriesRoutes);
app.use('/api/v1/people', peopleRoutes);

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
const userRoutes = require('./modules/users/user.routes');
const discussionRoutes = require('./modules/discussions/discussion.routes');

app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/discussions', discussionRoutes);

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
