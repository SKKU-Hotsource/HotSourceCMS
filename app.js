var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session=require('express-session');
var config = require('./config/config.json')[process.env.NODE_ENV || "development"];

//storage destination
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, config.db.upload_path)
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage }, {limits: 1024 * 1024 * 20 });
var routes = require('./routes/index');
var user = require('./routes/user');
var category = require('./routes/category');
var board = require('./routes/board');
var video = require('./routes/video');
var info = require('./routes/info');
var mainAdmin = require('./routes/mainAdmin');
var slide = require('./routes/slide');
var popup = require('./routes/popup');
var paper = require('./routes/paper');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use('/views', express.static(path.join(__dirname, 'views')));

// 세션 유지 3시간
app.use(session({
    secret: 'scg',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3*60*60*1000 } 
}));

//uploading file
app.post('/upload', upload.any('userfile'), function(req, res){
  res.redirect('back');
});


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/webdata', express.static(path.join(__dirname, 'webdata')));

app.use('/', routes);
app.use('/user', user);
app.use('/category', category);
app.use('/board', board);
app.use('/video', video);
app.use('/info', info);
app.use('/slide', slide);
app.use('/mainAdmin', mainAdmin);
app.use('/popup', popup);
app.use('/paper', paper);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
