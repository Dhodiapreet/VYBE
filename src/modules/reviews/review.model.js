const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  onModel: { type: String, required: true, enum: ['Movie', 'Song', 'Album', 'Artist', 'Match'] },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'onModel' },
  text: { type: String, required: true, maxlength: 1000 },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ contentId: 1, onModel: 1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
