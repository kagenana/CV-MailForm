var model = require('../models/db.js');
    User = model.User,
    Server = model.Server,
    Schedule = model.Schedule;

var TITLE = 'CV-MailForm Schedule';

exports.index = function(req, res){
  Schedule.find({
    author_id: req.session._id
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
      var timeRequestStr = encodeDate(schedules.timeRequest);
      var timeReturnStr = encodeDate(schedules.timeReturn);
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules, timeRequestStr: timeRequestStr, timeReturnStr: timeReturnStr });
    }
    else {
        //new
      var schedules = new Schedule();
      var session = req.session;
      var timeRequestStr = encodeDate(schedules.timeRequest);
      var timeReturnStr = encodeDate(schedules.timeReturn);
      res.render('schedule/input', { title: TITLE, session: session ,schedules: schedules, timeRequestStr: timeRequestStr, timeReturnStr: timeReturnStr });
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
      console.log(req.body.timeRequest);
      console.log(req.body.timeReturn);
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
    users.isStatus = req.body.status;
    req.session.isState = req.body.status;
    users.save();
    res.redirect('schedule/');
    
    if (req.body.status == "exist") {
    }
    else {
      var schedules = new Schedule();
      schedules.author_id = req.session._id;
      schedules.subject = req.body.status;
      schedules.author = req.session.id;
      schedules.timeSubmit = Date.now();
      schedules.timeRequest = Date.now();
      schedules.timeReturn = null;
      schedules.isState = "sent";
      schedules.Description = "簡易入力";
        //schedules.mailBody = "";
      schedules.save();
    };
  });
}

exports.archives = function(req, res){
  Schedule.find({
    author_id: req.session._id
  },
  function(err, schedules){
    if(err){
      console.log(err);
    };
    var session = req.session;
    res.render('schedule/archives', { title: TITLE, session: session, schedules: schedules });
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

