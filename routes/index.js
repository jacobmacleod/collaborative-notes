var express = require('express');
var path = require('path');
var events = require('events');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var emitter = new events.EventEmitter();

