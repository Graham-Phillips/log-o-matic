
const express = require("express");
const apiRouter = require("./api/apiroutes");
const cors = require('cors')

const server = express();


server.use(cors())
server.use('/', apiRouter);
server.use(express.static('public'));

server.listen((process.env.PORT || 8100), (process.env.HOST || 'localhost'), () => {
  console.info('Express listening on port', (process.env.PORT || 8100));
});

server.get('/a', function (req, res) {
  res.send('Hello World!')
})