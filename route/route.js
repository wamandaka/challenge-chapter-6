const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const auth = require("./auth_route");
const media = require("./media_route");

router.use(morgan("dev"));
router.use("/auth", auth);
router.use("/user", media);
module.exports = router;
