import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
// import generateToken from '../utils/generateToken.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Check if Google is already linked
          const isLinked = user.socialLogins.some(
            login => login.provider === 'google'
          );

          if (!isLinked) {
            user.socialLogins.push({
              provider: 'google',
              providerId: profile.id
            });
            await user.save();
          }

          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: generateToken(profile.id), // Temporary password
          socialLogins: [
            {
              provider: 'google',
              providerId: profile.id
            }
          ],
          isVerified: true
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Check if Facebook is already linked
          const isLinked = user.socialLogins.some(
            login => login.provider === 'facebook'
          );

          if (!isLinked) {
            user.socialLogins.push({
              provider: 'facebook',
              providerId: profile.id
            });
            await user.save();
          }

          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          password: generateToken(profile.id), // Temporary password
          socialLogins: [
            {
              provider: 'facebook',
              providerId: profile.id
            }
          ],
          isVerified: true
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);