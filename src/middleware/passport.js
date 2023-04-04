const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const dotenv = require('dotenv')
dotenv.config()

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"},
        function(accessToken, refreshToken, profile, cb){
            return cb(null, profile)
        }
    ))
module.exports = passport