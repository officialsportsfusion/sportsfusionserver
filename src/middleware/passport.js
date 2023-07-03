const passport = require('passport')
const User = require('../model/schema')
const GoogleStrategy = require('passport-google-oauth20')
const dotenv = require('dotenv')
dotenv.config()

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists in the database
          let user = await User.findOne({ googleId: profile.id });
  
          if (user) {
            // User already exists, return the user
            return done(null, user);
          } else {
            // User doesn't exist, create a new user in the database
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
  
            await user.save();
  
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  
module.exports = passport