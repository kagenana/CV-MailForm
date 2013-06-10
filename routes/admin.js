var model = require('../models/db.js');
    User = model.User,
    Server = model.Server;

var TITLE = 'CV-MailForm Admin';

exports.index = function(req, res){
  res.render('admin/admin', { title: TITLE });
};

exports.account = function(req, res){
  res.render('admin/account', { title: TITLE });
};

exports.server = function(req, res){
  Server.find({}, function(err, obj){
    if(err){
      console.log(err);
    };
    if(obj){
      console.log(obj[0].mail_reply_to_user);
      res.render('admin/server', {
        title: TITLE ,
        domain: obj[0].domain,
        smtp_server: obj[0].smtp_server,
        smtp_port: obj[0].smtp_port,
        smtp_user: obj[0].smtp_user,
        smtp_pass: obj[0].smtp_pass,
        mail_from: obj[0].mail_from,
        mail_to: obj[0].mail_to,
        mail_bcc_user: obj[0].mail_bcc_user,
        mail_reply_to_user: obj[0].mail_reply_to_user,
        send_to_min_before: obj[0].send_to_min_before,
        archive_of_day: obj[0].archive_of_day,
        mesage_template: obj[0].mesage_template
      });
    }
    else {
      res.render('admin/server', { title: TITLE });
    };
  });

};

