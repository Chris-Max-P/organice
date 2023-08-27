const nodemailer = require("nodemailer");
var express = require('express');
const fs = require("fs");
var app = express();

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

/*

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/mail', function (req, res) {
  main().catch(console.error);
  // console.log(req);
  res.send(req);
})

app.post('/send-mail', function (req, res) {
  main(req.body.text).catch(console.error);
  console.log(req);
  res.send(req);
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
*/
