const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
var jwt = require("jsonwebtoken");
const { ResponseTemplate } = require("../helper/template_helper");

async function register(req, res, next) {
  try {
    let { name, email, password } = req.body;
    let existUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      // let resp = ResponseTemplate(null, "User already exist", null, 200);
      // res.json(resp);
      req.flash("error", "email already used");
      res.redirect("/auth/register");
      return;
    }
    let encriptedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: encriptedPassword,
      },
    });
    res.redirect("/auth/login");
    return;
  } catch (error) {
    next(error);
  }
}

async function authUser(email, password, done) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Incorrect email or password" });
    } else {
      return done(null, user);
    }
  } catch (error) {
    return done(null, false, { message: "Incorrect email or password" });
  }
}
async function dashboard(req, res, next) {
  // res.json(req.user);
  // res.send("Dashboard");
  res.render("dashboard.ejs", { user: req.user });
}

module.exports = { register, authUser, dashboard };
