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



// API endpoints
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

app.get('/test', function (req, res) {
  console.log(req);
  mongodb.find().then((result) => {
    res.send(result);
  });
});
