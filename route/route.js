const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const auth = require("./auth_route");
const user = require("./user_route");

router.use(morgan("dev"));
router.use("/auth", auth);
router.use("/user", user);
module.exports = router;
