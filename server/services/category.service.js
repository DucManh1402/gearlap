const db = require("../util/database");
const functionConfig = require("../util/function");

module.exports.createCategories = async (req, res, next) => {
  try {
    const newCategory = await db.query(
      `insert into loai_san_pham (name, brand)
        values ($1, $2) returning *`,
      [req.body.name, JSON.stringify(req.body.brand)]
    );

    res
      .status(200)
      .json({ ...newCategory.rows[0], message: "Thêm thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from loai_san_pham order by name = 'Laptop' desc, id asc`,
      []
    );

    let data = result.map((item) => {
      return {
        id: item.id,
        name: item.name,
        status: item.status,
        brand: JSON.parse(item.brand),
      };
    });

    return res.status(200).json(data);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getAllCategoriesTrue = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      `select * from loai_san_pham where status = 'true' order by name = 'Laptop' desc, id asc`,
      []
    );

    let data = result.map((item) => {
      return {
        id: item.id,
        name: item.name,
        status: item.status,
        brand: JSON.parse(item.brand),
      };
    });

    return res.status(200).json(data);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.updateCategory = async (req, res, next) => {
  try {
    let data = req.body;

    data.brand = JSON.stringify(req.body.brand);

    const queryStringUpdate = await functionConfig.updateQueryByOneCondition(
      "id",
      req.query.brand_id,
      "loai_san_pham",
      data
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

module.exports.deleteCategory = async (req, res, next) => {
  try {
    const result = await db.query(
      `delete from loai_san_pham where id = $1 returning *`,
      [req.query.brand_id]
    );

    res.status(200).json({ ...result.rows[0], message: "Xoá thành công" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getFieldCategoryType = async (req, res, next) => {
  try {
    let result = await db.getResultList(
      `select column_name from INFORMATION_SCHEMA.COLUMNS where table_name = 'laptop' and column_name ~ '^(?!.*(_id)).*$'`,
      []
    );

    result.push({ column_name: "product_id" });

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
