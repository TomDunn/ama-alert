#!/usr/bin/env node

var express = require('express'),
    Natural = require('natural'),
    Models  = require('./db.js').Models,
    app     = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use('/static', express.static(__dirname + '/assets/static'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

/* set up the routes */
var tokenizer = new Natural.WordTokenizer();
require('./routes')(app, Models, tokenizer.tokenize.bind(tokenizer));

/* add some helper functions for jade */
app.locals.showListOrEmpty = function(list, separator, emptyMsg) {
    if (list.length == 0 || (list.length == 1 && list[0] == ''))
        return emptyMsg;

    return list.join(separator);
};

app.listen(1080);
