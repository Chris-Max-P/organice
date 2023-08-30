const express = require("express");
const mongodb = require("./mongodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

  mongodb.openDbConnection();
});

function handleClose() {
  server.close();
  mongodb.closeDbConnection();
}

server.on('close', function () {
  handleClose();
});

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  handleClose();
});



// ------- API endpoints -------
app.post('/send-mail', function (req, res) {
  main(req.body.text).catch(console.error);
  console.log(req);
  res.send(req);
});

app.post('/mongodb', function (req, res) {
  console.log(req);
  switch (req.body.action) {
    case RestRequestEnum.SAVE: mongodb.save(req.body.event); break;
  }
  res.send('ok');
});

app.get('/mongodb', async function (req, res) {
  console.log(req);
  let response;
  switch (req.body.action) {
    case RestRequestEnum.READ: response = await mongodb.findAll(); break;
  }
  res.send(response);
});

const RestRequestEnum = {
  SAVE: 'SAVE',
  READ: 'READ',
  DELETE: 'DELETE',
}
