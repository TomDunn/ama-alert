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

/* add some helper functions for jade */
app.locals.showListOrEmpty = function(list, separator, emptyMsg) {
    if (list.length == 1 && list[0] == '')
        return emptyMsg;

    return list.join(separator);
}

app.listen(1080);
