const axios = require("axios");
const moment = require("moment");
const crypto = require("crypto");

const db = require("../util/database");
const FormatNumber = require("../util/FormatNumber");
const EmailConfig = require("../config/email");
const { momoConfig } = require("../config/momo");
const { shipConfig } = require("../config/ship");

module.exports.createPayment = async (req, res) => {
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
    const partnerCode = momoConfig.partnerCode;
    const accessKey = momoConfig.accessKey;
    const secretkey = momoConfig.secretkey;
    const requestId = partnerCode + new Date().getTime();
    const orderInfo = "Thanh toán qua ví điện tử momo";
    const redirectUrl = momoConfig.redirectUrl;
    const ipnUrl = momoConfig.ipnUrl;
    const requestType = momoConfig.requestType;
    const extraData = momoConfig.extraData;

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
      `insert into orders (user_id, transport_fee, subtotal, status, method, waiting_time, delivery_time, payment_time, name, address, phone, total, email, cancel_time, feedback_time, orderid_momo, requestid_momo)
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) returning *`,
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
        "",
        requestId,
      ]
    );

    await db.query(
      `update orders set orderid_momo = $1 where requestid_momo = $2 and order_id = $3`,
      [
        newOrder.rows[0].order_id.split("-").at(-1),
        requestId,
        newOrder.rows[0].order_id,
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

    const signature = momoConfig.getRawSignature(
      accessKey,
      total,
      extraData,
      ipnUrl,
      newOrder.rows[0].order_id.split("-").at(-1),
      orderInfo,
      partnerCode,
      redirectUrl,
      requestId,
      requestType,
      secretkey
    );

    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: total,
      orderId: newOrder.rows[0].order_id.split("-").at(-1),
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    };

    const response = await axios.post(
      `https://test-payment.momo.vn/v2/gateway/api/create`,
      requestBody
    );

    console.log(response.data.payUrl);

    EmailConfig.sendSupportEmail({
      subject: `Gearlap - Đặt hàng sản phẩm`,
      to: `Quý khách - ${email}`,
      body: contentMail,
    });

    return res.status(200).json({ url: response.data.payUrl });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getTransaction = async (req, res) => {
  try {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");

    if (req.body.resultCode === 0 || req.body.resultCode === 9000) {
      await db.query(
        `update orders set status = $1, delivery_time = $2, payment_time = $2 where requestid_momo = $3 and orderid_momo = $4`,
        ["delivery", time, req.body.requestId, req.body.orderId]
      );
      console.log("Transaction Success");
    } else {
      let queryUpdate = "";

      const result = await db.getFirstResult(
        `select tbl1.order_id, listproduct from
        (select order_id from orders where requestid_momo = $1 and orderid_momo = $2) as tbl1
        left join
        (select order_id, json_agg(json_build_object('product_id', t1.product_id, 'quantity', quantity, 'amount_sale', amount_sale, 'amount', amount)) as listproduct from 
        (select order_id, product_id, quantity from order_detail where order_id = (select order_id from orders where requestid_momo = $1 and orderid_momo = $2)) as t1
        left join
        (select product_id, amount_sale, amount from product where product_id in (select product_id from orders where requestid_momo = $1 and orderid_momo = $2)) as t2
        on t1.product_id = t2.product_id group by 1) as tbl2 on tbl1.order_id = tbl2.order_id`,
        [req.body.requestId, req.body.orderId]
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

      await db.query(`delete from order_detail where order_id = $1`, [
        result.order_id,
      ]);

      await db.query(
        `delete from orders where requestid_momo = $1 and orderid_momo = $2`,
        [req.body.requestId, req.body.orderId]
      );
      console.log("Transaction Fail");
    }

    res.status(204).json({ message: "Transaction complete" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.checkTransaction = async (req, res) => {
  const rawSignature = `accessKey=${momoConfig.accessKey}&orderId=${req.query.orderId}&partnerCode=${momoConfig.partnerCode}&requestId=${req.query.requestId}`;

  const signature = crypto
    .createHmac("sha256", momoConfig.secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    requestId: req.query.requestId,
    orderId: req.query.orderId,
    signature,
    lang: "en",
  };

  const response = await axios.post(
    `https://test-payment.momo.vn/v2/gateway/api/query`,
    requestBody
  );

  if (response.data.resultCode === 0 || response.data.resultCode === 9000) {
    return res.status(200).json({ message: "Thanh toán thành công" });
  } else {
    return res.status(400).json({ message: response.data.message });
  }
};

module.exports.calcShipmentFee = async (req, res) => {
  try {
    const bodyFormData = new URLSearchParams();
    let toCityName = "";
    let toDistrictName = "";
    let parentId = 0;

    let data = { type: "CITY" };
    data = JSON.stringify(data);

    bodyFormData.append("version", shipConfig.version);
    bodyFormData.append("businessId", shipConfig.businessId);
    bodyFormData.append("appId", shipConfig.appId);
    bodyFormData.append("accessToken", shipConfig.accessToken);
    bodyFormData.append("data", data);

    const responseCity = await axios.post(
      "https://nhanh.vn/api/shipping/location",
      bodyFormData
    );

    responseCity.data.data.forEach((item) => {
      if (req.body.toCityName.includes(item.name)) {
        parentId = item.id;
        toCityName = item.name;
        return;
      }
    });

    data = { type: "DISTRICT", parentId: parentId };
    data = JSON.stringify(data);

    bodyFormData.set("data", data);

    const responseDistrict = await axios.post(
      "https://nhanh.vn/api/shipping/location",
      bodyFormData
    );

    responseDistrict.data.data.forEach((item) => {
      if (req.body.toDistrictName.includes(item.name)) {
        toDistrictName = item.name;
        return;
      }
    });

    data = {
      fromCityName: shipConfig.fromCityName,
      fromDistrictName: shipConfig.fromDistrictName,
      toCityName: toCityName,
      toDistrictName: toDistrictName,
      codMoney: req.body.codMoney,
      shippingWeight: shipConfig.shippingWeight,
    };
    data = JSON.stringify(data);

    bodyFormData.set("data", data);

    const response = await axios.post(
      "https://nhanh.vn/api/shipping/fee",
      bodyFormData
    );

    return res.status(200).json(response.data.data);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
