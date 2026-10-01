const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.registerUser = async (userData) => {
  const { username, email, password } = userData;
  
  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, 'User with that email or username already exists');
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = signToken(user._id);
  user.password = undefined; // Do not return password

  return { user, token };
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const token = signToken(user._id);
  user.password = undefined;

  return { user, token };
};
