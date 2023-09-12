const router = require('express').Router()
const AccaTip = require('../../../controller/Acca')



router.post('/accatip', AccaTip.addAccatips)
router.get('/accatip', AccaTip.getallTips)
router.put('/accatip/:tipId', AccaTip.updateAccaTip)
router.delete('/accatip/:tipId', AccaTip.deleteAccatips)
router.get('/accatip/:tipId', AccaTip.getTip)


module.exports = router