const randomstring = require("randomstring");
const db = require("../util/database");
const functionConfig = require("../util/function");
const EmailConfig = require("../config/email");

module.exports.signUp = async (req, res, next) => {
  try {
    const randomString = randomstring.generate({
      length: 12,
      charset: "alphabetic",
    });

    let tbuser = await functionConfig.findUserByEmail(req.body.email);

    if (tbuser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashPasword = await functionConfig.generateHashString(
      req.body.password
    );

    await db.executeQuery(
      `insert into users (name, birthdate, email, password, address, phone, status, google_id, facebook_id, verified_code)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,
      [
        req.body.name,
        req.body.birthdate,
        req.body.email,
        hashPasword,
        req.body.address,
        req.body.phone,
        "working",
        "",
        "",
        randomString,
      ]
    );

    const header = `<h3>GearLap - Kích hoạt tài khoản</h3>`;
    const noidung = `<p>Xin chào ${req.body.name}!</p><p>Cảm ơn bạn đăng ký sử dụng GearLap.</p><p>Vui lòng click vào link bên dưới để kích hoạt tài khoản!</p><b><a href='https://gear-lap.herokuapp.com/api/users/verified-email/${req.body.email}/${randomString}'>Kích hoạt</a>`;
    const bodyEmail = header + noidung;

    EmailConfig.sendSupportEmail({
      subject: `Gearlap - Kích hoạt tài khoản`,
      to: `Quý khách - ${req.body.email}`,
      body: bodyEmail,
    });

    res
      .status(200)
      .json({ message: "Đăng ký thành công. Vui lòng xác thực email" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const { email } = req.user.user;

    const result = await db.getFirstResult(
      "select * from users where email = $1",
      [email]
    );

    const user = {
      user_id: result.user_id,
      name: result.name,
      birthdate: result.birthdate,
      email: result.email,
      address: result.address,
      phone: result.phone,
      status: result.status,
      google_id: result.google_id,
      facebook_id: result.facebook_id,
      role: result.role,
      verified_email: result.verified_email,
    };

    res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.postSyncGoogle = async (req, res, next) => {
  try {
    if (req.user.user.email !== req.ggInfo.email) {
      res.status(400).send({
        message: "Tài khoản liên kết email phải trùng với tài khoản đã đăng ký",
      });
    }

    const result = await db.query(
      `update users set google_id = $1 where user_id = $2 
      returning name, birthdate, email, address, phone, google_id, facebook_id`,
      [req.ggInfo.sub, req.user.user.id]
    );

    if (!result.rowCount)
      return res.status(400).json({ message: "Lỗi liên kết" });
    return res.status(200).json({ message: "Liên kết thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.postSyncFacebook = async (req, res, next) => {
  try {
    const result = await db.query(
      `update users set facebook_id = $1 where user_id = $2
      returning name, birthdate, email, address, phone, google_id, facebook_id`,
      [req.fbInfo.id, req.user.user.id]
    );

    if (!result.rowCount)
      return res.status(400).json({ message: "Lỗi liên kết" });
    return res.status(200).json({ message: "Liên kết thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.postUnsyncFacebookAndGoogle = async (req, res, next) => {
  try {
    if (req.body.type === "gg") {
      const result = await db.query(
        `update users set google_id = '' where user_id = $1
      returning name, birthdate, email, address, phone, google_id, facebook_id`,
        [req.user.user.id]
      );

      if (!result.rowCount)
        return res.status(400).json({ message: "Huỷ liên kết thất bại" });
      return res.status(200).json({ message: "Huỷ liên kết thành công" });
    } else {
      const result = await db.query(
        `update users set facebook_id = '' where user_id = $1
      returning name, birthdate, email, address, phone, google_id, facebook_id`,
        [req.user.user.id]
      );

      if (!result.rowCount)
        return res.status(400).json({ message: "Huỷ liên kết thất bại" });
      return res.status(200).json({ message: "Huỷ liên kết thành công" });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.postVerifiedAccount = async (req, res, next) => {
  try {
    let email = req.url.split("/")[2];
    let code = req.url.split("/")[3];

    let checkUser = await db.getFirstResult(
      "select * from users where email = $1 and verified_code = $2",
      [email, code]
    );

    if (!checkUser) {
      return res
        .status(400)
        .json({ message: "Lỗi kích hoạt tài khoản. Vui lòng liên hệ hỗ trợ" });
    } else {
      await db.executeQuery(
        "update users set verified_email = $1, verified_code = $2 ",
        ["verified", null]
      );
      res.redirect("https://gear-lap.herokuapp.com/login");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "email",
      req.user.user.email,
      "users",
      req.body
    );

    const colValues = Object.keys(req.body).map((key) => {
      return req.body[key];
    });

    const result = await db.query(`${queryStringUpdate}`, colValues);
    if (result)
      return res.status(200).json({ message: "Cập nhật thông tin thành công" });
    else return res.status(400).json({ message: "Lỗi cập nhật" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    let tbuser = await functionConfig.findUserByEmail(req.user.user.email);

    const isPasswordMatched = await functionConfig.checkHashString(
      req.body.oldPassword,
      tbuser.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Mật khẩu cũ nhập không đúng" });
    } else if (req.body.oldPassword === req.body.newPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ" });
    } else if (req.body.newPassword !== req.body.repeatPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu nhập lại không trùng với mật khẩu mới" });
    }

    const hashPasword = await functionConfig.generateHashString(
      req.body.newPassword
    );

    const result = await db.query(
      `update users set password = $1 where email = $2`,
      [hashPasword, req.user.user.email]
    );
    if (result)
      return res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
    else return res.status(400).json({ message: "Lỗi cập nhật" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
