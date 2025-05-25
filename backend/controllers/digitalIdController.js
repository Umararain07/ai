import DigitalId from '../models/DigitalId.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middleware/async.js';
import generateQR from '../services/qrService.js';
import { uploadToCloudinary } from '../services/storageService.js';

// @desc    Get all digital IDs
// @route   GET /api/v1/digitalids
// @access  Private/Admin
export const getDigitalIds = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single digital ID
// @route   GET /api/v1/digitalids/:id
// @access  Private
export const getDigitalId = asyncHandler(async (req, res, next) => {
  const digitalId = await DigitalId.findById(req.params.id).populate({
    path: 'user',
    select: 'name email avatar'
  });

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is digital ID owner or admin
  if (
    digitalId.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this digital ID`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: digitalId
  });
});

// @desc    Get current user's digital ID
// @route   GET /api/v1/digitalids/me
// @access  Private
export const getMyDigitalId = asyncHandler(async (req, res, next) => {
  const digitalId = await DigitalId.findOne({ user: req.user.id });

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found for user ${req.user.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: digitalId
  });
});

// @desc    Create digital ID
// @route   POST /api/v1/digitalids
// @access  Private/Admin
export const createDigitalId = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const digitalId = await DigitalId.create(req.body);

  res.status(201).json({
    success: true,
    data: digitalId
  });
});

// @desc    Update digital ID
// @route   PUT /api/v1/digitalids/:id
// @access  Private
export const updateDigitalId = asyncHandler(async (req, res, next) => {
  let digitalId = await DigitalId.findById(req.params.id);

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is digital ID owner or admin
  if (
    digitalId.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this digital ID`,
        401
      )
    );
  }

  digitalId = await DigitalId.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: digitalId
  });
});

// @desc    Delete digital ID
// @route   DELETE /api/v1/digitalids/:id
// @access  Private
export const deleteDigitalId = asyncHandler(async (req, res, next) => {
  const digitalId = await DigitalId.findById(req.params.id);

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is digital ID owner or admin
  if (
    digitalId.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this digital ID`,
        401
      )
    );
  }

  await digitalId.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Generate QR code for digital ID
// @route   GET /api/v1/digitalids/:id/qrcode
// @access  Private
export const generateDigitalIdQR = asyncHandler(async (req, res, next) => {
  const digitalId = await DigitalId.findById(req.params.id).populate({
    path: 'user',
    select: 'name email avatar'
  });

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is digital ID owner or admin
  if (
    digitalId.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this digital ID QR code`,
        401
      )
    );
  }

  const qrData = JSON.stringify({
    id: digitalId.idNumber,
    name: digitalId.user.name,
    email: digitalId.user.email,
    issued: digitalId.issuedDate,
    expires: digitalId.expiryDate,
    status: digitalId.status
  });

  const qrCode = await generateQR(qrData);

  res.status(200).json({
    success: true,
    data: {
      qrCode,
      digitalId
    }
  });
});

// @desc    Download digital ID card
// @route   GET /api/v1/digitalids/:id/download
// @access  Private
export const downloadDigitalId = asyncHandler(async (req, res, next) => {
  const digitalId = await DigitalId.findById(req.params.id).populate({
    path: 'user',
    select: 'name email avatar'
  });

  if (!digitalId) {
    return next(
      new ErrorResponse(`Digital ID not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is digital ID owner or admin
  if (
    digitalId.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to download this digital ID`,
        401
      )
    );
  }

  // In a real implementation, you would generate a PDF or image here
  // For this example, we'll just return the digital ID data
  res.status(200).json({
    success: true,
    data: digitalId
  });
});