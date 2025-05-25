import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middleware/async.js';
import generateToken from '../utils/generateToken.js';

// @desc    Social login callback
// @route   GET /api/v1/auth/:provider/callback
// @access  Public
export const socialLogin = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  
  res.cookie('token', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

// @desc    Link social account
// @route   POST /api/v1/social/link/:provider
// @access  Private
export const linkSocialAccount = asyncHandler(async (req, res, next) => {
  const { provider } = req.params;
  const { accessToken } = req.body;

  if (!['google', 'facebook'].includes(provider)) {
    return next(new ErrorResponse('Invalid social provider', 400));
  }

  // In a real implementation, you would verify the access token
  // and get the user's profile from the provider

  const user = await User.findById(req.user.id);
  
  // Check if provider is already linked
  const isLinked = user.socialLogins.some(login => login.provider === provider);
  
  if (isLinked) {
    return next(new ErrorResponse(`Account already linked with ${provider}`, 400));
  }

  user.socialLogins.push({ provider, providerId: 'temp-id' });
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Unlink social account
// @route   POST /api/v1/social/unlink/:provider
// @access  Private
export const unlinkSocialAccount = asyncHandler(async (req, res, next) => {
  const { provider } = req.params;

  const user = await User.findById(req.user.id);
  
  // Check if provider is linked
  const loginIndex = user.socialLogins.findIndex(login => login.provider === provider);
  
  if (loginIndex === -1) {
    return next(new ErrorResponse(`Account not linked with ${provider}`, 400));
  }

  user.socialLogins.splice(loginIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});