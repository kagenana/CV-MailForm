 // pre execute "# node dbInstall.js"
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/CvMailForm');
var users = [
  { id: 'sysadmin', mail: 'sysadmin@localhost', name: 'system admin', password: 'sysadmin', isAdmin: '1', isEnable: '1', Description: 'Default Admin User' },
];

db.collection('users').remove({});
db.collection('archives').remove({});

db.collection('users').insert(users);

db.close();

