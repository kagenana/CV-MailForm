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
  id: String,
  mail: String,
  name: String,
  password: String,
  isAdmin: String,
  isEnable: String,
  Description: String
},{collection: 'users'});

exports.User = db.model('User', UserSchema);
