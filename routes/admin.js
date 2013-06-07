var model = require('../models/user.js'),
    User = model.User;
var TITLE = 'CV-MailForm Admin';

exports.index = function(req, res){
  res.render('admin', { title: TITLE });
};
