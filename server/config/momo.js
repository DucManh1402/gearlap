const crypto = require("crypto");

module.exports.momoConfig = {
  partnerCode: "MOMOX7ZW20220322",
  accessKey: "bzSgjHNtsL8SZxqr",
  secretkey: "TD2PwNHAY6KlXBNn2gu4HKH7PbVxuFdO",
  redirectUrl: "https://gear-lap.herokuapp.com/kiem-tra-thanh-toan",
  ipnUrl: "https://gear-lap.herokuapp.com/api/payments/momo/transaction",
  requestType: "captureWallet",
  extraData: "",

  getRawSignature: (
    accessKey,
    amount,
    extraData,
    ipnUrl,
    orderId,
    orderInfo,
    partnerCode,
    redirectUrl,
    requestId,
    requestType,
    secretkey
  ) => {
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    return crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");
  },
};
