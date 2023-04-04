const express = require("express");
const passport = require('../../../middleware/passport')
const {signUp, signIn, forgotPassword} = require('../../../controller/userController')

const router = express.Router()


router.post('/', signUp)
router.post('/signin', signIn)
router.post('/forgotpassword', forgotPassword)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
});



module.exports = router