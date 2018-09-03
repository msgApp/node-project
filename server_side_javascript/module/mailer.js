const mailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const smtpTransport = mailer.createTransport(smtpPool({

  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: '465',
  auth : {
    user : 'phglove0830@gmail.com',
    pass : 'phg0830!'
  },
  maxConnections:5,
  maxMessages:10
}));

function makeCode(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
exports.sendMail = function (userMail, callback) {
  const code = makeCode();
  const mailOpt = {
    from:'from: admin <admin@gmail.com>',
    to:userMail,
    subject:'msgApp 인증번호',
    html:'인증번호 : '+code
  };

  smtpTransport.sendMail(mailOpt, function(err, res) {
    if( err ) {
      callback(err,null);
      console.log(err);
    }else{
      console.log('Message send :'+ res);
      callback(null,code);
      
    }

  })
}
