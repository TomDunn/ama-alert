#!/usr/bin/env node

var express = require('express'),
    Text    = require('./Text'),
    Models  = require('./db.js').Models,
    app     = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', function(req,res) {
    res.redirect('/rule');
});

app.get('/rule', function(req,res) {
    Models.Rule.find(function(err, models) {
        res.render('page-layout', {models: models});
    });
});

function parseRuleBody(req) {
    return {
        name:     Text.tokenize(req.body.name),
        allOf:    Text.tokenize(req.body.allOf),
        oneOf:    Text.tokenize(req.body.oneOf),
        noneOf:   Text.tokenize(req.body.noneOf),
        minScore: Number(req.body.minScore)
    };
};

app.post('/rule', function(req,res) {
    var rule = parseRuleBody(req);
    Models.Rule.create(rule, function(err) {
        if (err)
            console.log ('error' + err.toString());
        res.redirect('/');
    });
});

app.put('/rule/:ruleId', function(req,res) {
    var rule    = parseRuleBody(req);
    rule.edited = Date.now();

    Models.Rule.update({_id:req.params.ruleId}, rule, function(err, affected) {
        if (err) console.log(err);

        res.redirect('/');
    });
});

app.delete('/rule/:ruleId', function(req,res) {
    Models.Rule.find({_id:req.params.ruleId}).remove();
    res.redirect('/');
});

app.get('/notification', function(req,res) {
    Models.Notification.find(function(err, models) {
        res.render('notifications', {models: models});
    });
});

app.delete('/notification/:notifId', function(req,res) {
    console.log('delete notif');
    Models.Notification.find({_id:req.params.notifId}).remove();
    res.redirect('/notification');
});

app.listen(1080);
