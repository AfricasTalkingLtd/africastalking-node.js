const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const os = require('os');
const ifaces = os.networkInterfaces();

const ips = [];

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }
        ips.push(iface.address);
    });
});

// routes
const indexRoutes = require('./routes/index');
const smsRoutes = require('./routes/sms');
const airtimeRoutes = require('./routes/airtime');
const paymentRoutes = require('./routes/payments');
const voiceRoutes = require('./routes/voice');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
    res.locals.commonData = {
        title: 'Africa\'s Talking',
        server: ips.map(ip => `${ip}:35897`).join('\n')
    }
    next();
});

app.use('/', indexRoutes);
app.use('/sms', smsRoutes);
app.use('/airtime', airtimeRoutes);
app.use('/payments', paymentRoutes);
app.use('/voice', voiceRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Africa\'s Talking', server: ips.map(ip => `${ip}:35897`).join('\n') });
});

module.exports = app;
