const _ = require("lodash");
const SystemOptions = require("../models/system-options");
const transporter = require("../config/transporter");

const sendMail = function(address, message, subject) {
  SystemOptions.findAll(undefined, undefined, function(result) {
    const company_email = result
      .filter(option => {
        return option.data.option == "company_email";
      })[0]
      .get("value");
    const company_name = result
      .filter(option => {
        return option.data.option == "company_name";
      })[0]
      .get("value");
    const mailOptions = {
      from: `"${company_name}" <${company_email}>`, // sender address
      to: address, // list of receivers
      subject, // Subject line
      html: message, // html body
      text: message, // text only body
    };
    console.log("MAILING!");
    console.log(mailOptions);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.error(error);
      }
      console.log(`Message sent: ${info.response}`);
    });
  });
};

module.exports = sendMail;
