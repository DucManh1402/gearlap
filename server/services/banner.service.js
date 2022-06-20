const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createBanner = async (req, res, next) => {
  try {
    await db.executeQuery(
      `insert into banner (url, link, status)
        values ($1, $2, $3) returning *`,
      [req.body.url, req.body.link, "true"]
    );

    res.status(200).json({ message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllBanner = async (req, res, next) => {
  try {
    const result = await db.getResultList(`select * from banner`, []);

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateBanner = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "banner_id",
      req.query.banner_id,
      "banner",
      req.body
    );

    const colValues = Object.keys(req.body).map((key) => {
      return req.body[key];
    });

    const result = await db.query(`${queryStringUpdate}`, colValues);
    if (result)
      return res
        .status(200)
        .json({ ...result.rows[0], message: "Cập nhật thông tin thành công" });
    else return res.status(400).json({ message: "Lỗi cập nhật" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailBanner = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from banner where banner_id = $1`,
      [req.query.banner_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllBannersStatusTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from banner where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.deleteBanner = async (req, res, next) => {
  try {
    const result = await db.query(`delete from banner where banner_id = $1 returning *`, [
      req.query.banner_id,
    ]);

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
