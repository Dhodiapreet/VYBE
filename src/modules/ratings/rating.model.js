const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  onModel: { type: String, required: true, enum: ['Movie', 'Series', 'Song', 'Match'] },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'onModel' },
  ratingValue: { 
    type: String, 
    enum: ['PERFECT', 'LOVED IT', 'GOOD', 'AVERAGE', 'SKIP'],
    required: true
  },
  numericValue: { type: Number, required: true } // mapped behind the scenes
}, { timestamps: true });

// Prevent multiple ratings by same user for same content
ratingSchema.index({ user: 1, contentId: 1, onModel: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
