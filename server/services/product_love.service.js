const moment = require("moment");

const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createLoveProduct = async (req, res, next) => {
  try {
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    const checkExist = await db.getFirstResult(
      `select * from love_product where product_id = $1 and user_id = $2`,
      [req.body.product_id, req.user.user.id]
    );
    if (checkExist)
      return res.status(400).json({ message: "Đã thêm vào yêu thích" });

    const newLoveProduct = await db.query(
      `insert into love_product (user_id, type_id, product_id, created_at, updated_at)
        values ($1, $2, $3, $4, $5) returning *`,
      [
        req.user.user.id,
        req.body.type_id,
        req.body.product_id,
        created_at,
        updated_at,
      ]
    );

    res
      .status(200)
      .json({ ...newLoveProduct.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateLoveProduct = async (req, res, next) => {
  try {
    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "love_id",
      req.query.love_id,
      "love_product",
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

module.exports.deleteLoveProduct = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from love_product where love_id = $1 returning *`,
      [req.query.love_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllProductByUser = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from
      (select *, count(*) over() as full_count from love_product where user_id = $1) as tbl1
      left join
      (select * from product) as tbl2
      on tbl1.product_id = tbl2.product_id`,
      [req.user.user.id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.filterProductByUser = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from
      (select *, count(*) over() as full_count from love_product where type_id = $1) as tbl1
      left join
      (select * from product) as tbl2
      on tbl1.product_id = tbl2.product_id`,
      [req.query.type_id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailLoveProduct = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from
      (select * from love_product where love_id = $1) as tbl1
      left join
      (select * from product) as tbl2
      on tbl1.product_id = tbl2.product_id`,
      [req.query.love_id]
    );
    return res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
