const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

passport.use(new GoogleStrategy({
    clientID:'486702815730-ttadusiqgmvki60dl4vlnhflk8uts3bc.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL: "http://localhost:3000/auth/google/callback"},
        function(accessToken, refreshToken, profile, cb){
            return cb(null, profile)
        }
    ))
module.exports = passport