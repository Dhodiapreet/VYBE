const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true }
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  hasSpoiler: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [replySchema]
}, { timestamps: true });

discussionSchema.index({ movieId: 1, createdAt: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);
