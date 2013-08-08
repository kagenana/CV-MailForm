var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = '株式会社コンバージョン　スケジュールボード　ユーザメニュー';

exports.index = function(req, res){
  var today = new Date();
  today.setHours(0,0,0);
  console.log(today.toString());
  Schedule.find({
    author_id: req.session._id,
    $or: [{timeSubmit: {$gt: today}}]
  },
  {},
  { sort: [['timeSubmit', -1]] },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('schedule/schedule', { title: TITLE, session: session, schedules: schedules });
  });
};

exports.input = function(req, res){
  Schedule.findOne({
    _id: req.body._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    if (schedules) {
        //edit
      var session = req.session;
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules });
    }
    else {
        //new
      var schedules = new Schedule();
      var session = req.session;
      var timeRequestStr = encodeDate(schedules.timeRequest);
      var timeReturnStr = encodeDate(schedules.timeReturn);
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules });
    };
  });
};

exports.input_post = function(req, res){
  Schedule.findOne({
    _id: req.body._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    if(schedules){
        //update
      schedules.author_id = req.session._id;
      schedules.subject = req.body.subject;
      schedules.author = req.session.id;
      schedules.timeSubmit = Date.now();
      schedules.timeRequest = Date(req.body.timeRequest);
      schedules.timeReturn = Date(req.body.timeReturn);
      schedules.isState = req.body,isState;
      schedules.Description = req.body.Description;
        //schedules.mailBody = "";
      schedules.save();
    }
    else {
        //new
      var schedules = new Schedule();
      schedules.author_id = req.session._id;
      schedules.subject = req.body.subject;
      schedules.author = req.session.id;
      schedules.timeSubmit = Date.now();
      schedules.timeRequest = new Date(req.body.timeRequest);
      schedules.timeReturn = new Date(req.body.timeReturn);
      schedules.isState = "que";
      schedules.Description = req.body.Description;
        //schedules.mailBody = "";
      schedules.save();
    };
    
    req.session.messages = ["スケジュールを追加または変更しました。"];
    res.redirect('schedule/');
  });
};

exports.chg_status = function(req, res){
  User.findOne({
    _id: req.session._id
  },
  function(err, users){
    if(err){
      console.log(err);
    };
    users.isState = req.body.status;
    req.session.isState = req.body.status;
    users.save();

    Server.find({}, function(err, obj){
      if(err){
        console.log(err);
      };
      var msg = {
        to: obj[0].mail_to
      };
      if (obj[0].mail_from) {
        msg.from = obj[0].mail_from;
      }
      else {
        msg.from = req.session.mail;
      };
      
      if (obj[0].mail_bcc_user) {
        msg.bcc = req.session.mail;
      };
      
      if (obj[0].mail_reply_to_user) {
        msg.replyTo = req.session.mail;
      };

      var text="";
      if (req.body.status == "left") {
        msg.subject = obj[0].left_subject;
        text = obj[0].left_template;
      };
      if (req.body.status == "goout") {
        msg.subject = obj[0].goout_subject;
        text = obj[0].goout_template;
      };
      if (req.body.status == "absence") {
        msg.subject = obj[0].absence_subject;
        text = obj[0].absence_template;
      };
      if (req.body.status == "exist") {
        msg.subject = obj[0].exist_subject;
        text = obj[0].exist_template;
      };
      
      text = text.replace(/%user%/g, req.session.name);
      text = text.replace(/%user_short%/g, req.session.name_short);
      text = text.replace(/%user_mail%/g, req.session.mail);
      
      
      
      if (req.body.status == "left") {
        var state_text = "離席";
      };
      if (req.body.status == "goout") {
        var state_text = "外出";
      };
      if (req.body.status == "absence") {
        var state_text = "不在";
      };
      if (req.body.status == "exist") {
        var state_text = "在席";
      };
      text = text.replace(/%state%/g, state_text);

      var str = req.body.description;
      if (str == ""){
        str = ""
      }
      else {
        str = str + "のため";
      };
      text = text.replace(/%description%/g, str);

      var date = new Date();
      var hh = date.getHours();
      var mm = date.getMinutes();
      if (mm == "0") {
        var time = hh + "時" + "頃から不在予定です。";
      }
      else {
        var time = hh + "時" + mm +"分" + "頃から不在予定です。"
      };
      
      text = text.replace(/%left%/g, time);

      if (req.body.fulltime){
        var time = "終日戻らない予定です。"
        req.body.timeReturn = null;
        req.body.description = req.body.description + " (終日予定)";
        text = text.replace(/%return%/g, time);
      }
      else{
        if(req.body.timeReturn){
          var date = new Date(req.body.timeReturn);
          var hh = date.getHours()
          var mm = date.getMinutes();
          if (mm == "0") {
            var time = hh + "時" + "頃に戻る予定です。";
          }
          else {
            var time = hh + "時" + mm +"分" + "頃に戻る予定です。"
          };

          text = text.replace(/%return%/g, time);
        } else {
          if (req.body.status !="exist") {
            req.body.description = req.body.description + " (戻り未定)";
            var time = "戻りの時間は未定です。";
            text = text.replace(/%return%/g, time);
          }
        }
      }

      msg.text = text;
            
      var schedules = new Schedule();
      schedules.author_id = req.session._id;
      schedules.subject = req.body.status;
      schedules.author = req.session.name;
      schedules.timeSubmit = Date.now();
      schedules.timeRequest = Date.now();
      if (req.body.timeReturn) {
        schedules.timeReturn = new Date(req.body.timeReturn);
      }
      else {
        schedules.timeReturn = null;
      };
      
      var limit_date = new Date();
      limit_date.setHours(18,0,0);
      if (Date.now() < limit_date) {
        req.session.messages = ["在席状態を更新し、通知メールを送信しました。"];
        sendMail(msg);
        schedules.isState = "sent";
      }
      else {
        req.session.messages = ["在席状態を更新しましたが、通知メールは未送信です。（18:00まで）"];
        schedules.isState = "archive";
      };
      schedules.Description = req.body.description;
      schedules.mailBody = msg;
      schedules.save();
      
      res.redirect('schedule/');
    });
  });
}

exports.archives = function(req, res){
  Schedule.find({
    author_id: req.session._id
  },
  {},
  { sort: [['timeSubmit', -1]], limit: 100 },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('schedule/archives', { title: TITLE, session: session, schedules: schedules });
  });
};

function sendMail(msg) {
  Server.find({}, function(err, obj){
    if(err){
      console.log(err);
    };
    
    if (obj[0].smtp_port == "465") {
      var ssl = true;
    }
    else {
      var ssl = false;
    };
    
    var nodemailer = require('nodemailer');
    var transport = nodemailer.createTransport('SMTP', {
      host: obj[0].smtp_server,
      secureConnection: ssl,
      port: obj[0].smtp_port,
      auth: {
        user: obj[0].smtp_user,
        pass: obj[0].smtp_pass
      }
    });
    
    transport.sendMail(msg, function(err) {
      if(err) {
        console.log(err);
      };
      msg.transport.close();
    });
  });
};

function encodeDate(date) {
  var y = date.getFullYear();
  var m = date.getMonth()+1;
  var d = date.getDate();
  m = ('0' + m).slice(-2);
  d = ('0' + d).slice(-2);
  
  var hh = date.getHours()
  var mm = date.getMinutes();
  hh = ('0' + hh).slice(-2);
  mm = ('0' + mm).slice(-2);
  
  return y + "/" + m + "/" + d + " " + hh + ":" + mm
}

