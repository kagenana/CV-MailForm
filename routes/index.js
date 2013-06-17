var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = 'CV-MailForm';

exports.index = function(req, res){
  var session = req.session;
  res.render('index', { title: TITLE, session: session });
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
      req.session._id = obj._id;
      req.session.userid = obj.id;
      req.session.name = obj.name;
      req.session.isAdmin = obj.isAdmin;
      req.session.isEnable = obj.isEnable;
      req.session.isState = obj.isState;
      res.redirect('/');
    }
    else {
      console.log(err);
      req.session.messages = ["Cannot Login."];
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

