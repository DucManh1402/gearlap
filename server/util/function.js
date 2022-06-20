const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("../util/database");

module.exports.checkHashString = (plaintext, hashedString) => {
  const isMatched = bcrypt.compareSync(plaintext, hashedString);
  return isMatched;
};

module.exports.generateHashString = (plaintext) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plaintext, salt);
  return hash;
};

module.exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 168,
  });
};

module.exports.findUserByEmail = async (email) => {
  const result = await db.getFirstResult(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result;
};

module.exports.updateQueryByOneCondition = async (
  param,
  condition,
  table,
  cols
) => {
  let query = [`update ${table}`];
  query.push("set");

  let set = [];

  Object.keys(cols).forEach(function (key, i) {
    set.push(`${key} = $${i + 1}`);
  });
  query.push(set.join(", "));

  query.push(`where ${param} = '${condition}'`);

  return query.join(" ");
};
