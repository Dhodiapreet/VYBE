const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  onModel: { type: String, required: true, enum: ['User', 'Artist', 'Team', 'Player'] },
  followingId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'onModel' }
}, { timestamps: true });

followSchema.index({ follower: 1, followingId: 1, onModel: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
