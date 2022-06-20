const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createCable = async (req, res, next) => {
  try {
    const newCable = await db.query(
      `insert into cable (model, color, type, material, efficiency, bandwidth, cable_protection, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        req.body.model,
        req.body.color,
        req.body.type,
        req.body.material,
        req.body.efficiency,
        req.body.bandwidth,
        req.body.cable_protection,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newCable.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailCable = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *,  count(*) over() as full_count from cable`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailCableTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from cable where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailCable = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from cable where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateCable = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "cable",
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

module.exports.deleteCable = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from cable where cable_id = $1 returning *`,
      [req.query.pad_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
