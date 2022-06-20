const db = require("../util/database");

module.exports.verifiedEmail = async (req, res, next) => {
  try {
    let email = req.url.split("/")[2];

    let checkUser = await db.getFirstResult(
      "select * from users where email = $1",
      [email]
    );

    if (checkUser.verified_email === "verified") {
      return res.status(400).json({ message: "Tài khoản đã được xác thực" });
    }
    next();
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
