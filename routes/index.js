var model = require('../models/user.js'),
    User = model.User;
    
var TITLE = 'CV-MailForm';

exports.index = function(req, res){
  res.render('index', { title: TITLE });
};

exports.login = function(req, res){
  var id = req.query.id;
  var password = req.query.password;
  
  var query = { "id": id, "password": password };
  
  User.find(query, function(err, data) {
    if(err) {
      console.log(err);
    }
    if (data == "") {
      res.render('login', { title: TITLE });
    }
    else {
      req.session.user = id;
      res.redirect('/');
    }
  });
};