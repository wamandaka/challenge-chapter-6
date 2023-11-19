require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const router = require("./route/route");
const port = process.env.PORT || 3000;
const jwtMiddleware = require("./middleware/jwt");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    // cookie: {
    //   secure: true,
    //   maxAge: 60000,
    // },
    // name: "session",
    // keys: ["secret"],
    // maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

const passport = require("./lib/passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const authUser = require("./route/auth_route");
app.use(authUser);

app.use("/", router);

app.get("/auth/logout", (req, res) => {
  // Hapus sesi pengguna
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Redirect ke halaman beranda atau halaman login setelah logout
    res.redirect("/auth/login");
  });
});

app.get("/", (req, res) => {
  // res.send("Hallo, Selamat datang!");
  res.render("login.ejs");
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}. visit http://localhost:${port}`
  );
});
