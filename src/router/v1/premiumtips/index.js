const express = require('express')
const premiumTips = require('../../../controller/premiumtipsController')
const router = express.Router()

router.post('/premium', premiumTips.addPremiumTips)
router.get('/premium', premiumTips.getallTips)
router.delete('/premium/:tipId', premiumTips.deletefreetips)
router.put('/premium/:tipId', premiumTips.updatepremiumTip)



module.exports = router