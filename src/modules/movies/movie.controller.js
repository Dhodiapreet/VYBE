const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('./movie.model');
const ApiError = require('../../utils/ApiError');

exports.getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().limit(20);
  res.status(200).json(new ApiResponse(200, movies, 'Movies fetched successfully'));
});

exports.getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new ApiError(404, 'Movie not found');
  res.status(200).json(new ApiResponse(200, movie, 'Movie fetched successfully'));
});

exports.createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(new ApiResponse(201, movie, 'Movie created successfully'));
});
