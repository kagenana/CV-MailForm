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

var User = db.model('User', UserSchema);

var Fiber = require('fibers');

var main = function(){
  console.log("Script Start.");
  User.find({}, function(err, users){
    if(err){
      console.log(err);
    };
    users.forEach(function(user,i,array){
      console.log(users[i].id + ":(before) " + users[i].isState);
      users[i].isState = "exist";
      users[i].save();
    });
    console.log("Script End.");
      //process.exit();
  });
};

Fiber(main).run();
process.on('SIGINT', function() { mongoose.disconnect(); });
