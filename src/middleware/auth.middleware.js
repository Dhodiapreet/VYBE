const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../modules/users/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token does no longer exist.'));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
};

exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) { return next(); }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (currentUser) { req.user = currentUser; }
    next();
  } catch (err) {
    next();
  }
});
