
const express = require('express');
const { getMatches, getLiveMatches, getTeams, getPlayers } = require('./sports.controller');
const router = express.Router();
router.get('/matches', getMatches);
router.get('/matches/live', getLiveMatches);
router.get('/teams', getTeams);
router.get('/players', getPlayers);
module.exports = router;
