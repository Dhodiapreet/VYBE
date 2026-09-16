
const express = require('express');
const { getSongs, getSongById, getArtists, getAlbums } = require('./music.controller');
const router = express.Router();
router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.get('/artists', getArtists);
router.get('/albums', getAlbums);
module.exports = router;
