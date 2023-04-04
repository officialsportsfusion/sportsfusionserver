const express = require('express')

const router = express.Router()


router.get('/', (req, res)=>{
    res.status(200).json({
        message: "Server is running",
      });
})

router.use("/v1", require("./v1/user"));
router.use("/v1", require("./v1/booking"));

module.exports = router