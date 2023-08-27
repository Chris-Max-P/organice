const nodemailer = require("nodemailer");
const fs = require("fs");

let login = JSON.parse(fs.readFileSync('../assets/mail-login.json'));
let mail = login.mail;
let pw = login.pw;

async function sendMail(recipient, text) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.biohost.de",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mail, // generated ethereal user
      pass: pw, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Chrizzle" <${mail}>`, // sender address
    to: recipient, // list of receivers
    subject: "Hi", // Subject line
    text: text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = { sendMail };

