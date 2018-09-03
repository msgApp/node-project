var express = require('express');
var app = express();
var http = require('http').Server(app);
var test = '';

app.set('view engine', 'jade');
app.set('viesw', './views');
app.use(express.static('public'));
app.locals.pretty = true;
app.get('/', function (req, res){
  res.send('hello');
});
app.get('/template', function (req, res) {
  res.render('temp');
})
app.get('/route',function (req, res) {
  res.send('hello img <img src="/route.png">');
})
app.get('/dynamic', function (req, res) {
  var output = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      hello dynamic!!
    </body>
  </html>`
  res.send(output);
})
http

.listen(1300,function () {
  console.log('conneted express');
});
