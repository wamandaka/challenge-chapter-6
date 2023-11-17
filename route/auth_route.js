const express = require("express");
const router = express.Router();
const { register, dashboard } = require("../controller/auth_controller");

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", register);

router.get("/auth/login", (req, res) => {
  res.render("login.ejs");
});

const passport = require("../lib/passport");
const restrict = require("../middleware/restrict");
router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/dashboard", restrict, dashboard);
module.exports = router;
