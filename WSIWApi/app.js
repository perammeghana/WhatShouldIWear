var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");


var adminAPIRouter = require('./routes/adminAPI');
var clothCategoryAPI = require('./routes/ClothCategory');
var ClothingAPI = require('./routes/Clothing');
var PreferenceAPI = require('./routes/Preference');
var RecommendAPI = require('./routes/Recommend');
var WeatherAPI = require('./routes/Weather');
var testAPIRouter = require("./routes/testAPI");
var forgotPassRouter = require("./routes/ForgotPassword");
var locationRouter = require("./routes/Location");
var logsRouter = require("./routes/logs");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(express.static("./public"))
app.use('/', express.static(path.join(__dirname, '/')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/adminAPI', adminAPIRouter);
app.use('/clothCatAPI', clothCategoryAPI);
app.use('/clothAPI', ClothingAPI);
app.use('/prefAPI', PreferenceAPI);
app.use('/recommendAPI', RecommendAPI);
app.use('/weatherAPI', WeatherAPI);
app.use("/testAPI", testAPIRouter);
app.use("/forgotPassAPI",forgotPassRouter);
app.use("/locationAPI",locationRouter);
app.use("/logsAPI",logsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
