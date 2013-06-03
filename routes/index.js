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
    if ((query.id == null) && (query.password == null)) {
      console.log("form is null!");
      res.render('login', {title: TITLE, message: req.flash('alert')});
    }
    else {
      if (data == "") {
        req.flash('alert', 'Validation Error!');
        console.log("Validation Error!");
        res.redirect('/login');
      }
      else {
        console.log(data);
        req.session.user = id;
        res.redirect('/');
      }
    }
  });
};

exports.logout = function(req,res){
  req.session.destroy();
  res.redirect('/');
};