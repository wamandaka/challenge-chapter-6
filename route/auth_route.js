const express = require("express");
const router = express.Router();
const {
  register,
  dashboard,
  authUser,
} = require("../controller/auth_controller");

router.get("/auth/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/auth/register", register);

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

const passport = require("../lib/passport");
const restrict = require("../middleware/restrict");
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

// router.post("/auth/login", authUser);

router.get("/dashboard", restrict, dashboard);
module.exports = router;
