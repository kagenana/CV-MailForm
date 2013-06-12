var model = require('../models/db.js');
    User = model.User,
    Server = model.Server;

var TITLE = 'CV-MailForm Admin';

exports.index = function(req, res){
  res.render('admin/admin', { title: TITLE, user: req.session.name });
};

exports.account = function(req, res){
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    };
    res.render('admin/account', { title: TITLE, user: req.session.name, users: users });
  });
};

exports.account_edit = function(req, res){
  if (req.body._id == 'new') {
    var users = new User();
    var mode = "new";
    var duplicate = "";
    res.render('admin/account_edit', { title: TITLE, user: req.session.name, users: users, mode: mode, duplicate: duplicate });
  }
  else {
    User.findOne({
      _id: req.body._id,
    },
    function(err, users){
      if(err){
        console.log(err);
      };
      var mode = "edit";
      var duplicate = "";
      res.render('admin/account_edit', { title: TITLE, user: req.session.name, users: users, mode: mode, duplicate: duplicate });
    });
  }
};

exports.account_conf = function(req, res){
  User.findOne({
    _id: req.body._id,
  },
  function(err, users){
    if(err){
      console.log(err);
    };
    
    if (users) {
        //update
      var beforeAdmin = users.isAdmin;
      var beforeEnable = users.isEnable;
      users.id = users.id;
      users.mail = req.body.mail;
      users.name = req.body.name;
      users.password = req.body.password;
      users.isAdmin = req.body.isAdmin;
      users.isEnable = req.body.isEnable;
      users.Description = req.body.Description;
      users.save();
        //require relogin
      if (req.session._id == users._id) {
        if (beforeAdmin) {
          if (users.isAdmin) {
          }
          else {
            req.session.isAdmin = users.isAdmin;
          };
        };
      };
      
        //require logout
      if (req.session._id == users._id) {
        if (beforeEnable) {
          if (users.isEneble) {
          }
          else {
            req.session.isEnable = users.isEnable;
            req.session.messages = ["Account is disabled."];
            res.redirect('/login');
          };
        };
      };

      if (req.session.isAdmin) {
        res.redirect('admin/account');
      }
      else {
        res.redirect('/');
      };
    }
    else {
        //new
      var users = new User();
      users.id = req.body.id;
      users.mail = req.body.mail;
      users.name = req.body.name;
      users.password = req.body.password;
      users.isAdmin = req.body.isAdmin;
      users.isEnable = req.body.isEnable;
      users.Description = req.body.Description;
        //new id check
      User.findOne({
        id: req.body.id,
      },
      function(err,obj){
        if(err){
          console.log(err);
        };
        if(obj){
          var mode = "new";
          var duplicate = "id is duplication.";
          res.render('admin/account_edit', { title: TITLE, user: req.session.name, users: users, mode: mode, duplicate: duplicate });
        }
        else {
          users.save();
          res.redirect('admin/account');
        };
      });
    };
  });
};

exports.account_delete = function(req, res){
  User.findOne({
    _id: req.body._id,
  },
  function(err, users){
    if(err){
      console.log(err);
    };
    users.remove();
    res.redirect('admin/account');
  });
};

exports.server = function(req, res){
  Server.find({}, function(err, servers){
    if(err){
      console.log(err);
    };
    res.render('admin/server', { title: TITLE ,user: req.session.name ,servers: servers });
  });
};

exports.server_conf = function(req, res){
  Server.find({}, function(err, obj){
    if(err){
      console.log(err);
    };
    obj[0].domain = req.body.domain;
    obj[0].smtp_server = req.body.smtp_server;
    obj[0].smtp_port = req.body.smtp_port;
    obj[0].smtp_user = req.body.smtp_user;
    obj[0].smtp_pass = req.body.smtp_pass;
    obj[0].mail_from = req.body.mail_from;
    obj[0].mail_to = req.body.mail_to;
    obj[0].mail_bcc_user = req.body.mail_bcc_user;
    obj[0].mail_reply_to_user = req.body.mail_reply_to_user;
    obj[0].send_to_min_before = req.body.send_to_min_before;
    obj[0].archive_of_day = req.body.archive_of_day;
    obj[0].mesage_template = req.body.mesage_template;
    obj[0].save();
    
    res.redirect('admin/server');
    
  });
};
