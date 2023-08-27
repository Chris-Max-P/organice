const wbm = require('wbm');

function sendMsg(waNumber, message) {
  wbm.start().then(async () => {
    const phones = [waNumber];
    await wbm.send(phones, message);
    await wbm.end();
  }).catch(err => console.log(err));
}

module.exports = { sendMsg };
