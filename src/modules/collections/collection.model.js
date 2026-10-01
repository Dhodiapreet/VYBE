const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  isPublic: { type: Boolean, default: true },
  items: [{
    onModel: { type: String, required: true, enum: ['Movie', 'Song', 'Match'] },
    contentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'items.onModel' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
