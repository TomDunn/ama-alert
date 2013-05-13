#!/usr/bin/env node

var express = require('express'),
    Text    = require('./Text'),
    Models  = require('./db.js').Models,
    app     = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use('/static', express.static(__dirname + '/assets/static'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

/* set up the routes */
require('./routes')(app, Models, Text.tokenize);

app.listen(1080);
