const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const User = require('../users/user.model');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(new ApiResponse(200, users));
});
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.status(200).json(new ApiResponse(200, user));
});
