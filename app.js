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
const {Op} = require('sequelize');
const socketIo = require("socket.io");
const io = socketIo();
let passportConfig = require('./config/passport');
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const workorderRouter = require('./routes/workorder');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
const workqueueRouter = require('./routes/workqueue');
const indoorRouter = require('./routes/indoor');
const departmentsRouter = require('./routes/departments');
const partsRouter = require('./routes/parts');
const reportsRouter = require('./routes/reports');
const app = express();

app.io = io;
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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('keyboard'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'node_modules/admin-lte/dist')));
app.use('/plugins', express.static(path.join(__dirname, 'node_modules/admin-lte/plugins')));
//app.use(csrfMiddleware);
// app.use(helmet({
//     contentSecurityPolicy: false,
//
// }));

const sessionMiddleware = session({
    secret: "keyboard",
    cookie: {maxAge: 60000},
    store: new SequelizeStore({
        db: db.sequelize,
    }),
    resave: false,
    saveUninitialized: false
})

//Express Session
app.use(sessionMiddleware);
// Auth Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
//Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

require('./utils/notifications')(app.io)

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

app.io.use(wrap(sessionMiddleware));
app.io.use(wrap(passport.initialize()));
app.io.use(wrap(passport.session()));

app.io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});

app.io.on('connect', (socket) => {
    console.log(`new connection ${socket.id}`);
    socket.on('whoami', (cb) => {
        cb(socket.request.user ? socket.request.user.username : '');
    });

    const session = socket.request.session;
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
});

// GenerateDates();
// GenerateOrders();
// Middleware for notifications
app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin) {
            Notification.findAndCountAll({include: [Device, Department]})
                .then(notifications => {
                    res.locals.notifications = notifications.rows;
                    res.locals.nLength = notifications.count;
                    next();
                });
        } else {
            Notification.findAndCountAll({
                where: {
                    DepartmentId: {[Op.or]: [req.user.DepartmentId, null]}
                }, include: [Device, Department]
            })
                .then(notifications => {
                    res.locals.notifications = notifications.rows;
                    res.locals.nLength = notifications.count;
                    next();
                });
        }
    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/devices', devicesRouter);
app.use('/workqueue', workqueueRouter);
app.use('/indoor', indoorRouter);
app.use('/departments', departmentsRouter);
app.use('/parts', partsRouter);
app.use('/workorder', workorderRouter);
app.use('/reports', reportsRouter);
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
