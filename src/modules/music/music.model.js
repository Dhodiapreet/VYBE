const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String },
  imageUrl: { type: String },
  genres: [{ type: String }]
}, { timestamps: true });

artistSchema.index({ name: 'text' });
const Artist = mongoose.model('Artist', artistSchema);

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  releaseDate: { type: Date },
  coverUrl: { type: String }
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  durationSeconds: { type: Number },
  previewUrl: { type: String },
  genres: [{ type: String }],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

songSchema.index({ title: 'text', genres: 'text' });
const Song = mongoose.model('Song', songSchema);

module.exports = { Artist, Album, Song };
