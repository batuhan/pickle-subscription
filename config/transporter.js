const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport

// todo: handle certs n stufff
const smtpConfig = {
  name: process.env.VIRTUAL_HOST,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("MAILER CONNECTION VERIFIED");
  }
});

// setup e-mail data with unicode symbols
module.exports = transporter;
