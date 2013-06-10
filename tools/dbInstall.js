 // pre execute "# node dbInstall.js"
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/CvMailForm');
var users = [
  {
    id: 'sysadmin',
    mail: 'sysadmin@localhost',
    name: 'system admin',
    password: 'sysadmin',
    isAdmin: true,
    isEnable: true,
    Description: 'Default Admin User'
    }
];

var server = [
  {
    domain: 'example.co.jp',
    smtp_server: 'localhost',
    smtp_port: '25',
    smtp_user: '',
    smtp_pass: '',
    mail_from: 'noreply@example.co.jp',
    mail_to: 'user@example.co.jp',
    mail_bcc_user: false,
    mail_reply_to_user: true,
    send_to_min_before: '30',
    archive_of_day: '365',
    mesage_template: 'メール通知内容の本文を記載して下さい。'
    }
];

db.collection('users').remove({});
db.collection('server').remove({});

db.collection('users').insert(users);
db.collection('server').insert(server);

db.close();

