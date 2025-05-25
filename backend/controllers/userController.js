import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
// import asyncHandler from '../middleware/async.js';
import { uploadToCloudinary } from '../services/storageService.js';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
// export const getUsers = asyncHandler(async (req, res) => {
//   res.status(200).json(res.advancedResults);
// });

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: 'digitalId',
    select: 'idNumber issuedDate expiryDate status'
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload user avatar
// @route   PUT /api/v1/users/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Check if image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Upload to Cloudinary
  const result = await uploadToCloudinary(file.tempFilePath, 'avatars');

  await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url });

  res.status(200).json({
    success: true,
    data: result.secure_url
  });
});