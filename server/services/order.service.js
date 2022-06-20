const moment = require("moment");

const db = require("../util/database");
const FormatNumber = require("../util/FormatNumber");
const EmailConfig = require("../config/email");

module.exports.orderProduct = async (req, res, next) => {
  try {
    const user_id = req.user?.user ? req.user.user.id : req.body.user_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.user?.user ? req.user.user.email : req.body.email;
    const address = req.body.address;
    const waiting_time = moment().format("YYYY-MM-DD HH:mm:ss");
    const delivery_time = moment().format("YYYY-MM-DD HH:mm:ss");
    const payment_time = moment().format("YYYY-MM-DD HH:mm:ss");
    const cancel_time = moment().format("YYYY-MM-DD HH:mm:ss");
    const feedback_time = moment().format("YYYY-MM-DD HH:mm:ss");
    const transport_fee = req.body.transport_fee;
    const listProduct = req.body.listproduct;
    let subtotalAll = 0;
    let str_product = "";
    let listProductId = "";
    let listQuantity = [];
    let listSubtotal = [];
    let listOrderID = [];
    let errorMessage = [];
    let queryUpdate = "";
    let errorData = [];

    listProduct.forEach((item) => {
      listProductId += `'${item.product_id}', `;
      listQuantity.push(item.quantity);
    });
    listProductId = listProductId.slice(0, -2);

    const listPriceNow = await db.getResultList(
      `select product_id, name, price_now, amount, amount_sale from product where product_id in (${listProductId})`,
      []
    );

    listPriceNow.forEach((item) => {
      if (Number(item.amount) === 0) {
        const product = { product_id: item.product_id, quantity: item.amount };
        errorData.push(product);
        errorMessage.push(`Sản phẩm ${item.name} đã hết hàng`);
      }
    });

    if (errorMessage.length > 0)
      return res.status(400).json({ data: errorData, message: errorMessage });

    listProduct.forEach((item) => {
      const product = listPriceNow.find(
        ({ product_id }) => product_id === item.product_id
      );
      if (product && product.amount !== 0) {
        listSubtotal.push(Number(item.quantity) * product.price_now);
        subtotalAll += Number(item.quantity) * product.price_now;
        queryUpdate += `('${item.product_id}'::uuid, ${
          Number(product.amount) - Number(item.quantity)
        }, ${Number(product.amount_sale) + Number(item.quantity)}), `;
        str_product += `<li>Sản phẩm: ${product.name} - Số lượng: ${
          item.quantity
        } - Thành tiền: ${FormatNumber.numberWithCommas(
          Number(item.quantity) * product.price_now
        )} VNĐ</li>`;
      }
    });

    queryUpdate = queryUpdate.slice(0, -2);

    const total = transport_fee + subtotalAll;

    const newOrder = await db.query(
      `insert into orders (user_id, transport_fee, subtotal, status, method, waiting_time, delivery_time, payment_time, name, address, phone, total, email, cancel_time, feedback_time)
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning *`,
      [
        user_id,
        transport_fee,
        subtotalAll,
        "waiting",
        req.body.method,
        waiting_time,
        delivery_time,
        payment_time,
        name,
        address,
        phone,
        total,
        email,
        cancel_time,
        feedback_time,
      ]
    );

    listOrderID = Array(listProduct.length).fill(
      `'${newOrder.rows[0].order_id}'`
    );

    await db.query(
      `insert into order_detail (order_id, quantity, subtotal, product_id)
      (select * from 
      unnest(array[${listOrderID}]::uuid[], array[${listQuantity}], array[${listSubtotal}], array[${listProductId}]::uuid[]))`,
      []
    );

    await db.query(
      `update product
      set amount_sale = nv.amount_sale, amount = nv.amount from
      (values ${queryUpdate}) as nv (product_id, amount, amount_sale) where product.product_id = nv.product_id returning *`,
      []
    );

    const header = `<h3>Cảm ơn ${name} đã đặt hàng ở GearLap</h3>`;
    const body = `<p>Khách hàng ${name} đã đặt hàng theo thông tin: </p><ul><li>Đơn hàng: ${newOrder.rows[0].order_id
      .split("-")
      .at(
        -1
      )}</li><li>Tên khách hàng: ${name}</li><li>Email: ${email}</li><li>Số điện thoại: ${phone}</li><li>Tổng tiền sản phẩm: ${FormatNumber.numberWithCommas(
      subtotalAll
    )} VNĐ</li><li>Phí giao hàng: ${FormatNumber.numberWithCommas(
      transport_fee
    )} VNĐ</li><li>Tổng cộng: ${FormatNumber.numberWithCommas(
      total
    )} VNĐ</li></ul><p>Sản phẩm đã đặt hàng:</p><ul>${str_product}</ul><p>Thời gian đặt hàng: ${waiting_time}</p><p>Mua lòng chờ hệ thống sẽ liên hệ xác nhận đặt hàng</p>`;

    const contentMail = header + body;

    EmailConfig.sendSupportEmail({
      subject: `Gearlap - Đặt hàng sản phẩm`,
      to: `Quý khách - ${email}`,
      body: contentMail,
    });

    res.status(200).json({ message: "Đặt hàng thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateOrderProduct = async (req, res, next) => {
  try {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    let result = "";

    const checkItem = await db.getFirstResult(
      `select method from orders where order_id = $1`,
      [req.query.order_id]
    );

    if (checkItem.method === "Momo") {
      result = await db.query(
        `update orders set status = $2 where order_id = $1 returning *`,
        [req.query.order_id, req.body.status]
      );
    } else {
      result = await db.query(
        `update orders set ${req.body.status}_time = $2, status = $3 where order_id = $1 returning *`,
        [req.query.order_id, time, req.body.status]
      );
    }

    if (req.body.status === "cancel") {
      let queryUpdate = "";

      const result = await db.getFirstResult(
        `select listproduct from
        (select order_id from orders where order_id = $1) as tbl1
        left join
        (select order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'amount_sale', amount_sale, 'amount', amount)) as listproduct from
        (select order_id, product_id, quantity from order_detail where order_id = (select order_id from orders where order_id = $1)) as t1
        left join
        (select product_id, amount_sale, amount from product where product_id in (select product_id from orders where order_id = $1)) as t2
        on t1.product_id = t2.product_id group by 1) as tbl2 on tbl1.order_id = tbl2.order_id`,
        [req.query.order_id]
      );

      const listproduct = result.listproduct;

      listproduct.forEach((item) => {
        queryUpdate += `('${item.product_id}'::uuid, ${
          Number(item.amount) + Number(item.quantity)
        }, ${Number(item.amount_sale) - Number(item.quantity)}), `;
      });

      queryUpdate = queryUpdate.slice(0, -2);

      await db.query(
        `update product
        set amount_sale = nv.amount_sale, amount = nv.amount from
        (values ${queryUpdate}) as nv (product_id, amount, amount_sale) where product.product_id = nv.product_id returning *`,
        []
      );
    }

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

module.exports.getAllOrderByUser = async (req, res, next) => {
  try {
    const type = req.query.type;

    if (type == "feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select *, count(*) over() as full_count from orders where user_id = $1 and status = $2) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where user_id = $1 and status = $2)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id where feedback_id is not null order by ${status}_time desc`,
        [req.user.user.id, status]
      );

      return res.status(200).json(result);
    } else if (type == "un-feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select *, count(*) over() as full_count from orders where user_id = $1 and status = $2) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where user_id = $1 and status = $2)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id where feedback_id is null order by ${status}_time desc`,
        [req.user.user.id, status]
      );

      return res.status(200).json(result);
    } else {
      const result = await db.getResultList(
        `select * from
        (select *, count(*) over() as full_count from orders where user_id = $1 and status = $2) as tbl1
        left join
        (select t1.order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'subtotal', subtotal, 'name', name, 'status', status, 'image', image, 'price_now', price_now, 'feedback_id', feedback_id)) as listproduct
        from 
          (select * from order_detail where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t1
          left join
          (select name, product_id, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id
          left join
          (select feedback_id, order_id, product_id from feedback where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t3
          on t1.order_id = t3.order_id and t2.product_id = t3.product_id group by 1) as tbl2
        on tbl1.order_id = tbl2.order_id order by ${type}_time desc`,
        [req.user.user.id, type]
      );

      return res.status(200).json(result);
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllOrder = async (req, res, next) => {
  try {
    const type = req.query.type;

    if (type == "feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select * from orders where status = $1) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where status = $1)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where status = $1)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id where feedback_id is not null order by ${status}_time desc`,
        [status]
      );

      return res.status(200).json(result);
    } else if (type == "un-feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select * from orders where status = $1) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where status = $1)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where status = $1)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id where feedback_id is null order by ${status}_time desc`,
        [status]
      );

      return res.status(200).json(result);
    } else {
      const result = await db.getResultList(
        `select * from
      (select *, count(*) over() as full_count from orders where status = $1) as tbl1
      left join
      (select t1.order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'subtotal', subtotal, 'name', name, 'status', status, 'image', image, 'price_now', price_now, 'feedback_id', feedback_id)) as listproduct
      from 
        (select * from order_detail where order_id in (select order_id from orders where status = $1)) as t1
        left join
        (select name, product_id, status, image, price_now from product) as t2
        on t1.product_id = t2.product_id
        left join
        (select feedback_id, order_id, product_id from feedback where order_id in (select order_id from orders where status = $1)) as t3
          on t1.order_id = t3.order_id and t2.product_id = t3.product_id group by 1) as tbl2
      on tbl1.order_id = tbl2.order_id order by ${type}_time desc`,
        [type]
      );

      return res.status(200).json(result);
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllOrderByUserDate = async (req, res, next) => {
  try {
    const type = req.query.type;

    if (type == "feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select *, count(*) over() as full_count from orders where user_id = $1 and status = $2 and ${type}_time::date between 
      $3 and $4) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where user_id = $1 and status = $2)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id order by ${type}_time desc`,
        [
          req.user.user.id,
          status,
          moment(req.query.from).format("YYYY-MM-DD"),
          moment(req.query.to).format("YYYY-MM-DD"),
        ]
      );

      return res.status(200).json(result);
    } else {
      const result = await db.getResultList(
        `select * from
      (select *, count(*) over() as full_count from orders where user_id = $1 and status = $2 and ${type}_time::date between 
      $3 and $4) as tbl1
      left join
      (select t1.order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'subtotal', subtotal, 'name', name, 'status', status, 'image', image, 'price_now', price_now, 'feedback_id', feedback_id)) as listproduct
      from 
        (select * from order_detail where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t1
        left join
        (select name, product_id, status, image, price_now from product) as t2
        on t1.product_id = t2.product_id 
        left join
        (select feedback_id, order_id, product_id from feedback where order_id in (select order_id from orders where user_id = $1 and status = $2)) as t3
          on t1.order_id = t3.order_id and t2.product_id = t3.product_id group by 1) as tbl2
      on tbl1.order_id = tbl2.order_id order by ${type}_time desc`,
        [
          req.user.user.id,
          type,
          moment(req.query.from).format("YYYY-MM-DD"),
          moment(req.query.to).format("YYYY-MM-DD"),
        ]
      );

      return res.status(200).json(result);
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllOrderDate = async (req, res, next) => {
  try {
    const type = req.query.type;

    if (type == "feedback") {
      const status = "payment";

      const result = await db.getResultList(
        `select tbl1.*, tbl2.*, feedback_id, content, created_at, updated_at, star from
        (select *, count(*) over() as full_count from orders where status = $1 and ${type}_time::date between 
        $2 and $3) as tbl1
        left join
        (select order_id, t1.product_id, name_product, status, image, price_now, subtotal, quantity 
          from
          (select * from order_detail where order_id in (select order_id from orders where status = $1)) as t1
          left join
          (select product_id, name as name_product, status, image, price_now from product) as t2
          on t1.product_id = t2.product_id) as tbl2 
        on tbl1.order_id = tbl2.order_id
        left join 
        (select feedback_id, product_id, content, created_at, updated_at, star, order_id from feedback where order_id in (select order_id from orders where status = $1)) as tbl3
        on tbl2.product_id = tbl3.product_id and tbl1.order_id = tbl3.order_id order by ${type}_time desc`,
        [
          status,
          moment(req.query.from).format("YYYY-MM-DD"),
          moment(req.query.to).format("YYYY-MM-DD"),
        ]
      );

      return res.status(200).json(result);
    } else {
      const result = await db.getResultList(
        `select * from
      (select *, count(*) over() as full_count from orders where status = $1 and ${type}_time::date between 
      $2 and $3) as tbl1 
      left join
      (select t1.order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'subtotal', subtotal, 'name', name, 'status', status, 'image', image, 'price_now', price_now, 'feedback_id', feedback_id)) as listproduct
      from 
        (select * from order_detail where order_id in (select order_id from orders where status = $1)) as t1
        left join
        (select name, product_id, status, image, price_now from product) as t2
        on t1.product_id = t2.product_id 
        left join
        (select feedback_id, order_id, product_id from feedback where order_id in (select order_id from orders where status = $1)) as t3
          on t1.order_id = t3.order_id and t2.product_id = t3.product_id group by 1) as tbl2
      on tbl1.order_id = tbl2.order_id order by ${type}_time desc`,
        [
          type,
          moment(req.query.from).format("YYYY-MM-DD"),
          moment(req.query.to).format("YYYY-MM-DD"),
        ]
      );

      return res.status(200).json(result);
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getDetailOrder = async (req, res, next) => {
  try {
    const result = await db.getFirstResult(
      `select * from 
      (select * from orders where order_id = $1) as tbl1
      left join
      (select order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'subtotal', subtotal, 'name', name, 'status', status, 'image', image, 'price_now', price_now)) as listproduct
      from 
        (select * from order_detail where order_id = (select order_id from orders where order_id = $1)) as t1
        left join
        (select name, product_id, status, image, price_now from product) as t2
        on t1.product_id = t2.product_id group by 1) as tbl2
      on tbl1.order_id = tbl2.order_id`,
      [req.query.order_id]
    );
    return res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
