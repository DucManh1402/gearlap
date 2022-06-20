const db = require("../util/database");

module.exports.getCommunicationPort = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      "select * from communication_port",
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getCommunicationSSD = async (req, res, next) => {
  try {
    const result = await db.getResultList(
      "select * from communication_ssd",
      []
    );

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getOperatorSystem = async (req, res, next) => {
  try {
    const result = await db.getResultList("select * from operator_system", []);

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getWebcam = async (req, res, next) => {
  try {
    const result = await db.getResultList("select * from webcam", []);

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getWifi = async (req, res, next) => {
  try {
    const result = await db.getResultList("select * from wifi", []);

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};

module.exports.getBrand = async (req, res, next) => {
  try {
    const result = await db.getResultList("select * from hang", []);

    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
