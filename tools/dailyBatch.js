 // daily batch "# node dailyBatch.js on TaskScheduler or crontab"
var domain = 'localhost';
var mongoose = require('mongoose');
var url = 'mongodb://' + domain + '/CvMailForm';
var db = mongoose.createConnection(url, function(err, res){
  if(err) {
    console.log('Error connected: ' + url + ' - ' + err);
  }
  else {
    console.log('Success connected: ' + url);
  }
});

var UserSchema = new mongoose.Schema({
  id: { type: String, default: '', index: true},
  mail: { type: String, default: '' },
  name: { type: String, default: '' },
  name_short: { type: String, default: '' },
  password: { type: String, default: '', index: true },
  isAdmin: { type: Boolean, default: false },
  isEnable: { type: Boolean, default: true },
  isState: { type: String, default: 'exist' },
  Description: { type: String, default: '' }
},{collection: 'users'});

var ScheduleSchema = new mongoose.Schema({
  author_id: { type: String, default: '', index: true},
  subject: { type: String, default: ''},
  author: { type: String, default: ''},
  timeSubmit: { type: Date, default: Date.now },
  timeRequest: { type: Date, default: Date.now },
  timeReturn: { type: Date, default: Date.now },
  isState: { type: String, default: '' },
  Description: { type: String, default: '' },
  mailBody: { type: String, default: '' }
},{collection: 'schedule'});

var User = db.model('User', UserSchema);
var Schedule = db.model('Schedule', ScheduleSchema);

var Fiber = require('fibers');
var main = function(){
  console.log("Script Start.");
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    };
    users.forEach(function(o , i , array){
      console.log(users[i].id + ":(before) " + users[i].isState);
      users[i].isState = "exist";
      users[i].save();
    
      var schedules = new Schedule();
      schedules.author_id = users[i].id;
      schedules.subject = "exist";
      schedules.author = users[i].name + " (" + users[i].id + ")";
      schedules.timeSubmit = Date.now();
      schedules.timeRequest = Date.now();
      schedules.timeReturn = null;
      schedules.isState = "archive";
      schedules.Description = "始業前自動入力";
      schedules.mailBody = "";
      schedules.save();
    });
    console.log("User Status Reset End.");
  });
};

Fiber(main).run();

process.on('SIGINT', function() { mongoose.disconnect(); });
