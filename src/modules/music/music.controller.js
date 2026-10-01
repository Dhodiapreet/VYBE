
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const { Song, Artist, Album } = require('./music.model');

exports.getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find().populate('artist album');
  res.status(200).json(new ApiResponse(200, songs));
});
exports.getSongById = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id).populate('artist album');
  res.status(200).json(new ApiResponse(200, song));
});
exports.getArtists = asyncHandler(async (req, res) => {
  const artists = await Artist.find();
  res.status(200).json(new ApiResponse(200, artists));
});
exports.getAlbums = asyncHandler(async (req, res) => {
  const albums = await Album.find().populate('artist');
  res.status(200).json(new ApiResponse(200, albums));
});
