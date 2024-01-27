var express = require('express')
var router = express.Router();
router.use("/superAdmin", require("./routes/superAdmin"))
router.use("/tenants", require("./routes/tenant"))
router.use("/brands", require("./routes/brands"))
router.use("/users", require("./routes/user"))
router.use("/roles", require("./routes/role"))
router.use("/outlets", require("./routes/outlet"))
router.use("/auth", require("./routes/auth"));
router.use("/dishes", require("./routes/dish"))
router.use("/superCategories", require("./routes/superCategories"))
router.use("/categories", require("./routes/categories"))
module.exports = router;