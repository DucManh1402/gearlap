const moment = require("moment");
const db = require("../util/database");

module.exports.getChart = async (req, res, next) => {
  try {
    const type = req.query.type === "subtotal" ? "subtotal" : "quantity";

    const result = await db.getResultList(
      `with rawdata as (select t1.order_id, time, quantity, subtotal, name from 
        (select order_id, payment_time::date as time from orders where (status = 'payment') or (status = 'delivery' and method = 'Momo')) as t1
        left join
        (select order_id, quantity, subtotal, product_id from order_detail) as t2 on t1.order_id = t2.order_id
        left join
        (select product_id, type_id from product) as t3 on t2.product_id = t3.product_id
        left join
        (select id, name from loai_san_pham) as t4 on t3.type_id = t4.id)
        , rawdata2 as (select time as date, sum(cast(${type} as double precision)) as scales, 'Tổng' as name_product from rawdata group by time
        union all
        select time as date, sum(cast(${type} as double precision)) as scales, name as name_product from rawdata group by name, time)        
        
        select * from rawdata2 order by date asc, scales desc
        `,
      []
    );

    for (let index in result) {
      result[index].date = moment(result[index].date).format("YYYY-MM-DD");
    }

    const newData = result.map(({ date: Date, ...rest }) => ({
      Date,
      ...rest,
    }));

    return res.status(200).json(newData);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getChartDetail = async (req, res, next) => {
  try {
    const type = req.query.type === "subtotal" ? "subtotal" : "quantity";

    const result = await db.getResultList(
      `with rawdata as (select t1.order_id, time, quantity, subtotal, name, name_product from 
        (select order_id, payment_time::date as time from orders where (status = 'payment') or (status = 'delivery' and method = 'Momo')) as t1
        left join
        (select order_id, quantity, subtotal, product_id from order_detail) as t2 on t1.order_id = t2.order_id
        left join
        (select product_id, name as name_product, type_id from product where type_id = $1) as t3 on t2.product_id = t3.product_id
        right join
        (select id, name from loai_san_pham where id = $1) as t4 on t3.type_id = t4.id)
        , rawdata2 as (
        select time as date, sum(cast(${type} as double precision)) as scales, 'Tổng' as name_product from rawdata group by time, name
        union all
        select time as date, sum(cast(${type} as double precision)) as scales, name_product from rawdata group by name, time, name_product)        
        
        select * from rawdata2 order by date asc, scales desc`,
      [req.query.type_id]
    );

    for (let index in result) {
      result[index].date = result[index].date ? moment(result[index].date).format("YYYY-MM-DD") : null;
    }

    const newData = result.map(({ date: Date, ...rest }) => ({
      Date,
      ...rest,
    }));

    return res.status(200).json(newData);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
