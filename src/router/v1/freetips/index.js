const express = require('express')
const freeTips = require('../../../controller/freetipsController')
const router = express.Router()

router.post('/freetip', freeTips.addfreetips)
router.get('/freetip', freeTips.getallTips)
router.put('/freetip/:tipId', freeTips.updatefreeTip)
router.delete('/freetip/:tipId', freeTips.deletefreetips)

module.exports = router