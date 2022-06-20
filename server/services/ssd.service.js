const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createSSD = async (req, res, next) => {
  try {
    const newSSD = await db.query(
      `insert into ssd (model, size, communication, capacity, write_speed, read_speed, weight, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        req.body.model,
        req.body.size,
        req.body.communication,
        req.body.capacity,
        req.body.write_speed,
        req.body.read_speed,
        req.body.weight,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newSSD.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailSSD = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from ssd`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailSSDTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from ssd where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailSSD = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from ssd where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateSSD = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "ssd",
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

module.exports.deleteSSD = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from ssd where ssd_id = $1 returning *`,
      [req.query.ssd_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
