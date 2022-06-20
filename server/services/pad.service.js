const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createPad = async (req, res, next) => {
  try {
    const newPad = await db.query(
      `insert into pad (model, color, size, size_type, material, led, software, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        req.body.model,
        req.body.color,
        req.body.size,
        req.body.size_type,
        req.body.material,
        req.body.led,
        req.body.software,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newPad.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailPad = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *,  count(*) over() as full_count from pad`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailPadTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from pad where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailPad = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from pad where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updatePad = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "pad",
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

module.exports.deletePad = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from pad where pad_id = $1 returning *`,
      [req.query.pad_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
