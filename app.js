const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models/index');
const flash = require('express-flash');
const passport = require('passport');
const engine = require('ejs-mate');
const helmet = require('helmet');
const Device = require('./models').Device;
const Department = require('./models').Department;
const Notification = require('./models').Notification;

let passportConfig = require('./config/passport');

const workorderRouter = require('./routes/workorder');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
const workqueueRouter = require('./routes/workqueue');
const indoorRouter = require('./routes/indoor');
const departmentsRouter = require('./routes/departments');
const partsRouter = require('./routes/parts');
const app = express();


//Load Environment Variables From .env File

require('dotenv').config();

//Database Connection Test
db.sequelize
    .authenticate()
    .then(() => console.log('DB Connection Successful'))
    .catch(err => console.log('Error: ' + err));

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('keyboard'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'node_modules/admin-lte/dist')));
app.use('/plugins', express.static(path.join(__dirname, 'node_modules/admin-lte/plugins')));
//app.use(csrfMiddleware);
app.use(helmet());

//Express Session
app.use(session({
    secret: "keyboard",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
// Auth Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

//Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

app.use(function (req, res, next) {
    Notification.findAll({include :[ Device, Department ]})
        .then(notifications => {
            res.locals.notifications = notifications;
            next();
        });
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/devices', devicesRouter);
app.use('/workqueue', workqueueRouter);
app.use('/indoor', indoorRouter);
app.use('/departments', departmentsRouter);
app.use('/parts', partsRouter);
app.use('/workorder', workorderRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
require('./routes');
