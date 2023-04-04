const express = require('express')
const router = express.Router()
const {newQuota, getQuota} = require('../../../controller/bookingController')

router.post('/BOOK-NOW',  newQuota)
router.get('/quota', getQuota)

module.exports = router