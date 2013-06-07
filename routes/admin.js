var model = require('../models/user.js'),
    User = model.User;
var TITLE = 'CV-MailForm Admin';

exports.index = function(req, res){
  res.render('admin', { title: TITLE });
};

exports.account = function(req, res){
  res.render('account', { title: TITLE });
};

exports.server = function(req, res){
  res.render('server', { title: TITLE });
};

