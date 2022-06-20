const db = require("../util/database");

module.exports.interactionDB = async (req, res, next) => {
  try {
    const query =
      req.query.type == "cancel"
        ? "pg_cancel_backend(pid)"
        : " pg_terminate_backend(pid)";

    await db.executeQuery(
      `select ${query} from pg_stat_activity
      where  usename = 'fsqxkqzu'
      and pid <> pg_backend_pid();`,
      []
    );

    res.status(200).json({ message: "ok" });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ message: e.message });
  }
};
