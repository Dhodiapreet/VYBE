const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  onModel: { type: String, required: true, enum: ['Movie', 'Song'] },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'onModel' }
}, { timestamps: true });

favoriteSchema.index({ user: 1, contentId: 1, onModel: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
