const pg = require('pg');



const pool = new pg.Pool({
  user: 'phg5469',
  password: 'qkrgusrl1020',
  host: '192.168.0.53',
  database: 'msg_app',
  port: 5432
});

/*회원가입 쿼리*/
exports.signUpQuery = function (query,callback) {
  pool.query(query,function (err,res) {
    if(err){
      console.log("err");
      callback(err,null);
      return;
    }
    callback(null,'signUp success');
    console.log('signUp is success');
  })
}

/*기본 select 쿼리*/
exports.select = function (query, callback){
    //console.log(val[0]);

    pool.query(query,function (err,res) {
      if(err){
        callback(err);
      }
      callback(null,res.rows[0]);
    })
}

/*로그인 확인 쿼리*/
exports.checkLogin = function (query, callback){
    //console.log(val[0]);

    pool.query(query,function (err,res) {
      if(err){
        callback(err);
      }
      callback(null,res.rows[0]);
    })
}


/*query test*/
exports.queryTest = function (query, callback){
    //console.log(val[0]);

    pool.query(query,function (err,res) {
      if(err){
        callback(err);
      }
      callback(null,res.rows[0]);
    })
}
