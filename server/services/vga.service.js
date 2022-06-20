const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createVGA = async (req, res, next) => {
  try {
    const newVGA = await db.query(
      `insert into vga (model, gpu, cuda, memory_clock, capacity, bus, type_memory, bus_memory, bandwidth_memory, resolution, multi_monitor, size, pcb_form, directx, opengl, power, image_detail, product_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) returning *`,
      [
        req.body.model,
        req.body.gpu,
        req.body.cuda,
        req.body.memory_clock,
        req.body.capacity,
        req.body.bus,
        req.body.type_memory,
        req.body.bus_memory,
        req.body.bandwidth_memory,
        req.body.resolution,
        req.body.multi_monitor,
        req.body.size,
        req.body.pcb_form,
        req.body.directx,
        req.body.opengl,
        req.body.power,
        req.body.image_detail,
        req.body.product_id,
      ]
    );

    res.status(200).json({ ...newVGA.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailVGA = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from vga`,
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllDetailVGATrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from vga where status = $1`,
      [true]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailVGA = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from vga where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateVGA = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "product_id",
      req.query.product_id,
      "vga",
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

module.exports.deleteVGA = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from vga where vga_id = $1 returning *`,
      [req.query.vga_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
