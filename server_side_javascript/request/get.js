const express = require('express');
const app = express();
const pgConn = require('./pgdatabase//pgConnection');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

exports.get = function () {

}

app.get('/', function (req,res) {
  res.send('hello world');
})
