const nodemailer = require("nodemailer");

const supportEmailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "botgearlap@gmail.com",
    pass: "ewanarenxzpqrmwg",
  },
});

module.exports.sendSupportEmail = async (emailData) => {
  await supportEmailTransport.sendMail(
    {
      from: '"Gearlap - Support" <botgearlap@gmail.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.body,
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};
