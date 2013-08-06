var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = 'オンライン行動予定表（仮）';

exports.index = function(req, res){
  var today = new Date();
  today.setHours(0,0,0);
  Schedule.find({
    timeSubmit: { $gt: today }
  },
  {},
  { sort: [['author_id', 1],['timeSubmit', -1]] },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('index', { title: TITLE, session: session, schedules: schedules });
  });
};

exports.login = function(req, res){
  res.render('login', { title: TITLE });
};

exports.signup = function(req, res){
  User.findOne({
    id: req.body.id,
    password: req.body.password
  },
  function(err,obj){
    if(obj){
        //console.log('stage5');
      req.session._id = obj._id;
      req.session.userid = obj.id;
      req.session.name = obj.name;
      req.session.name_short = obj.name_short;
      req.session.mail = obj.mail;
      req.session.isAdmin = obj.isAdmin;
      req.session.isEnable = obj.isEnable;
      req.session.isState = obj.isState;
      res.redirect('/');
        //console.log(req.session);
    }
    else {
        //console.log('stage6');
      console.log(err);
      req.session.messages = ["入力情報が異なります。"];
      res.redirect('/login');
    }
  });
};

exports.logout = function(req,res){
  req.session.destroy();
  res.redirect('/login');
};

exports.account = function(req, res){
  User.findOne({
      _id: req.body._id,
    },
  function(err, users){
    if(err){
      console.log(err);
    };
    var mode = "edit";
    var duplicate = "";
    var session = req.session;
    res.render('account', { title: TITLE, session: session, users: users, mode: mode, duplicate: duplicate});
  });
};

function encodeDate(date1) {
  var date = date1.getFullYear()+"/"+date1.getMonth()+"/"+date1.getDate()+" "+date1.getHours()+":"+date1.getMinutes();
  return date;
};

