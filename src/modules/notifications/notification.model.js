const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: ['like', 'reply', 'follow', 'recommendation', 'watchlist', 'milestone', 'message']
  },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  target: {
    title: { type: String },
    id: { type: String } 
  },
  actionSuffix: { type: String },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
