const express = require("express")
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios")
const cors = require('cors');
var bodyParser = require('body-parser')


const webRoutes = require("./routes/webRoutes")
const videoModel = require("./models/videos")
const port = process.env.PORT || 8080;
const db = require('./db/db');

const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const socketIoLogic = require('./socket-io/socket-io')
//allow cross origin
app.use(cors());
// app.use(fileUpload());
//register routes and thier working
app.use(webRoutes)
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
io.on("connection", socketIoLogic);
server.listen(port, () => console.log(`Listening on port ${port}`))
