const express = require('express')
const upload = require('../../../utilis/upload')
const router = express.Router()
const user = require('../../../controller/userController')

router.post('/update/username/:userId',user.updateUser) 
router.post('/update/password/:userId', user.editPassword)
// router.put('/profilePicUpload/',upload,user.addProfilePicture); //for profile
router.get('/user/:userId',user.getSingleUser)



module.exports = router