var model = require('../models/db.js');
    User = model.User,
    Server = model.Server;

var TITLE = 'CV-MailForm';

exports.index = function(req, res){
  res.render('index', { title: TITLE, user: req.session.name});
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
      req.session.id = obj.id;
      req.session.name = obj.name;
      req.session.isAdmin = obj.isAdmin;
      req.session.isEnable = obj.isEnable;
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
    res.render('account', { title: TITLE, user: req.session.name, users: users, mode: mode, duplicate: duplicate});
  });
};

