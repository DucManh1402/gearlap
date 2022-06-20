const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../util/database");

module.exports.authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies["glcookie"];

    token = token == null ? req.headers.authorization : token;

    if (token == null)
      return res
        .status(401)
        .json({ message: "Token không hợp lệ, vui lòng đăng nhập lại" });
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại" });
      }

      req.user = user;
      req.token = token;
      next();
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.verifyGG = async (req, res, next) => {
  try {
    fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${req.body.token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw new Error(res.error);
        }
        req.ggInfo = res;
        next();
      })
      .catch((e) => {
        res.status(400).send({
          message: e.message,
        });
      });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.verifyFB = async (req, res, next) => {
  try {
    fetch(
      `https://graph.facebook.com/v12.0/me?fields=id%2Cname%2Cemail&access_token=${req.body.token}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message);
        }
        req.fbInfo = res;
        next();
      })
      .catch((e) => {
        res.status(400).send({
          message: e.message,
        });
      });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getToken = async (req, res, next) => {
  try {
    let token = req.cookies["glcookie"];

    token = token == null ? req.headers.authorization : token;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).json({
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
          });
        }

        req.user = user;
        req.token = token;
        next();
      });
    } else {
      req.user = null;
      req.token = null;
      next();
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
