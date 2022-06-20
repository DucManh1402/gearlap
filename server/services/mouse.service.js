const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createMouse = async (req, res, next) => {
  try {
    const newMouse = await db.query(
      `insert into mouse (model, button, color, switch, size, weight, led, length, software, communication, dpi, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`,
      [
        req.body.model,
        req.body.button,
        req.body.color,
        req.body.switch,
        req.body.size,
        req.body.weight,
        req.body.led,
        req.body.length,
        req.body.software,
        req.body.communication,
        req.body.dpi,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newMouse.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailMouse = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from mouse`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailMouseTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from mouse where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailMouse = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from mouse where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateMouse = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "mouse",
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

module.exports.deleteMouse = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from mouse where mouse_id = $1 returning *`,
      [req.query.mouse_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
