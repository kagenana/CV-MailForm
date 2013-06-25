 // pre execute "# node dbInstall.js"
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/CvMailForm');
var users = [
  {
    id: 'sysadmin',
    mail: 'mailmaster@localhost.local',
    name: 'System Admin',
    password: 'sysadmin',
    isAdmin: true,
    isEnable: true,
    isState: 'exist',
    Description: 'Preset Admin User'
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
    mail_bcc_user: true,
    mail_reply_to_user: true,
    send_to_min_before: '30',
    archive_of_day: '365',
    left_subject: '退席連絡',
    left_template: '会議などで一時退席している旨を連絡します。',
    goout_subject: '外出連絡',
    goout_template: '外出のため社内にいない旨を連絡します。',
    custom_subject: '予定連絡',
    custom_template: '開始時間〜終了時間を詳細に伝える場合に使用します。',
    exist_subject: '帰社連絡',
    exist_template: 'デスクに戻り、電話転送可能な旨を連絡します。'
    }
];

db.collection('users').remove({});
db.collection('server').remove({});

db.collection('users').insert(users);
db.collection('server').insert(server);

db.close();

