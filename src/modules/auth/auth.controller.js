const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const authService = require('./auth.service');
const { z } = require('zod');
const ApiError = require('../../utils/ApiError');

// Zod schemas for validation
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

exports.register = asyncHandler(async (req, res) => {
  // Validate input
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(400, 'Validation Error', validationResult.error.errors);
  }

  const result = await authService.registerUser(validationResult.data);

  res.status(201).json(
    new ApiResponse(201, result, 'User registered successfully')
  );
});

exports.login = asyncHandler(async (req, res) => {
  // Validate input
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(400, 'Validation Error', validationResult.error.errors);
  }

  const { email, password } = validationResult.data;
  const result = await authService.loginUser(email, password);

  res.status(200).json(
    new ApiResponse(200, result, 'User logged in successfully')
  );
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { user: req.user }, 'User data retrieved successfully')
  );
});
