const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createLaptop = async (req, res, next) => {
  try {
    const newLaptop = await db.query(
      `insert into laptop (model, disk, cpu, ram, vga, monitor, communication, audio, read_memory, lan, wifi, bluetooth, webcam, operator, pin, weight, size, type, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) returning *`,
      [
        req.body.model,
        req.body.disk,
        req.body.cpu,
        req.body.ram,
        req.body.vga,
        req.body.monitor,
        req.body.communication,
        req.body.audio,
        req.body.read_memory,
        req.body.lan,
        req.body.wifi,
        req.body.bluetooth,
        req.body.webcam,
        req.body.operator,
        req.body.pin,
        req.body.weight,
        req.body.size,
        req.body.type,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newLaptop.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailLaptop = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *,  count(*) over() as full_count from laptop`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailLaptopTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *,  count(*) over() as full_count from laptop where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailLaptop = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select *, null as intro from laptop where product_id = $1`,
      [req.query.product_id]
    );

    const introDetail = [
      "Hỗ trợ đổi mới trong 7 ngày",
      "Windows bản quyền tích hợp",
    ];

    result.intro = introDetail;

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateLaptop = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "laptop",
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

module.exports.deleteLaptop = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from laptop where laptop_id = $1 returning *`,
      [req.query.laptop_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
