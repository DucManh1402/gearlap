const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createHDD = async (req, res, next) => {
  try {
    const newHDD = await db.query(
      `insert into hdd (model, communication, capacity, write_speed, read_speed, weight, color, image_detail, size, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,
      [
        req.body.model,
        req.body.communication,
        req.body.capacity,
        req.body.write_speed,
        req.body.read_speed,
        req.body.weight,
        req.body.color,
        req.body.image_detail,
        req.body.size,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newHDD.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailHDD = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from hdd`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailHDDTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from hdd where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailHDD = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from hdd where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateHDD = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "hdd",
      req.body
    );

    const colValues = Object.keys(req.body).map((key) => {
      return req.body[key];
    });

    const result = await db.query(
      `${queryStringUpdate} returning *`,
      colValues
    );
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

module.exports.deleteHDD = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from hdd where hdd_id = $1 returning *`,
      [req.query.hdd_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
