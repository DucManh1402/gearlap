const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();

    let tbuser = await functionConfig.findUserByEmail(email);

    if (!tbuser) {
      return res.status(400).json({ message: "Không tìm thấy email" });
    } else if (tbuser.verified_email === null) {
      return res.status(400).json({
        message:
          "Tài khoản của bạn chưa được xác thực. Vui lòng xác thực gmail",
      });
    }

    const isPasswordMatched = await functionConfig.checkHashString(
      req.body.password,
      tbuser.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Mật khẩu sai" });
    } else if (tbuser.role !== "admin") {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    let tokeninfo = {
      user: {
        id: tbuser.user_id,
        name: tbuser.name,
        birthdate: tbuser.birthdate,
        email: tbuser.email,
        address: tbuser.address,
        phone: tbuser.phone,
        status: tbuser.status,
        google_id: tbuser.google_id,
        facebook_id: tbuser.facebook_id,
        role: tbuser.role,
        verified_email: tbuser.verified_email,
      },
    };

    const accessToken = await functionConfig.generateAccessToken(tokeninfo);

    res.cookie("glcookie", accessToken, {
      maxAge: 90000000,
      httpOnly: true,
    });
    res.status(200).json({
      token: accessToken,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
