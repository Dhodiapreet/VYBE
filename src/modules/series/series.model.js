const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  originalTitle: { type: String },
  description: { type: String },
  releaseDate: { type: Date },
  genres: [{ type: String }],
  posterUrl: { type: String },
  backdropUrl: { type: String },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  status: { type: String },
  tagline: { type: String },
  originalLanguage: { type: String },
  numberOfSeasons: { type: Number, default: 0 },
  numberOfEpisodes: { type: Number, default: 0 },
  firstAirDate: { type: Date },
  lastAirDate: { type: Date },
  episodeRunTime: [{ type: Number }],
  type: { type: String },
  networks: [{ type: String }],
  productionCompanies: [{ type: String }],
  productionDetails: [{
    tmdbId: Number,
    name: String,
    logoUrl: String
  }],
  productionCountries: [{ type: String }],
  spokenLanguages: [{ type: String }],
  keywords: [{ type: String }],
  trailerUrl: { type: String },
  homepage: { type: String },
  imdbId: { type: String },
  certification: { type: String },
  createdBy: [{ type: String }],
  watchProviders: {
    link: String,
    providers: [{
      id: Number,
      name: String,
      logoUrl: String
    }]
  },
  cast: [{
    tmdbId: Number,
    name: String,
    character: String,
    profileUrl: String
  }],
  crew: [{
    tmdbId: Number,
    name: String,
    job: String,
    profileUrl: String
  }],
  networkDetails: [{
    tmdbId: Number,
    name: String,
    logoUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Series', seriesSchema);
