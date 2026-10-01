
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const { Team, Player, Match } = require('./sports.model');

exports.getMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find().populate('teamA teamB');
  res.status(200).json(new ApiResponse(200, matches));
});
exports.getLiveMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ status: 'LIVE' }).populate('teamA teamB');
  res.status(200).json(new ApiResponse(200, matches));
});
exports.getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find();
  res.status(200).json(new ApiResponse(200, teams));
});
exports.getPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find().populate('team');
  res.status(200).json(new ApiResponse(200, players));
});
