 // pre execute "# node dbInstall.js"
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/CvMailForm');
var users = [
  {
    id: 'sysadmin',
    mail: 'mailmaster@localhost.local',
    name: 'System Admin',
    name_short: 'Admin',
    password: 'sysadmin',
    isAdmin: true,
    isEnable: false,
    isState: 'exist',
    Description: 'Preset Admin User'
    }
];

var server = [
  {
    domain: '',
    smtp_server: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    mail_from: '',
    mail_to: '',
    mail_bcc_user: true,
    mail_reply_to_user: true,
    send_to_min_before: '',
    archive_of_day: '',
    left_subject: '',
    left_template: '',
    goout_subject: '',
    goout_template: '',
    custom_subject: '',
    custom_template: '',
    exist_subject: '',
    exist_template: '',
    absence_subject: '',
    absence_template: ''
    }
];

db.collection('users').remove({});
db.collection('server').remove({});
db.collection('schedule').remove({});

db.collection('users').insert(users);
db.collection('server').insert(server);

db.close();

