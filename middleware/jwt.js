const { ResponseTemplate } = require("../helper/template_helper");
// const Joi = require("joi");
const jwt = require("jsonwebtoken");
async function Auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    let resp = ResponseTemplate(false, "you'r not authorized", null, 400);
    res.json(resp);
    return;
  }

  jwt.verify(authorization, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      let resp = ResponseTemplate(false, "token invalid", null, 401);
      res.json(resp);
      return;
    }
    req.user = user;
    next();
  });
}

module.exports = { Auth };
