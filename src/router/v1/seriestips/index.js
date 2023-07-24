const express = require('express')
const router = express.Router()
const series = require('../../../controller/series')

router.post('/series', series.addseriestips )
router.get('/series', series.getallTips)
router.get('/series/:tipId', series.getTip)
router.delete('/series/:tipId', series.deleteseriestips)
router.put('/series/:tipId', series.updateSeriesTip)


module.exports = router