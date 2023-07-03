const express = require('express')
const upload = require('../../../utilis/upload')
const router = express.Router()
const user = require('../../../controller/userController')

router.post('/update/username/:userId',user.updateUser) 
router.post('/update/email/:userId', user.editPassword)



module.exports = router