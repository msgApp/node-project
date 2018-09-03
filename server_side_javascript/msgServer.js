const express = require('express');
const app = express();
const http = require('http').Server(app);
const pgConn = require('./pgdatabase//pgConnection');
const mailer = require('./module/mailer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const async = require('async');
const tokenKey = 'token_key';
var token = '';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

/* GET REQUEST!! */
app.get('/', function (req,res) {
  res.send('hello world');
})

/* POST REQUEST!! */
//singUp user
app.post('/signUp', function (req, res) {
  console.log('into user : '+req.ip);
//클라이언트에서 받은 json value값 변수에 담기
  const email = req.body.u_email;
  const password = req.body.u_passwd;
  const nickName = req.body.u_nickname;
  const name = req.body.u_name;
  const birthDay = req.body.u_birthday;
  const sex = req.body.u_sex;

  const query = {
    //회원가입 쿼리문
    text: 'INSERT INTO PUBLIC.USER VALUES ($1,$2,$3,$4,$5,$6,$7)',
    values: [email,password,nickName,name,birthDay,sex,'']
  }

  async.parallel([
    function (callback) {
      //쿼리문 실행
      pgConn.signUpQuery(query,function (err,result) {
        if(err){
          callback(err,null);
          return ;
        }
        callback(null,result);
      });

    }
  ],
    function (err,result) {
      if(err){
        console.log('err!! : '+err);
      }
      res.send(result);
      res.end();
    }
  )

  /* user signUp request json LOG

    console.log('email : '+req.body.u_email);
    console.log('pw : '+req.body.u_passwd);
    console.log('nickName : '+req.body.u_nickname);
    console.log('rName : '+req.body.u_name);
    console.log('male : '+req.body.u_sex);
    console.log('birthDay : '+req.body.u_birthday

  */

});

// email-overlapCheck & sendMail
app.post('/overlapCheck', function (req,res) {
  console.log('into user : '+req.ip);
  //유저가 전송한 이메일
  const user_email = req.body.u_email;
  console.log(user_email);
  const query = {
    //전송한 이메일이 이미 존재하는지 확인하는 쿼리
    text: 'SELECT * FROM PUBLIC.USER WHERE U_EMAIL = $1',
    values: [user_email]
  };

  async.parallel([
    function (callback) {
      //쿼리문 실행
      pgConn.select(query, function (err,result) {
        if(result!==undefined){
          //중복된 이메일이 존재함
          console.log('이메일 중복');
          callback(null,false);

        }else{
          //중복된 이메일이 없음
          callback(null, true);
        }

      })

    }
  ],
  //callback 함수로 이메일 존재 여부인자를 result에 할당
    function (err,result) {
      if(result=='true'){
        console.log('1');
        //이메일 중복을 확인후 없을경우 인증번호 발송
        async.waterfall([
          function (callback) {
            mailer.sendMail(user_email,function (err,code) {
              console.log('인증번호 발송!!!! : '+result);
              if(err){
                console.log('send mail err!! : '+err);
              }else{
                callback(null,code);
              }
            })
          }
        ],
          function (err,code) {
            //인증번호 클라이언트에 전송
            console.log('send code to user : '+code);
            res.send(code);
            
          }
        )
      }else{
        //중복된 이메일이 존재하는 경우 false값 전달
        console.log('이미 존재하는 이메일 입니다!!!! : '+result);
        res.send(result);
        res.end();
      }
    }
  )
})

//login user & create token  >>>token decoding = jwt.verify(token,tokenKey);
app.post('/login', function (req, res) {
    console.log('into user : '+req.ip);

    const id = req.body.login_id;
    const pw = req.body.login_pw;
    const query = {
      text:'SELECT U_EMAIL,U_NICKNAME,U_NAME,U_BIRTHDAY,U_SEX FROM PUBLIC.USER WHERE U_EMAIL = $1 AND U_PASSWD = $2',
      values:[id,pw]
    }
    console.log(query);


  async.parallel([
    function (callback) {
      //로그인 확인 결과값 = result
      pgConn.checkLogin(query,function (err,result) {


        const payload = result;
        if(payload===undefined){
          //로그인 정보가 틀렸을경우
          console.log('undefined err');
          const returnSuc = 'false';
          callback(null,returnSuc);
        }else{
          //로그인 정보가 맞았을경우 (토큰 생성)
          const returnSuc = 'true';
          //payload = 회원 정보 json , tokenKey = token_key 값을 넣어서 encoding
          token = jwt.sign(payload,tokenKey);
          console.log('encoded token is '+token);
          //콜백함수로 토큰값 전달
          callback(null,token);
        }

        /* check id&pw LOG
          console.log('id : '+ req.body.login_id);
          console.log('pw : '+ req.body.login_pw);
        */

      })
    }
  ],
    function (err,token) {
      //전달받은 토큰값 클라이언트로 전달
      console.log('send token');
      res.send(token);
      res.end();
    }
  )
});


//서버 생성
http.listen(1300, '192.168.0.53', function (req,res) {
  console.log('start Server | URL is http://192.168.0.53:1300');
})
