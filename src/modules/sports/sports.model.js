const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true }, // e.g., Cricket, Football
  logoUrl: { type: String }
}, { timestamps: true });
teamSchema.index({ name: 'text', sport: 'text' });
const Team = mongoose.model('Team', teamSchema);

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  sport: { type: String },
  role: { type: String }, // e.g., Batsman, Forward
  imageUrl: { type: String }
}, { timestamps: true });
playerSchema.index({ name: 'text' });
const Player = mongoose.model('Player', playerSchema);

const matchSchema = new mongoose.Schema({
  title: { type: String }, // e.g., India vs Australia
  sport: { type: String, required: true },
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  startTime: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'LIVE', 'COMPLETED'], default: 'UPCOMING' },
  score: { type: String } // Simplified for MVP
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

module.exports = { Team, Player, Match };
