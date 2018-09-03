const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const pgConn = require('./pgdatabase/pgConnection');
const jwt = require('jsonwebtoken');
const async = require('async');
const mailer = require('./module/mailer');
var token = '';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post('/',function (req,res) {
  console.log('connect');
  if(req.body.id === 'admin' && req.body.pw === 'admin'){
    console.log(req.body.id+","+req.body.pw);
    res.send('Login ADMIN');
  }else{
    console.log(req.body.id+","+req.body.pw);
    res.send('입력한정보가 일치하지 않습니다.');
  }
});

app.get('/',function (req,res) {
  var user_email = 'phg5469@sungil-i.kr';
  const query = {
    text: 'SELECT * FROM PUBLIC.USER WHERE U_EMAIL = $1',
    values: [user_email]
  };
  async.parallel([
    function (callback) {
      pgConn.queryTest(query, function (err,result) {
        console.log(result);
        if(result!==undefined){
          console.log('fale !!!!!!');
          callback(null, false);
          return ;
        }
        callback(null, true);
      })

    }
  ],
    function (err,result) {
      var sdf = result;
      console.log(sdf);
      if(sdf){
        console.log('if !!!! : '+result);
        async.parallel([
          function (callback) {
            mailer.sendMail(user_email,function (err,code) {
              if(err){
                console.log('send mail err!! : '+err);
              }else{
                callback(null,code);
              }
            })
          }
        ],
          function (err,code) {
            res.send(code);
            res.end();
          }
        )
      }else{
        console.log('else !!!! : '+result);
        res.send(result);
        res.end();
      }
    }
  )

})

app.get('/testDB',function (req,res) {
  //const user = ;
  //pgConn.pgQuery(query,values);
  //res.send("testtestst\n");
  const query = {
    text:'SELECT U_EMAIL,U_NICKNAME,U_NAME,U_BIRTHDAY,U_SEX FROM PUBLIC.USER WHERE U_EMAIL = $1 AND U_PASSWD = $2',
    values:['phg5469@nate.com','dksalwjd1020']
  }
  /*
  const callback = function (res) {

  }
  */
  const values = [];


  async.waterfall([
    function (callback) {


        pgConn.queryTest(query, function (err,data) {

          const tokenkey = 'key';
          const payload = data;
          //console.log(res.rows[0][val[0]]);
          if(payload===undefined){
            console.log('err'); return;
          }else{
            console.log(tokenkey);
            token = jwt.sign(payload,tokenkey);

            console.log('success');
            //console.log(token);


          }
          callback(null,token);
        })



    }

  ],
    function (err,token) {
      console.log(token);
      res.send(token);
    }
  );











  //res.send(token);

  // req.on('end', function() {
  //       // script = 'console.log("aaaa")';
  //
  //       var result = eval(token);
  //       res.send(token);
  //       res.end();
  // });


})


http.listen(1300,'192.168.0.53',function () {
  console.log('start MSGTEST-APP SERVER!! 192.168.0.53');
});
