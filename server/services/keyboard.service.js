const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createKeyboard = async (req, res, next) => {
  try {
    const newKeyboard = await db.query(
      `insert into keyboard (model, color, communication, amount_button, size, weight, led, software, type, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
      [
        req.body.model,
        req.body.color,
        req.body.communication,
        req.body.amount_button,
        req.body.size,
        req.body.weight,
        req.body.led,
        req.body.software,
        req.body.type,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res
      .status(200)
      .json({ ...newKeyboard.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailKeyboard = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from keyboard`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailKeyboardTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from keyboard where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailKeyboard = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from keyboard where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateKeyboard = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "keyboard",
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

module.exports.deleteKeyboard = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from keyboard where keyboard_id = $1 returning *`,
      [req.query.keyboard_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
