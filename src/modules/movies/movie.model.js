const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  releaseDate: { type: Date },
  genres: [{ type: String }],
  director: { type: String },
  cast: [{ type: String }],
  posterUrl: { type: String },
  trailerUrl: { type: String },
  durationMinutes: { type: Number },
  // Optional: average normalized rating derived from Rating model
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for searching and filtering
movieSchema.index({ title: 'text', description: 'text', genres: 'text', director: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Movie', movieSchema);
