var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const { IamTokenManager } = require('ibm-watson/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// allows environment properties to be set in a file named .env
require('dotenv').config({ silent: true });

if (!process.env.SPEECH_TO_TEXT_IAM_APIKEY) {
    console.error('Missing required credentials - see https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials');
    process.exit(1);
}

const RateLimit = require('express-rate-limit');
app.enable('trust proxy'); // required to work properly behind Bluemix's reverse proxy

const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

const secure = require('express-secure-only');
app.use(secure());

const sttAuthenticator = new IamTokenManager({
    apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY
});

app.use('/api/speech-to-text/token', function(req, res) {
    return sttAuthenticator
      .requestToken()
      .then(({ result }) => {
        res.json({ accessToken: result.access_token, url: process.env.SPEECH_TO_TEXT_URL });
      })
      .catch(console.error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
