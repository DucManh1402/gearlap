const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createMonitor = async (req, res, next) => {
  try {
    const newMonitor = await db.query(
      `insert into monitor (model, size, panel, resolution, static_contrast, dynamic_contrast, brightness, response_time, view, type, color_view, communication, weight, power, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning *`,
      [
        req.body.model,
        req.body.size,
        req.body.panel,
        req.body.resolution,
        req.body.static_contrast,
        req.body.dynamic_contrast,
        req.body.brightness,
        req.body.response_time,
        req.body.view,
        req.body.type,
        req.body.color_view,
        req.body.communication,
        req.body.weight,
        req.body.power,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newMonitor.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailMonitor = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from monitor`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailMonitorTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from monitor where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailMonitor = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from monitor where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateMonitor = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "monitor",
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

module.exports.deleteMonitor = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from monitor where monitor_id = $1 returning *`,
      [req.query.monitor_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
