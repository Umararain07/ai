import express from 'express';
import passport from 'passport';
import {
  socialLogin,
  linkSocialAccount,
  unlinkSocialAccount
} from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/v1/auth/google
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// @desc    Google auth callback
// @route   GET /api/v1/auth/google/callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  socialLogin
);

// @desc    Auth with Facebook
// @route   GET /api/v1/auth/facebook
// @access  Public
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  })
);

// @desc    Facebook auth callback
// @route   GET /api/v1/auth/facebook/callback
// @access  Public
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  socialLogin
);

// @desc    Link social account
// @route   POST /api/v1/social/link/:provider
// @access  Private
router.post('/link/:provider', protect, linkSocialAccount);

// @desc    Unlink social account
// @route   POST /api/v1/social/unlink/:provider
// @access  Private
router.post('/unlink/:provider', protect, unlinkSocialAccount);

export default router;