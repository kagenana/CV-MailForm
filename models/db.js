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

var ServerSchema = new mongoose.Schema({
    domain: String,
    smtp_server: String,
    smtp_port: Number,
    smtp_user: String,
    smtp_pass: String,
    mail_from: String,
    mail_to: String,
    mail_bcc_user: Boolean,
    mail_reply_to_user: Boolean,
    send_to_min_before: Number,
    archive_of_day: Number,
    mesage_template: String
},{collection: 'server'});
exports.Server = db.model('Server', ServerSchema);

var UserSchema = new mongoose.Schema({
  id: { type: String, default: '', index: true},
  mail: { type: String, default: '' },
  name: { type: String, default: '' },
  password: { type: String, default: '', index: true },
  isAdmin: { type: Boolean, default: false },
  isEnable: { type: Boolean, default: true },
  Description: { type: String, default: '' }
},{collection: 'users'});

exports.User = db.model('User', UserSchema);
