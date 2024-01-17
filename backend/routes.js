var express = require('express')
var router = express.Router();
router.use("/superAdmin", require("./routes/superAdmin"))
router.use("/tenants", require("./routes/tenant"))
router.use("/brands", require("./routes/brands"))
router.use("/auth", require("./routes/auth"));
module.exports = router;