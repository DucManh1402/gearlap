const moment = require("moment");
const db = require("../util/database");

module.exports.createFeedback = async (req, res, next) => {
  try {
    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    const checkExist = await db.getFirstResult(
      `select name, order_id from
      (select user_id, order_id, product_id from feedback where order_id = $1 and user_id = $2 and product_id = $3) as tbl1
      left join
      (select name, product_id from product where product_id = $3) as tbl2
      on tbl1.product_id = tbl2.product_id`,
      [req.body.order_id, req.user.user.id, req.body.product_id]
    );

    if (checkExist)
      return res.status(400).json({
        message: `Bạn đã đánh giá sản phẩm ${
          checkExist.name
        } đơn hàng ${req.body.order_id.split("-").at(-1)} này rồi`,
      });

    const newFeedback = await db.query(
      `insert into feedback (user_id, content, created_at, updated_at, product_id, star, order_id)
            values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [
        req.user.user.id,
        req.body.content,
        created_at,
        updated_at,
        req.body.product_id,
        req.body.star,
        req.body.order_id,
      ]
    );

    const product = await db.getFirstResult(
      `select sum(star) as sum, (select count(feedback_id) over() from feedback where product_id = $1 limit 1)
      as full_count from feedback  where product_id = $1`,
      [req.body.product_id]
    );

    await db.executeQuery(
      `update product set amount_star = $1, amount_feedback = $2 where product_id = $3`,
      [
        product.sum / product.full_count,
        product.full_count,
        req.body.product_id,
      ]
    );

    res
      .status(200)
      .json({ ...newFeedback.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllFeedback = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from
      (select *, count(*) over() as full_count from feedback where product_id = $1) t1
      left join
      (select name, user_id from users) t2
      on t1.user_id = t2.user_id`,
      [req.query.product_id]
    );

    const amountStar = await db.getResultList(
      `select (select count(*) over() as full_count from feedback where product_id = $1 and star = 1 limit 1) as count_1,
      (select count(*) over() as full_count from feedback where product_id = $1 and star = 2 limit 1) as count_2,
      (select count(*) over() as full_count from feedback where product_id = $1 and star = 3 limit 1) as count_3,
      (select count(*) over() as full_count from feedback where product_id = $1 and star = 4 limit 1) as count_4,
      (select count(*) over() as full_count from feedback where product_id = $1 and star = 5 limit 1) as count_5 from feedback where product_id = $1`,
      [req.query.product_id]
    );

    res.status(200).json({
      data: result,
      amountStar: amountStar[0]
        ? amountStar[0]
        : {
            count_1: null,
            count_2: null,
            count_3: null,
            count_4: null,
            count_5: null,
          },
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllUserFeedbackOneProduct = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select *, count(*) over() as full_count from feedback where product_id = $1 and user_id = $2`,
      [req.query.product_id, req.user.user.id]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateFeedback = async (req, res, next) => {
  try {
    const updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    const updateFeedback = await db.query(
      `update feedback set content = $1, star = $2, updated_at = $3, status = $4 where user_id = $5 
      and feedback_id = $6 and product_id = $7 returning *`,
      [
        req.body.content,
        req.body.star,
        updated_at,
        "Đã chỉnh sửa",
        req.user.user.id,
        req.query.feedback_id,
        req.query.product_id,
      ]
    );

    const product = await db.getFirstResult(
      `select sum(star) as sum, (select count(feedback_id) over() from feedback where product_id = $1 limit 1)
          as full_count from feedback  where product_id = $1`,
      [req.query.product_id]
    );

    await db.executeQuery(
      `update product set amount_star = $1, amount_feedback = $2 where product_id = $3`,
      [
        product.sum / product.full_count,
        product.full_count,
        req.query.product_id,
      ]
    );

    if (updateFeedback && product)
      return res.status(200).json({
        ...updateFeedback.rows[0],
        message: "Cập nhật thông tin thành công",
      });
    else return res.status(400).json({ message: "Lỗi cập nhật" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getFeedbackStarProduct = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from
      (select *, count(*) over() as full_count from feedback where product_id = $1 and star = $2) t1
      left join
      (select name, user_id from users) t2
      on t1.user_id = t2.user_id`,
      [req.query.product_id, req.query.star]
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
