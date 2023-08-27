const fs = require('fs');
const wa = require("./whatsapp")
const mails = require("./mail")


let contacts = JSON.parse(fs.readFileSync('../assets/contacts.json'));

for (let contact of Object.entries(contacts)) {
  let name = contact[0];
  let contactData = contact[1];

  let message = `Hi ${name}`;

  if (contactData.handy) {
    wa.sendMsg(contactData.handy, message);
  } else if (contactData.mail) {
    mails.sendMail(contactData.mail, message);
  }
}
