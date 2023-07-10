const express = require('express')
const router = express.Router()
const adminAuth = require('../../../controller/adminAuth')

router.post('/admin/signup', adminAuth.signup)
router.post('/admin/login', adminAuth.signin)


module.exports = router