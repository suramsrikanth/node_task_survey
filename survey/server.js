var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var dotenv = require('dotenv').config();
var assignRoute = require('./server/routes/assign-crud.js');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
mongoose.Promise = require('bluebird');


app.use(bodyParser.json());

//DB connection
mongoose.connect("mongodb+srv://test:5w1dlkPM7fUg9L5b@cluster0.eefkrs6.mongodb.net/water?retryWrites=true&w=majority");
var db = mongoose.connection;

db.on('open', function () {
  console.log('App is connected to database');
});

db.on('error', function (err) {
  console.log(err);
});
app.use(bodyParser.json());


app.get('/', function (req, res) {
  console.log(req,req);
res.send('Hello World Server is running on port 8888...');
})

app.get('/test', function (req, res) {
   res.send('Hello World server running file');
})



//router
app.use('/container', assignRoute);

server.listen(8888, function (req, res) {
  console.log(`Server is running on port 8888...`);
});
