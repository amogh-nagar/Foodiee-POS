var express = require('express')
var router = express.Router();
router.use("/superAdmin", require("./routes/superAdmin"))
module.exports = router;