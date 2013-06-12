
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/index'),
    admin = require('./routes/admin'),
    http = require('http'),
    path = require('path'),
    MongoStore = require('connect-mongo')(express);

var flash = require('connect-flash');
var app = express();

// all environments
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'secret',
    store: new MongoStore({
      db: 'session',
      host: 'localhost',
      clear_interval: 60 * 60
    }),
    cookie: {
      httpOnly: false,
      maxAge: new Date(Date.now() + 60 *60 * 1000)
    }
  }));
  app.use(function(req, res, next){
    res.locals._id = req.session._id;
    res.locals.id = req.session.id;
    res.locals.name = req.session.name;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.idEnable = req.session.isEnable;
    
    res.locals.messages = req.session.messages;
    req.session.messages = null;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('port', process.env.PORT || 3000);
});

var loginCheck = function(req, res, next) {
  if(req.session.isEnable) {
  }
  else {
    req.session.messages = ["Account is disabled."];
    res.redirect('/login');
  };
  
  if(req.session.name) {
    next();
  }
  else {
    req.session.destroy();
    res.redirect('/login');
  };
};

var adminCheck = function(req, res, next) {
  if(req.session.isAdmin) {
    next();
  }
  else {
    res.redirect('/');
  }
};

app.get('/', loginCheck, routes.index);
app.get('/login', routes.login);
app.post('/signup', routes.signup);
app.get('/logout', routes.logout);
app.post('/account', loginCheck, routes.account);

app.get('/admin/', loginCheck, adminCheck, admin.index);
app.get('/admin/account', loginCheck, adminCheck, admin.account);
app.post('/admin/account_edit', loginCheck, adminCheck, admin.account_edit);
app.post('/admin/account_conf', loginCheck, admin.account_conf);
app.post('/admin/account_delete', loginCheck, adminCheck, admin.account_delete);


app.get('/admin/server', loginCheck, adminCheck, admin.server);
app.post('/admin/server_conf', loginCheck, adminCheck, admin.server_conf)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
