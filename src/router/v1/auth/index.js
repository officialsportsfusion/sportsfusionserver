const express = require('express')
const router = express.Router()
const upload = require('../../../utilis/upload')
const auth = require('../../../controller/auth')

router.post('/user', auth.signup)
router.post('/login', auth.signin)
router.post('/confirm/otp', auth.confirmOTP)
router.post('/resend/otp', auth.resendOtp)
router.post('/forgot/password', auth.forgotPassword)
router.post('/change/password', auth.changePassword)

// router.post('/upload/avatar/:userId', upload.single('avatar'), auth.uploadImage)

module.exports = router