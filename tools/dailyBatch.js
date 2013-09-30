  // daily batch "# node dailyBatch.js on TaskScheduler or crontab"
  // 0 8 * * * node /usr/local/CV-MailForm/tools/dailyBatch.js
var dd = Date.now();
console.log(dd.toLocaleString() + " : Script Start.");
setTimeout(function(){
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

  setTimeout(function() {
    console.log("DB Execute Start.");
    setTimeout(function() {
      setTimeout(function() {
        console.log("Session Store clear Start.");
        var mongoskin = require('mongoskin');
        var db2 = mongoskin.db('localhost:27017/session');
        db2.collection('sessions').remove({});
        db2.close();
        console.log("Session Store clear End.");
      }, 5000);
      User.find({ isEnable: true }, function(err, users){
        if(err){
          console.log(err);
        };
        users.forEach(function(o , i , array){
          console.log(users[i].id + ": (isState) " + users[i].isState + " -> exist");
          users[i].isState = "exist";
          users[i].save();
      
          var schedules = new Schedule();
          schedules.author_id = users[i]._id;
          schedules.subject = "exist";
          schedules.author = users[i].name;
          schedules.timeSubmit = Date.now();
          schedules.timeRequest = Date.now();
          schedules.timeReturn = null;
          schedules.isState = "archive";
          schedules.Description = "始業前自動入力";
          schedules.mailBody = "";
          schedules.save();
          console.log(users[i].id + ": add Exsist Status.");
        });
        console.log("DB Execute End.");
        setTimeout(function() {
          mongoose.disconnect();
          console.log("DB Disconnect.");
          setTimeout(function() {
            var dd = Date.now();
            console.log(dd.toLocaleString() + " : Script End.");
          }, 1000);
        }, 5000);
      });
    }, 1000);
  }, 1000);
}, 1000);
