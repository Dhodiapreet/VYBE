const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  releaseDate: { type: Date },
  genres: [{ type: String }],
  originalTitle: { type: String },
  tagline: { type: String },
  status: { type: String },
  originalLanguage: { type: String },
  director: { type: String },
  cast: [{ type: String }],
  writers: [{ type: String }],
  producers: [{ type: String }],
  musicBy: [{ type: String }],
  cinematographyBy: [{ type: String }],
  editors: [{ type: String }],
  productionCompanies: [{ type: String }],
  productionCountries: [{ type: String }],
  spokenLanguages: [{ type: String }],
  keywords: [{ type: String }],
  posterUrl: { type: String },
  backdropUrl: { type: String },
  trailerUrl: { type: String },
  durationMinutes: { type: Number },
  budget: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  imdbId: { type: String },
  homepage: { type: String },
  certification: { type: String },
  tmdbId: { type: Number, unique: true, sparse: true },
  // Optional: average normalized rating derived from Rating model
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for searching and filtering
movieSchema.index({ title: 'text', description: 'text', genres: 'text', director: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Movie', movieSchema);
