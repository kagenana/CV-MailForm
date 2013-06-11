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
      req.session.id = req.body.id;
      req.session.name = obj.id
      req.session.userid = obj._id
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
